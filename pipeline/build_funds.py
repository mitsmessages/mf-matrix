"""
Transform a legacy mutual-fund database into the clean MF Matrix schema.

This is the only place that knows about legacy field names. The output is a
self-contained, validated JSON dataset with:
  * canonical `sleeve` keys (ADR-0001)
  * percentage units made explicit (`*Pct` suffixes)
  * NO stored verdicts/derived flags — those are computed at runtime (ADR-0002)

Usage:
  python pipeline/build_funds.py --source path/to/fundsDatabase.ts --out src/data/funds.json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

SLEEVE_BY_CATEGORY = {
    "Flexi Cap": "flexi",
    "Large Cap": "large",
    "Mid Cap": "mid",
    "Small Cap": "small",
    "Balanced Advantage": "baf",
    "Arbitrage": "debt",
    "Gold / Commodity": "gold",
}


def parse_ts_array(text: str) -> list[dict[str, Any]]:
    start = text.index("= [") + 2
    end = text.rindex("]")
    return json.loads(text[start : end + 1])


def normalise_turnover(raw: float) -> float:
    """Legacy stored turnover as a fraction (0.18 = 18%). Emit a percentage."""
    return round(raw * 100, 1)


def num(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def transform(fund: dict[str, Any]) -> dict[str, Any]:
    category = fund["category"]
    if category not in SLEEVE_BY_CATEGORY:
        raise ValueError(f"unknown category: {category!r}")
    rolling = fund["rollingDistribution"]
    risk = fund["riskMetrics"]
    wm = fund["weightedMultiples"]

    out: dict[str, Any] = {
        "id": fund["id"],
        "name": fund["name"],
        "shortName": fund["shortName"],
        "fundHouse": fund["fundHouse"],
        "category": category,
        "sleeve": SLEEVE_BY_CATEGORY[category],
        "nav": num(fund["nav"]),
        "aumCr": num(fund["aumCr"]),
        "expenseRatioPct": num(fund["expenseRatio"]),
        "inceptionYear": int(fund["inceptionYear"]),
        "fundManager": fund["fundManager"],
        "fundManagerTenureYears": num(fund["fundManagerTenureYears"]),
        "portfolioTurnoverPct": normalise_turnover(num(fund["portfolioTurnover"])),
        "cashHoldingPct": num(fund["cashHoldingPct"]),
        "benchmark": fund["benchmark"],
        "style": fund["style"],
        "portfolioPE": num(fund["portfolioPE"]),
        "portfolioPB": num(fund["portfolioPB"]),
        "weightedMultiples": {
            "pe": num(wm.get("pe")),
            "pb": num(wm.get("pb")),
            "evEbitda": num(wm.get("evEbitda")),
            "priceToSales": num(wm.get("priceToSales")),
            "dividendYieldPct": num(wm.get("dividendYield")),
        },
        "rolling": {
            "avgPct": num(rolling["threeYearRollingAvg"]),
            "minPct": num(rolling["threeYearRollingMin"]),
            "maxPct": num(rolling["threeYearRollingMax"]),
            "benchmarkAvgPct": num(rolling["benchmarkRollingAvg"]),
            "beatBenchmarkPct": num(rolling["percentBeatingBenchmark"]),
            "positivePct": num(rolling["percentPositiveReturns"]),
            "brackets": [
                {"label": b["label"], "pct": num(b["percentage"]), "count": int(b["count"])}
                for b in rolling.get("brackets", [])
            ],
        },
        "risk": {
            "stdDevPct": num(risk["standardDeviation"]),
            "beta": num(risk["beta"]),
            "sharpe": num(risk["sharpeRatio"]),
            "treynor": num(risk["treynorRatio"]),
            "alphaPct": num(risk["jensensAlpha"]),
            "sortino": num(risk["sortinoRatio"]),
            "benchmarkSortino": num(risk["benchmarkSortino"]),
            "informationRatio": num(risk["informationRatio"]),
            "rSquared": num(risk["rSquared"]),
            "upCapturePct": num(risk["upCaptureRatio"]),
            "downCapturePct": num(risk["downCaptureRatio"]),
        },
        "marketCapBreakdown": fund.get("marketCapBreakdown")
        or {"largeCap": 0, "midCap": 0, "smallCap": 0, "cashDebt": 100, "commodity": 0},
        "topHoldings": [
            {
                "name": h["name"],
                "ticker": h["ticker"],
                "sector": h["sector"],
                "weightPct": num(h["weight"]),
                "valuationMetric": h["valuationMetric"],
                "metricValue": num(h["metricValue"]),
                "marketPrice": num(h["marketPrice"]),
                "marketCapTier": h.get("marketCapTier", "Large Cap"),
                "rationale": h.get("rationale", ""),
            }
            for h in fund.get("topHoldings", [])
        ],
        "sectorAllocation": [
            {
                "sector": s["sector"],
                "weightPct": num(s["weight"]),
                "valuationMetric": s["valuationMetric"],
                "macroSensitivity": s.get("macroSensitivity", "Defensive"),
            }
            for s in fund.get("sectorAllocation", [])
        ],
        "agentReviews": fund["agentReviews"],
    }

    profile = fund.get("managerProfile")
    if profile:
        out["managerProfile"] = {
            "name": profile["name"],
            "age": int(profile["age"]),
            "education": profile["education"],
            "totalExperienceYears": num(profile["totalExperienceYears"]),
            "tenureAtSchemeYears": num(profile["tenureAtSchemeYears"]),
            "philosophy": profile["philosophy"],
            "otherFundsManaged": [
                {
                    "name": m["name"],
                    "category": m["category"],
                    "aumCr": num(m["aumCr"]),
                    "threeYearCagrPct": num(m["threeYearCagr"]),
                }
                for m in profile.get("otherFundsManaged", [])
            ],
            "careerMilestones": profile.get("careerMilestones", []),
        }

    quarterly = fund.get("quarterlyPerformance")
    if quarterly:
        out["quarterlyPerformance"] = [
            {
                "quarter": q["quarter"],
                "fundReturnPct": num(q["fundReturn"]),
                "benchmarkReturnPct": num(q["benchmarkReturn"]),
            }
            for q in quarterly
        ]

    return out


def validate(funds: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    seen: set[str] = set()
    for f in funds:
        if f["id"] in seen:
            errors.append(f"duplicate id: {f['id']}")
        seen.add(f["id"])
        if f["portfolioTurnoverPct"] < 0 or f["portfolioTurnoverPct"] > 1000:
            errors.append(f"{f['id']}: turnover out of range {f['portfolioTurnoverPct']}")
        if f["expenseRatioPct"] <= 0 or f["expenseRatioPct"] > 3:
            errors.append(f"{f['id']}: expense ratio suspicious {f['expenseRatioPct']}")
        mc = f["marketCapBreakdown"]
        total = sum(mc.values())
        if abs(total - 100) > 0.5:
            errors.append(f"{f['id']}: market cap breakdown sums to {total}")
        if "fiveStepFilter" in f:
            errors.append(f"{f['id']}: derived verdict leaked into dataset")
    return errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--as-of", default="2024-12-31")
    args = ap.parse_args()

    text = Path(args.source).read_text(encoding="utf-8")
    raw = parse_ts_array(text)
    funds = [transform(f) for f in raw]

    # Merge hand-authored supplements (already in the new schema) if present.
    supplement_path = Path(__file__).with_name("supplemental_funds.json")
    if supplement_path.exists():
        supplements = json.loads(supplement_path.read_text(encoding="utf-8"))
        funds.extend(supplements)
        print(f"Merged {len(supplements)} supplemental funds")

    errors = validate(funds)
    if errors:
        print("VALIDATION FAILED:", file=sys.stderr)
        for e in errors:
            print("  -", e, file=sys.stderr)
        return 1

    payload = {
        "asOf": args.as_of,
        "provenance": "synthetic-teaching-dataset",
        "note": (
            "Metrics are representative figures for a teaching tool. Not investment advice. "
            "Verdicts are derived at runtime (ADR-0002)."
        ),
        "funds": funds,
    }
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(funds)} funds -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
