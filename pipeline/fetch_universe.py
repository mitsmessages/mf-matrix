"""
Fetch the real mutual-fund universe and emit a ranked, metrics-only dataset.

Sources
-------
* AMFI  : https://www.amfiindia.com/spages/NAVAll.txt   (scheme list, latest NAV)
* mfapi : https://api.mfapi.in/mf/{code}                (NAV history + SEBI category)

It ranks the top N funds per category by a transparent composite, computes
rolling/risk metrics against a category-consensus benchmark, and writes:
  - src/data/universe.generated.json   (validated by the app schema)
  - src/data/universe_changelog.json   (retained / new / dropped)

Holdings, manager bios and TER are NOT in these feeds, so generated funds are
marked `dataQuality: "metrics-only"`. They are explicitly labelled in the UI.

Usage:
  python pipeline/fetch_universe.py
  python pipeline/fetch_universe.py --top 12 --candidates 40
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime
from pathlib import Path
from typing import Any

NAVALL_URL = "https://www.amfiindia.com/spages/NAVAll.txt"
MFAPI_URL = "https://api.mfapi.in/mf/{code}"
RF_ANNUAL = 0.06  # risk-free assumption used for alpha / sortino

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "content" / "generated" / "cache"
OUT = ROOT / "src" / "data" / "universe.generated.json"
CHANGELOG = ROOT / "src" / "data" / "universe_changelog.json"

SLEEVE_BY_CATEGORY = {
    "Flexi Cap": "flexi",
    "Large Cap": "large",
    "Mid Cap": "mid",
    "Small Cap": "small",
    "Balanced Advantage": "baf",
    "Arbitrage": "debt",
    "Gold / Commodity": "gold",
}


# --------------------------------------------------------------------- HTTP

def http_get(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "mf-matrix-pipeline/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:  # noqa: S310
        return resp.read().decode("utf-8", errors="ignore")


def fetch_navall() -> str:
    CACHE.mkdir(parents=True, exist_ok=True)
    cached = CACHE / "NAVAll.txt"
    if cached.exists() and date.fromtimestamp(cached.stat().st_mtime) == date.today():
        return cached.read_text(encoding="utf-8", errors="ignore")
    text = http_get(NAVALL_URL, timeout=60)
    cached.write_text(text, encoding="utf-8")
    return text


CACHE_TTL_DAYS = 6


def fetch_history(code: int) -> dict[str, Any] | None:
    CACHE.mkdir(parents=True, exist_ok=True)
    cached = CACHE / "nav" / f"{code}.json"
    if cached.exists() and (time.time() - cached.stat().st_mtime) < CACHE_TTL_DAYS * 86_400:
        try:
            return json.loads(cached.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    try:
        raw = http_get(MFAPI_URL.format(code=code), timeout=30)
        data = json.loads(raw)
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, TimeoutError):
        return None
    cached.parent.mkdir(parents=True, exist_ok=True)
    cached.write_text(json.dumps(data), encoding="utf-8")
    return data


# ---------------------------------------------------------------- parsing

def classify_category(scheme_category: str, scheme_name: str) -> str | None:
    hay = f"{scheme_category} {scheme_name}".lower()
    # Gold first: allow domestic gold ETFs and gold savings funds, but never
    # overseas / mining wrappers (they behave like equity, not gold).
    if "gold" in hay and "gold loan" not in hay:
        if any(x in hay for x in ("overseas", "mining", "world")):
            return None
        return "Gold / Commodity"
    # Everything else must not be a fund-of-fund or overseas wrapper.
    if "fund of fund" in hay or "fof" in hay or "overseas" in hay:
        return None
    if "arbitrage" in hay:
        return "Arbitrage"
    if "dynamic asset allocation" in hay or "balanced advantage" in hay:
        return "Balanced Advantage"
    if "flexi cap" in hay:
        return "Flexi Cap"
    if "large & mid" in hay or "large and mid" in hay:
        return None
    if "small & mid" in hay or "small and mid" in hay:
        return None
    if "large cap" in hay:
        return "Large Cap"
    if "mid cap" in hay:
        return "Mid Cap"
    if "small cap" in hay:
        return "Small Cap"
    return None


SECTION_RE = re.compile(
    r"^(Open Ended Schemes|Close Ended Schemes|Interval Fund)\s*\((.*)\)\s*$"
)


def parse_navall(text: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    section = ""
    for line in text.splitlines():
        header = SECTION_RE.match(line.strip())
        if header:
            section = f"{header.group(1)} - {header.group(2)}"
            continue
        parts = line.split(";")
        if len(parts) != 8:
            continue
        # Only open-ended schemes belong in the screened universe.
        if not section.lower().startswith("open ended"):
            continue
        code, _isin1, _isin2, name, plan, option, nav, dt = (p.strip() for p in parts)
        if not code.isdigit():
            continue
        try:
            nav_val = float(nav)
        except ValueError:
            continue
        rows.append(
            {
                "code": int(code),
                "name": name,
                "plan": plan,
                "option": option,
                "nav": nav_val,
                "date": dt,
                "section": section,
            }
        )
    return rows


def is_direct_growth(plan: str, option: str) -> bool:
    pl, op = plan.lower(), option.lower()
    return pl == "direct plan" and "growth" in op and "idcw" not in op and "dividend" not in op


# Category → index-fund proxy used as the benchmark (real NAV, not consensus).
BENCHMARK_MATCHERS = {
    "Flexi Cap": ["nifty 500 index"],
    "Large Cap": ["nifty 50 index"],
    "Mid Cap": ["nifty midcap 150 index"],
    "Small Cap": ["nifty smallcap 250 index"],
    "Balanced Advantage": ["nifty 500 index"],
}
BENCHMARK_EXCLUDE = (
    "momentum", "quality", "fof", "etf", "elss", "equal", "value",
    "alpha", "dividend", "consumption", "bank", "it ", "pharma", "auto", "energy",
)


def pick_proxy(category: str, rows: list[dict[str, Any]]) -> dict[str, Any] | None:
    matchers = BENCHMARK_MATCHERS.get(category)
    if not matchers:
        return None
    for row in rows:
        name = row["name"].lower()
        section = row.get("section", "").lower()
        if "index" not in section:
            continue
        if not any(m in name for m in matchers):
            continue
        if any(x in name for x in BENCHMARK_EXCLUDE):
            continue
        if not is_direct_growth(row.get("plan", ""), row.get("option", "")):
            continue
        return row
    return None


def is_eligible(category: str, plan: str, option: str) -> bool:
    """Direct + growth only. Gold ETFs are exempt from the plan/option rule."""
    pl, op = plan.lower(), option.lower()
    if "idcw" in op or "dividend" in op:
        return False
    if category == "Gold / Commodity":
        return pl in ("direct plan", "") and (op == "" or "growth" in op)
    return pl == "direct plan" and "growth" in op


def parse_history(data: dict[str, Any]) -> list[tuple[date, float]]:
    out: list[tuple[date, float]] = []
    for row in data.get("data", []):
        try:
            dt = datetime.strptime(row["date"], "%d-%m-%Y").date()
            nav = float(row["nav"])
        except (ValueError, KeyError):
            continue
        if nav > 0:
            out.append((dt, nav))
    out.sort(key=lambda x: x[0])
    return out


def month_end_series(series: list[tuple[date, float]]) -> dict[str, float]:
    """Last observation per calendar month."""
    months: dict[str, float] = {}
    for dt, nav in series:
        months[f"{dt.year:04d}-{dt.month:02d}"] = nav
    return dict(sorted(months.items()))


# ------------------------------------------------------------------ metrics

def annualised(months: int, start: float, end: float) -> float:
    if months <= 0 or start <= 0 or end <= 0:
        return 0.0
    years = months / 12.0
    if years <= 0:
        return 0.0
    return (end / start) ** (1 / years) - 1


def monthly_returns(series: dict[str, float]) -> dict[str, float]:
    keys = list(series)
    out: dict[str, float] = {}
    for prev, cur in zip(keys, keys[1:]):
        a, b = series[prev], series[cur]
        if a > 0:
            out[cur] = b / a - 1
    return out


def mean(xs: list[float]) -> float:
    return sum(xs) / len(xs) if xs else 0.0


def stdev(xs: list[float]) -> float:
    if len(xs) < 2:
        return 0.0
    m = mean(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1))


def max_drawdown(levels: list[float]) -> float:
    peak = levels[0] if levels else 0.0
    worst = 0.0
    for v in levels:
        peak = max(peak, v)
        if peak > 0:
            worst = min(worst, v / peak - 1)
    return worst * 100


def build_benchmark(series_by_code: dict[int, dict[str, float]]) -> dict[str, float]:
    """Equal-weight category benchmark: average monthly return -> level index."""
    rets_by_code = {c: monthly_returns(s) for c, s in series_by_code.items()}
    all_months = sorted({m for r in rets_by_code.values() for m in r})
    level = 100.0
    levels = {all_months[0]: level} if all_months else {}
    for m in all_months[1:]:
        vals = [r[m] for r in rets_by_code.values() if m in r]
        if vals:
            level *= 1 + mean(vals)
        levels[m] = level
    return levels


def compute_metrics(
    series: dict[str, float],
    benchmark: dict[str, float],
) -> dict[str, Any] | None:
    if len(series) < 40:  # need ~3.3 years to be useful
        return None
    months = sorted(set(series) & set(benchmark))
    if len(months) < 40:
        return None
    fund = {m: series[m] for m in months}
    bench = {m: benchmark[m] for m in months}

    # Rolling 3Y windows (36 months) over the last 10 years.
    windows: list[tuple[float, float]] = []
    # Most recent up-to-120 rolling windows (older if history is short).
    window_count = len(months) - 36
    for i in range(max(0, window_count - 120), window_count):
        start, end = months[i], months[i + 36]
        f = annualised(36, fund[start], fund[end])
        b = annualised(36, bench[start], bench[end])
        windows.append((f, b))
    if not windows:
        return None
    beat = sum(1 for f, b in windows if f > b) / len(windows) * 100
    positive = sum(1 for f, _ in windows if f > 0) / len(windows) * 100
    rolling_avg = mean([f for f, _ in windows]) * 100
    rolling_min = min(f for f, _ in windows) * 100
    rolling_max = max(f for f, _ in windows) * 100
    bench_avg = mean([b for _, b in windows]) * 100

    # Monthly return series for risk metrics.
    fr: list[float] = []
    br: list[float] = []
    for prev, cur in zip(months, months[1:]):
        fr.append(fund[cur] / fund[prev] - 1)
        br.append(bench[cur] / bench[prev] - 1)
    if len(fr) < 24:
        return None

    rf_m = RF_ANNUAL / 12
    vol = stdev(fr) * math.sqrt(12) * 100
    bench_vol = stdev(br) * math.sqrt(12) * 100
    mu_f, mu_b = mean(fr), mean(br)
    cov = sum((f - mu_f) * (b - mu_b) for f, b in zip(fr, br)) / (len(fr) - 1)
    var_b = stdev(br) ** 2
    beta = cov / var_b if var_b > 0 else 0.0
    bench_3y = annualised(36, bench[months[-37]], bench[months[-1]])
    fund_3y = annualised(36, fund[months[-37]], fund[months[-1]])
    alpha = (fund_3y - (RF_ANNUAL + beta * (bench_3y - RF_ANNUAL))) * 100

    excess = [f - rf_m for f in fr]
    downside = math.sqrt(mean([min(0.0, e) ** 2 for e in excess]))
    sortino = (mean(excess) / downside * math.sqrt(12)) if downside > 0 else 0.0

    active = [f - b for f, b in zip(fr, br)]
    tracking = stdev(active) * math.sqrt(12)
    info_ratio = (mean(active) * 12 / tracking) if tracking > 0 else 0.0

    corr = cov / (stdev(fr) * stdev(br)) if stdev(fr) * stdev(br) > 0 else 0.0
    up_f = [f for f, b in zip(fr, br) if b > 0]
    up_b = [b for b in br if b > 0]
    down_f = [f for f, b in zip(fr, br) if b < 0]
    down_b = [b for b in br if b < 0]
    up_capture = (mean(up_f) / mean(up_b) * 100) if up_b and mean(up_b) != 0 else 0.0
    down_capture = (mean(down_f) / mean(down_b) * 100) if down_b and mean(down_b) != 0 else 0.0

    start_m = months[0]
    years = (len(months) - 1) / 12
    cagr = annualised(len(months) - 1, fund[start_m], fund[months[-1]]) * 100

    return {
        "beatBenchmarkPct": round(beat, 1),
        "positivePct": round(positive, 1),
        "rollingAvgPct": round(rolling_avg, 2),
        "rollingMinPct": round(rolling_min, 2),
        "rollingMaxPct": round(rolling_max, 2),
        "benchmarkAvgPct": round(bench_avg, 2),
        "stdDevPct": round(vol, 2),
        "benchmarkStdDevPct": round(bench_vol, 2),
        "beta": round(beta, 2),
        "alphaPct": round(alpha, 2),
        "sortino": round(sortino, 2),
        "upCapturePct": round(up_capture, 1),
        "downCapturePct": round(down_capture, 1),
        "informationRatio": round(info_ratio, 2),
        "rSquared": round(corr**2, 2),
        "maxDrawdownPct": round(max_drawdown(list(fund.values())), 1),
        "cagrPct": round(cagr, 2),
        "historyYears": round(years, 1),
        "windows": len(windows),
        "lastNav": round(fund[months[-1]], 4),
        "firstYear": int(months[0][:4]),
        # Compact recent monthly returns for the backtest (last 120 months).
        "monthlyReturns": {
            m: round(r * 100, 3)
            for m, r in list(monthly_returns(series).items())[-120:]
        },
    }


# ------------------------------------------------------------------- rank

def percentile_rank(value: float, values: list[float], higher_better: bool = True) -> float:
    if not values:
        return 0.0
    lo, hi = min(values), max(values)
    if hi == lo:
        return 50.0
    pct = (value - lo) / (hi - lo) * 100
    return pct if higher_better else 100 - pct


def composite(metrics: dict[str, Any], peers: list[dict[str, Any]]) -> float:
    def pr(key: str, higher=True):
        return percentile_rank(metrics[key], [p[key] for p in peers], higher)

    return round(
        0.30 * pr("beatBenchmarkPct")
        + 0.18 * pr("sortino")
        + 0.18 * pr("alphaPct")
        + 0.18 * pr("spread")
        + 0.16 * pr("downCapturePct", higher=False),
        2,
    )


def clean_short_name(name: str) -> str:
    short = name.split(" - ")[0].strip()
    if len(short) < 4:  # e.g. "UTI" before the dash
        short = name.strip()[:48]
    return short


def to_fund(
    code: int,
    meta: dict[str, Any],
    category: str,
    metrics: dict[str, Any],
    rank: int,
    is_new: bool,
    benchmark_label: str = "Category consensus benchmark",
) -> dict[str, Any]:
    sleeve = SLEEVE_BY_CATEGORY[category]
    full_name = meta.get("scheme_name") or f"Scheme {code}"
    return {
        "id": f"amfi-{code}",
        "schemeCode": code,
        "name": full_name,
        "shortName": clean_short_name(full_name),
        "fundHouse": meta.get("fund_house") or "Unknown",
        "category": category,
        "sleeve": sleeve,
        "nav": metrics.get("lastNav", 0.0),
        "aumCr": 0.0,
        "expenseRatioPct": 0.0,
        "inceptionYear": metrics.get("firstYear", 0),
        "fundManager": "See AMFI disclosure",
        "fundManagerTenureYears": 0,
        "portfolioTurnoverPct": 0,
        "cashHoldingPct": 0,
        "benchmark": benchmark_label,
        "style": "Blend",
        "portfolioPE": 0,
        "portfolioPB": 0,
        "rolling": {
            "avgPct": metrics["rollingAvgPct"],
            "minPct": metrics["rollingMinPct"],
            "maxPct": metrics["rollingMaxPct"],
            "benchmarkAvgPct": metrics["benchmarkAvgPct"],
            "beatBenchmarkPct": metrics["beatBenchmarkPct"],
            "positivePct": metrics["positivePct"],
            "brackets": [],
        },
        "risk": {
            "stdDevPct": metrics["stdDevPct"],
            "beta": metrics["beta"],
            "sharpe": 0.0,
            "treynor": 0.0,
            "alphaPct": metrics["alphaPct"],
            "sortino": metrics["sortino"],
            "benchmarkSortino": 0.0,
            "informationRatio": metrics["informationRatio"],
            "rSquared": metrics["rSquared"],
            "upCapturePct": metrics["upCapturePct"],
            "downCapturePct": metrics["downCapturePct"],
        },
        "topHoldings": [],
        "sectorAllocation": [],
        "monthlyReturnsPct": metrics.get("monthlyReturns", {}),
        "rankInCategory": rank,
        "isNewEntry": is_new,
        "historyYears": metrics["historyYears"],
        "dataQuality": "metrics-only",
        "asOf": metrics.get("asOf", ""),
        "source": "AMFI NAVAll + mfapi.in",
    }


# -------------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=12)
    ap.add_argument("--candidates", type=int, default=45, help="max per category to fetch")
    args = ap.parse_args()

    print("Downloading AMFI NAVAll...")
    rows = parse_navall(fetch_navall())
    print(f"  {len(rows)} direct-growth schemes")

    candidates: dict[str, list[dict[str, Any]]] = {}
    seen_codes: set[int] = set()
    for row in rows:
        # AMFI section header is authoritative; the name is a fallback.
        cat = classify_category(row.get("section", ""), row["name"])
        if not cat or not is_eligible(cat, row.get("plan", ""), row.get("option", "")):
            continue
        if row["code"] in seen_codes:
            continue
        seen_codes.add(row["code"])
        candidates.setdefault(cat, []).append(row)
    for cat in candidates:
        candidates[cat] = candidates[cat][: args.candidates]
    print("  candidates:", {k: len(v) for k, v in candidates.items()})

    fetched: dict[str, list[tuple[dict[str, Any], list[tuple[date, float]]]]] = {}
    codes = [row["code"] for rows_ in candidates.values() for row in rows_]
    histories: dict[int, dict[str, Any]] = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fetch_history, code): code for code in codes}
        done = 0
        for fut in as_completed(futures):
            code = futures[fut]
            data = fut.result()
            if data:
                histories[code] = data
            done += 1
            if done % 40 == 0:
                print(f"  fetched {done}/{len(codes)}")
    print(f"  histories: {len(histories)}")

    for cat, rows_ in candidates.items():
        for row in rows_:
            data = histories.get(row["code"])
            if not data:
                continue
            meta = data.get("meta", {})
            real_cat = classify_category(meta.get("scheme_category", ""), meta.get("scheme_name", ""))
            if real_cat != cat:
                continue
            series = month_end_series(parse_history(data))
            if len(series) >= 40:
                fetched.setdefault(cat, []).append(({"meta": meta, "code": row["code"], "name": row["name"]}, series))

    # Diff against the previously committed generated file so the changelog
    # works in CI (the last run is in the checkout).
    previous: dict[str, set[int]] = {}
    if OUT.exists():
        try:
            prev = json.loads(OUT.read_text(encoding="utf-8"))
            for f in prev.get("funds", []):
                if f.get("schemeCode"):
                    previous.setdefault(f["category"], set()).add(f["schemeCode"])
        except json.JSONDecodeError:
            previous = {}

    as_of = date.today().isoformat()
    funds: list[dict[str, Any]] = []
    changelog: dict[str, Any] = {"asOf": as_of, "categories": {}}
    cat_benchmarks: dict[str, Any] = {}

    for cat, entries in fetched.items():
        # Prefer a real index-fund NAV as the benchmark; fall back to consensus.
        proxy = pick_proxy(cat, rows)
        bench_source = None
        bench_label = "Category consensus benchmark"
        if proxy:
            data = histories.get(proxy["code"]) or fetch_history(proxy["code"])
            if data:
                series = month_end_series(parse_history(data))
                if len(series) >= 40:
                    bench_source = series
                    bench_label = f"{proxy['name']} (index-fund proxy)"
                    print(f"  {cat}: benchmark = {bench_label}")
        benchmark = bench_source or build_benchmark({e[0]["code"]: e[1] for e in entries})
        cat_benchmarks[cat] = {
            "label": bench_label,
            "monthlyReturnsPct": {
                m: round(r * 100, 3)
                for m, r in list(monthly_returns(benchmark).items())[-120:]
            },
        }
        scored = []
        for item, series in entries:
            m = compute_metrics(series, benchmark)
            if not m:
                continue
            m["asOf"] = as_of
            m["spread"] = round(m["upCapturePct"] - m["downCapturePct"], 1)
            scored.append((item, m))
        if not scored:
            continue
        peers = [m for _, m in scored]
        for item, m in scored:
            m["composite"] = composite(m, peers)
        scored.sort(key=lambda x: x[1]["composite"], reverse=True)

        top = scored[: args.top]
        prev_codes = previous.get(cat, set())
        retained, new_entries, dropped = [], [], []
        current_codes = set()
        for rank, (item, m) in enumerate(top, start=1):
            code = item["code"]
            current_codes.add(code)
            is_new = bool(prev_codes) and code not in prev_codes
            funds.append(to_fund(code, item["meta"], cat, m, rank, is_new, bench_label))
            (new_entries if is_new else retained).append({"code": code, "name": item["name"][:60], "rank": rank})
        dropped = [{"code": c} for c in prev_codes - current_codes]
        changelog["categories"][cat] = {
            "retained": retained,
            "newEntries": new_entries,
            "dropped": dropped,
        }
        print(f"  {cat}: top {len(top)} ranked (new={len(new_entries)}, dropped={len(dropped)})")

    payload = {
        "asOf": as_of,
        "provenance": "AMFI NAVAll + mfapi.in (metrics-only; holdings not included)",
        "note": (
            "Metrics computed from NAV history against a category-consensus benchmark. "
            "Holdings, TER and manager data are not in these feeds and are shown as unavailable. "
            "Educational tool; not investment advice."
        ),
        "benchmarks": cat_benchmarks,
        "funds": funds,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    CHANGELOG.parent.mkdir(parents=True, exist_ok=True)
    CHANGELOG.write_text(json.dumps(changelog, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(funds)} funds -> {OUT}")
    print(f"Wrote changelog -> {CHANGELOG}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
