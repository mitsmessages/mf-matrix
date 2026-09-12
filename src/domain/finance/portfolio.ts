/**
 * Stage 4 — portfolio-level risk.
 *
 * Risk is covariance-based, not a weighted average of drawdowns. That is the
 * whole point of the asset-allocation lecture: uncorrelated sleeves reduce
 * portfolio variance below the weighted sum of their risks.
 */
import { SLEEVES, SLEEVE_KEYS } from "./sleeves";
import type { SleeveKey } from "./sleeves";
import type { Fund, SleeveWeights } from "./types";

export interface FundWeight {
  fund: Fund;
  /** Effective portfolio weight (%), normalized so active sleeves sum to 100. */
  weightPct: number;
}

export interface CrashScenario {
  id: string;
  label: string;
  detail: string;
  /** Benchmark drawdown (%). */
  benchmarkPct: number;
  /** Return of the debt sleeve in the scenario (%). */
  debtPct: number;
  /** Return of the gold sleeve in the scenario (%). */
  goldPct: number;
}

export const CRASH_SCENARIOS: CrashScenario[] = [
  {
    id: "covid",
    label: "2020 Covid Crash",
    detail: "Fastest 35%+ decline in Indian market history (Feb–Mar 2020).",
    benchmarkPct: -38.4,
    debtPct: 0.8,
    goldPct: 12.4,
  },
  {
    id: "gfc",
    label: "2008 Global Financial Crisis",
    detail: "14-month structural credit deleveraging.",
    benchmarkPct: -59.9,
    debtPct: 1.5,
    goldPct: 24.8,
  },
];

/** Long-run correlation assumptions between sleeves. Symmetric. */
const CORRELATION: Record<SleeveKey, Record<SleeveKey, number>> = {
  flexi: { flexi: 1, large: 0.95, mid: 0.88, small: 0.78, baf: 0.72, debt: -0.05, gold: 0.05 },
  large: { flexi: 0.95, large: 1, mid: 0.82, small: 0.72, baf: 0.75, debt: -0.05, gold: 0.0 },
  mid: { flexi: 0.88, large: 0.82, mid: 1, small: 0.9, baf: 0.7, debt: -0.1, gold: 0.05 },
  small: { flexi: 0.78, large: 0.72, mid: 0.9, small: 1, baf: 0.65, debt: -0.1, gold: 0.1 },
  baf: { flexi: 0.72, large: 0.75, mid: 0.7, small: 0.65, baf: 1, debt: 0.2, gold: 0.15 },
  debt: { flexi: -0.05, large: -0.05, mid: -0.1, small: -0.1, baf: 0.2, debt: 1, gold: 0.25 },
  gold: { flexi: 0.05, large: 0.0, mid: 0.05, small: 0.1, baf: 0.15, debt: 0.25, gold: 1 },
};

const asFractions = (weights: SleeveWeights): Record<SleeveKey, number> => {
  const total = SLEEVE_KEYS.reduce((s, k) => s + Math.max(0, weights[k]), 0) || 1;
  const out = {} as Record<SleeveKey, number>;
  for (const k of SLEEVE_KEYS) out[k] = Math.max(0, weights[k]) / total;
  return out;
};

/** Naive weighted average of sleeve volatilities (what the old app did). */
export function naiveVolatility(weights: SleeveWeights): number {
  const w = asFractions(weights);
  return SLEEVE_KEYS.reduce((sum, k) => sum + w[k] * SLEEVES[k].volatilityPct, 0);
}

/** True annualised portfolio volatility via the covariance matrix (%). */
export function portfolioVolatility(weights: SleeveWeights): number {
  const w = asFractions(weights);
  let variance = 0;
  for (const i of SLEEVE_KEYS) {
    for (const j of SLEEVE_KEYS) {
      const cov = CORRELATION[i][j] * SLEEVES[i].volatilityPct * SLEEVES[j].volatilityPct;
      variance += w[i] * w[j] * cov;
    }
  }
  return Math.sqrt(Math.max(0, variance));
}

export interface RiskSummary {
  expectedCagrPct: number;
  naiveVolPct: number;
  portfolioVolPct: number;
  diversificationBenefitPct: number;
  naiveDrawdownPct: number;
}

