"""
Phase 3b — weekly holdings + fund-manager discovery for the same refresh job.

Free-source strategy:
  1. AMFI's portfolio-disclosure page is a registry of per-AMC disclosure URLs.
  2. For each AMC we discover the latest monthly portfolio file (XLS/XLSX/CSV/HTML).
  3. We store a manifest (file digest + period) so weekly runs only act on NEW
     filings, and we emit a changelog of holdings / manager changes.

Parsing is best-effort and never fails the build:
  - XLSX  : stdlib (zip + XML)
  - CSV   : stdlib
  - HTML  : stdlib (table extraction)
  - XLS   : requires `xlrd` (installed in CI); skipped locally if absent.

Outputs (all safe to commit; not yet consumed by the app):
  - src/data/holdings.generated.json          (scheme holdings, best effort)
  - src/data/holdings_changelog.json          (new filings + manager changes)
  - content/generated/cache/holdings_manifest.json (freshness baseline)

Usage:
  python pipeline/fetch_holdings.py --amc-limit 8
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import sys
import urllib.error
import urllib.request
import zipfile
from datetime import date
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

REGISTRY_URL = "https://www.amfiindia.com/online-center/portfolio-disclosure"
ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "content" / "generated" / "cache" / "holdings"
MANIFEST = ROOT / "content" / "generated" / "cache" / "holdings_manifest.json"
OUT = ROOT / "src" / "data" / "holdings.generated.json"
CHANGELOG = ROOT / "src" / "data" / "holdings_changelog.json"

FILE_RE = re.compile(r'href="([^"]+\.(?:xlsx?|csv|html?))"', re.IGNORECASE)
# AMFI embeds the AMC links inside JS/JSON, so match raw URLs (handle \/ escapes).
EXTERNAL_RE = re.compile(r'https?:(?:\\?/){2}[^"\'<>\s\\]+', re.IGNORECASE)
MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}
PERIOD_RE = re.compile(
    r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s_\-.]*(20\d{2})",
    re.IGNORECASE,
)
PERIOD_RE_ALT = re.compile(r"(20\d{2})[\s_\-.]*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)", re.IGNORECASE)


# --------------------------------------------------------------------- HTTP

def http_bytes(url: str, timeout: int = 45) -> bytes:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (mf-matrix-pipeline/1.0)"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:  # noqa: S310
        return resp.read()


def http_text(url: str, timeout: int = 45) -> str:
    return http_bytes(url, timeout).decode("utf-8", errors="ignore")


def absolute(base: str, href: str) -> str:
    if href.startswith("http"):
        return href
    from urllib.parse import urljoin

    return urljoin(base, href)


# --------------------------------------------------------------- discovery

# AMC disclosure pages that are server-rendered (the rest need JS adapters).
SEED_PAGES = [
    {"amc": "amc.ppfas.com", "url": "https://amc.ppfas.com/downloads/portfolio-disclosure"},
]


def fetch_registry(limit: int) -> list[dict[str, str]]:
    html = http_text(REGISTRY_URL)
    seen: dict[str, dict[str, str]] = {}
    blocked = (
        "amfiindia", "facebook", "twitter", "x.com", "linkedin", "youtube",
        "instagram", "google", "whatsapp", "telegram", "sebi.gov",
    )
    for m in EXTERNAL_RE.finditer(html):
        url = m.group(0).replace("\\/", "/").rstrip('\\",)')
        lower = url.lower()
        if any(b in lower for b in blocked) or lower.endswith((".css", ".js", ".png", ".jpg", ".svg")):
            continue
        parts = url.split("/")
        if len(parts) < 3 or "." not in parts[2]:
            continue
        host = parts[2]
        seen.setdefault(host, {"amc": host, "url": url})
    items = list(seen.values())
    items = items[:limit] if limit > 0 else items
    # Always include known static pages, even if they fall outside the limit.
    for seed in SEED_PAGES:
        if not any(i["amc"] == seed["amc"] for i in items):
            items.append(seed)
    return items


def period_score(text: str) -> tuple[int, int]:
    low = text.lower()
    m = PERIOD_RE.search(low)
    if m:
        return int(m.group(2)), MONTHS.get(m.group(1)[:3], 0)
    m = PERIOD_RE_ALT.search(low)
    if m:
        return int(m.group(1)), MONTHS.get(m.group(2)[:3], 0)
    return (0, 0)


def discover_file(amc: dict[str, str]) -> dict[str, Any] | None:
    try:
        html = http_text(amc["url"])
    except (urllib.error.URLError, TimeoutError, ValueError):
        return None
    best: dict[str, Any] | None = None
    for m in FILE_RE.finditer(html):
        href = m.group(1)
        if not re.search(r"portfolio|holding", href, re.IGNORECASE):
            continue
        file_url = absolute(amc["url"], href)
        year, month = period_score(href)
        if best is None or (year, month) > (best["year"], best["month"]):
            best = {"file": file_url, "year": year, "month": month}
    return best


# ---------------------------------------------------------------- parsing

def parse_xlsx(data: bytes) -> list[list[str]]:
    """Minimal XLSX reader using only the standard library."""
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        shared: list[str] = []
        if "xl/sharedStrings.xml" in z.namelist():
            ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in root.findall(f"{ns}si"):
                shared.append("".join(t.text or "" for t in si.iter(f"{ns}t")))
        sheet_name = next((n for n in z.namelist() if re.match(r"xl/worksheets/sheet1\.xml", n)), None)
        if not sheet_name:
            return []
        ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
        root = ET.fromstring(z.read(sheet_name))
        rows: list[list[str]] = []
        for row in root.iter(f"{ns}row"):
            cells: list[str] = []
            for c in row.findall(f"{ns}c"):
                value = c.find(f"{ns}v")
                text = value.text if value is not None else ""
                if c.get("t") == "s" and text and text.isdigit():
                    text = shared[int(text)] if int(text) < len(shared) else ""
                cells.append((text or "").strip())
            if any(cells):
                rows.append(cells)
        return rows


def parse_xls(data: bytes) -> list[list[str]]:
    try:
        import xlrd  # type: ignore
    except ImportError:
        return []
    book = xlrd.open_workbook(file_contents=data)
    rows: list[list[str]] = []
    for sheet in book.sheets():
        for r in range(sheet.nrows):
            cells = [str(sheet.cell_value(r, c)).strip() for c in range(sheet.ncols)]
            if any(cells):
                rows.append(cells)
    return rows


def parse_csv(data: bytes) -> list[list[str]]:
    text = data.decode("utf-8", errors="ignore")
    return [row for row in csv.reader(io.StringIO(text)) if any(cell.strip() for cell in row)]


def parse_html_tables(data: bytes) -> list[list[str]]:
    html = data.decode("utf-8", errors="ignore")
    rows: list[list[str]] = []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.IGNORECASE | re.DOTALL):
        cells = re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.IGNORECASE | re.DOTALL)
        cleaned = [re.sub(r"<[^>]+>", "", c).replace("&nbsp;", " ").strip() for c in cells]
        if any(cleaned):
            rows.append(cleaned)
    return rows


def parse_any(data: bytes, file_url: str) -> tuple[list[list[str]], str]:
    low = file_url.lower()
    if low.endswith(".xlsx"):
        return parse_xlsx(data), "xlsx"
    if low.endswith(".xls"):
        rows = parse_xls(data)
        return rows, ("xls" if rows else "xls-no-parser")
    if low.endswith(".csv"):
        return parse_csv(data), "csv"
    if low.endswith((".html", ".htm")):
        return parse_html_tables(data), "html"
    return [], "unknown"


ISIN_RE = re.compile(r"^IN[A-Z0-9]{10}$")


def extract_holdings(rows: list[list[str]]) -> list[dict[str, Any]]:
    holdings: list[dict[str, Any]] = []
    for row in rows:
        isin = next((c for c in row if ISIN_RE.match(c)), None)
        if not isin:
            continue
        name = next((c for c in row if len(c) > 4 and not ISIN_RE.match(c) and not c.replace(".", "").isdigit()), "")
        pct = None
        for c in reversed(row):
            try:
                value = float(c.replace(",", "").replace("%", ""))
            except ValueError:
                continue
            if 0 <= value <= 100:
                pct = value
                break
        if name:
            holdings.append({"name": name[:80], "isin": isin, "pctNav": pct})
    return holdings


MANAGER_RE = re.compile(r"fund manager|managed by|portfolio manager", re.IGNORECASE)


def extract_managers(rows: list[list[str]]) -> list[str]:
    found: set[str] = set()
    for row in rows:
        for i, cell in enumerate(row):
            if MANAGER_RE.search(cell):
                for other in row[i + 1 :]:
                    if other and not MANAGER_RE.search(other) and len(other) < 60:
                        found.add(other.strip())
    return sorted(found)


# ------------------------------------------------------------------ main

def load_json(path: Path, default: Any) -> Any:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return default
    return default


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--amc-limit", type=int, default=8, help="0 = all AMCs")
    args = ap.parse_args()

    print("Fetching AMFI disclosure registry...")
    registry = fetch_registry(args.amc_limit)
    print(f"  {len(registry)} AMC disclosure pages")

    manifest = load_json(MANIFEST, {})
    as_of = date.today().isoformat()
    holdings_by_amc: dict[str, Any] = {}
    events: list[dict[str, Any]] = []

    for amc in registry:
        found = discover_file(amc)
        if not found:
            manifest[amc["amc"]] = {**manifest.get(amc["amc"], {}), "status": "no-file", "checkedAt": as_of}
            continue
        file_url = found["file"]
        try:
            data = http_bytes(file_url)
        except (urllib.error.URLError, TimeoutError, ValueError):
            manifest[amc["amc"]] = {**manifest.get(amc["amc"], {}), "status": "fetch-error", "checkedAt": as_of}
            continue

        digest = hashlib.sha256(data).hexdigest()
        previous = manifest.get(amc["amc"], {})
        period = f"{found['year']:04d}-{found['month']:02d}"
        changed = previous.get("sha256") != digest
        if not changed:
            continue

        rows, kind = parse_any(data, file_url)
        holdings = extract_holdings(rows)
        managers = extract_managers(rows)
        managers_changed = [
            m for m in managers if m not in (previous.get("managers") or [])
        ]
        holdings_by_amc[amc["amc"]] = {
            "file": file_url,
            "period": period,
            "format": kind,
            "holdings": holdings,
            "managers": managers,
        }
        events.append(
            {
                "amc": amc["amc"],
                "event": "new" if previous.get("sha256") is None else "updated",
                "period": period,
                "format": kind,
                "holdings": len(holdings),
                "managers": managers,
                "managersChanged": managers_changed,
            }
        )
        manifest[amc["amc"]] = {
            "sha256": digest,
            "file": file_url,
            "period": period,
            "format": kind,
            "managers": managers,
            "holdings": len(holdings),
            "fetchedAt": as_of,
            "status": "parsed" if rows else "unparsed",
        }
        print(f"  {amc['amc']}: {period} [{kind}] holdings={len(holdings)} managers={len(managers)}")

    CACHE.mkdir(parents=True, exist_ok=True)
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "asOf": as_of,
                "provenance": "AMFI AMC portfolio disclosures (best-effort parse)",
                "note": "Holdings are parsed from per-AMC filings and may be incomplete.",
                "amc": holdings_by_amc,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    CHANGELOG.write_text(
        json.dumps({"asOf": as_of, "events": events}, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote {len(holdings_by_amc)} AMC updates -> {OUT}")
    if events:
        for e in events:
            print(f"  NOTIFY: {e['event']} filing {e['period']} for {e['amc']}"
                  + (f" · manager change: {', '.join(e['managersChanged'])}" if e["managersChanged"] else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