export function summariseRisk(weights: SleeveWeights): RiskSummary {
  const w = asFractions(weights);
  const expectedCagrPct = SLEEVE_KEYS.reduce(
    (sum, k) => sum + w[k] * SLEEVES[k].expectedCagrPct,
    0,
  );
  const naiveVolPct = naiveVolatility(weights);
  const portfolioVolPct = portfolioVolatility(weights);
  const naiveDrawdownPct = SLEEVE_KEYS.reduce(
    (sum, k) => sum + w[k] * SLEEVES[k].maxDrawdownPct,
    0,
  );
  return {
    expectedCagrPct,
    naiveVolPct,
    portfolioVolPct,
    diversificationBenefitPct: naiveVolPct - portfolioVolPct,
    naiveDrawdownPct,
  };
}

export interface CaptureSummary {
  upCapturePct: number;
  downCapturePct: number;
  spreadPts: number;
}

export function blendedCapture(holdings: FundWeight[]): CaptureSummary {
  const total = holdings.reduce((s, h) => s + h.weightPct, 0) || 1;
  let up = 0;
  let down = 0;
  for (const { fund, weightPct } of holdings) {
    const w = weightPct / total;
    up += w * fund.risk.upCapturePct;
    down += w * fund.risk.downCapturePct;
  }
  return {
    upCapturePct: round(up, 1),
    downCapturePct: round(down, 1),
    spreadPts: round(up - down, 1),
  };
}

export interface CrashResult {
  scenario: CrashScenario;
  portfolioPct: number;
  benchmarkPct: number;
  protectedPct: number;
}

export function crashStress(holdings: FundWeight[], scenario: CrashScenario): CrashResult {
  const total = holdings.reduce((s, h) => s + h.weightPct, 0) || 1;
  let portfolioPct = 0;
  for (const { fund, weightPct } of holdings) {
    const w = weightPct / total;
    if (fund.sleeve === "debt") portfolioPct += w * scenario.debtPct;
    else if (fund.sleeve === "gold") portfolioPct += w * scenario.goldPct;
    else portfolioPct += w * scenario.benchmarkPct * (fund.risk.downCapturePct / 100);
  }
  return {
    scenario,
    portfolioPct: round(portfolioPct, 1),
    benchmarkPct: scenario.benchmarkPct,
    protectedPct: round(portfolioPct - scenario.benchmarkPct, 1),
  };
}

export interface OverlapItem {
  ticker: string;
  name: string;
  sector: string;
  combinedWeightPct: number;
  funds: string[];
}

export interface OverlapSummary {
  items: OverlapItem[];
  overlapPct: number;
  uniqueStocks: number;
  status: "EXCELLENT" | "MODERATE" | "ELEVATED";
}

export function stockOverlap(holdings: FundWeight[]): OverlapSummary {
  const total = holdings.reduce((s, h) => s + h.weightPct, 0) || 1;
  const map = new Map<string, OverlapItem>();
  for (const { fund, weightPct } of holdings) {
    const w = weightPct / total;
    for (const h of fund.topHoldings) {
      const key = h.ticker || h.name;
      const contribution = w * h.weightPct;
      const existing = map.get(key);
      if (existing) {
        existing.combinedWeightPct += contribution;
        existing.funds.push(fund.shortName);
      } else {
        map.set(key, {
          ticker: h.ticker,
          name: h.name,
          sector: h.sector,
          combinedWeightPct: contribution,
          funds: [fund.shortName],
        });
      }
    }
  }
  const items = [...map.values()].sort((a, b) => b.combinedWeightPct - a.combinedWeightPct);
  const shared = items.filter((i) => i.funds.length > 1);
  const overlapPct = shared.reduce((s, i) => s + i.combinedWeightPct, 0);
  const status: OverlapSummary["status"] =
    overlapPct < 25 ? "EXCELLENT" : overlapPct < 40 ? "MODERATE" : "ELEVATED";
  return { items, overlapPct: round(overlapPct, 1), uniqueStocks: items.length, status };
}

export function topConcentration(holdings: FundWeight[], top = 10): number {
  const total = holdings.reduce((s, h) => s + h.weightPct, 0) || 1;
  const stocks = new Map<string, number>();
  for (const { fund, weightPct } of holdings) {
    const w = weightPct / total;
    for (const h of fund.topHoldings) {
      const key = h.ticker || h.name;
      stocks.set(key, (stocks.get(key) ?? 0) + w * h.weightPct);
    }
  }
  return round(
    [...stocks.values()]
      .sort((a, b) => b - a)
      .slice(0, top)
      .reduce((s, v) => s + v, 0),
    1,
  );
}

export const round = (value: number, dp = 2): number => {
  const f = Math.pow(10, dp);
  return Math.round(value * f) / f;
};
