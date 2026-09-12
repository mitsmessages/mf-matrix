/**
 * Rule-based portfolio recommendations.
 *
 * Every recommendation is derived from the actual scenario and cites the
 * lecture it comes from. No generic advice, no hardcoded commentary.
 */
import { SLEEVE_KEYS } from "./sleeves";
import type { SleeveKey } from "./sleeves";
import type { Fund, Selections, SleeveWeights } from "./types";
import type {
  CaptureSummary,
  CrashResult,
  FundWeight,
  OverlapSummary,
  RiskSummary,
} from "./portfolio";
import type { TierBreakdown } from "./lookthrough";

export type RecommendationSeverity = "important" | "consider" | "info" | "good";

export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  severity: RecommendationSeverity;
  citation: { lectureId: string; label: string };
}

export interface RecommendationInput {
  weights: SleeveWeights;
  selections: Selections;
  holdings: FundWeight[];
  tier: TierBreakdown;
  capture: CaptureSummary;
  overlap: OverlapSummary;
  risk: RiskSummary;
  crashes: CrashResult[];
  horizonYears: number;
  lumpSum: number;
  monthlySip: number;
}

const equityWeight = (weights: SleeveWeights): number =>
  (["flexi", "large", "mid", "small"] as SleeveKey[]).reduce((s, k) => s + (weights[k] ?? 0), 0);

/** Weighted TER across funds that actually disclose a TER (> 0). */
const weightedTer = (holdings: FundWeight[]): number | null => {
  const known = holdings.filter((h) => h.fund.expenseRatioPct > 0);
  const total = known.reduce((s, h) => s + h.weightPct, 0);
  if (total <= 0) return null;
  return known.reduce((s, h) => s + (h.weightPct / total) * h.fund.expenseRatioPct, 0);
};

const hasNameContaining = (funds: Fund[], needles: string[]): boolean =>
  funds.some((f) => {
    const hay = `${f.name} ${f.shortName}`.toLowerCase();
    return needles.some((n) => hay.includes(n));
  });

export function buildRecommendations(input: RecommendationInput): Recommendation[] {
  const { weights, selections, holdings, capture, overlap, horizonYears } = input;
  const selectedFunds = holdings.map((h) => h.fund);
  const recs: Recommendation[] = [];

  if (holdings.length === 0) {
    return [
      {
        id: "empty",
        title: "Select at least one fund per sleeve",
        detail:
          "No funds are selected, so no portfolio can be evaluated. Go to the screener and pick the top-ranked scheme in each active sleeve.",
        severity: "important",
        citation: { lectureId: "L05", label: "Category invalidation" },
      },
    ];
  }

  // 1. Low-cost index core.
  if (!hasNameContaining(selectedFunds, ["index", "nifty", "etf"])) {
    recs.push({
      id: "index-core",
      title: "Add a low-cost index core (Nifty 50 / Nifty 500)",
      detail:
        "Your active sleeves carry manager and cost risk. A direct index core at ~0.1–0.2% TER anchors the portfolio, and SPIVA data shows most active large-cap funds fail to beat the index after fees.",
      severity: "consider",
      citation: { lectureId: "L05", label: "Active large caps fail SPIVA" },
    });
  }

  // 2. International / global diversification.
  if (!hasNameContaining(selectedFunds, ["global", "international", "overseas", "us ", "nasdaq", "s&p"])) {
    recs.push({
      id: "global",
      title: "Consider 10–15% international equity",
      detail:
        "A global sleeve diversifies away single-country and single-currency risk. Watch the taxation and double expense layering if you use a fund-of-fund.",
      severity: horizonYears >= 7 ? "consider" : "info",
      citation: { lectureId: "L02", label: "Low-correlation assets" },
    });
  }

  // 3. Small-cap satellite.
  if ((weights.small ?? 0) === 0 && horizonYears >= 7) {
    recs.push({
      id: "small-satellite",
      title: "Optional small-cap satellite (cap at 10–15%)",
      detail:
        "Small caps add high-beta alpha for long horizons but carry deep drawdowns and a structural failure on the down-capture hurdle. Keep the position small and enter via STP.",
      severity: "info",
      citation: { lectureId: "L04", label: "Equity & hybrid categories" },
    });
  }

  // 4. Debt quality: all-arbitrage debt misses duration.
  const debtFunds = selectedFunds.filter((f) => f.sleeve === "debt");
  if (debtFunds.length > 0 && debtFunds.every((f) => f.category === "Arbitrage") && horizonYears > 3) {
    recs.push({
      id: "duration",
      title: "Blend short-duration / Gilt for the rate cycle",
      detail:
        "Arbitrage is market-neutral and gives equity taxation, but it has almost no duration. A short-duration or Gilt sleeve adds carry when rates are peaking and falling.",
      severity: "consider",
      citation: { lectureId: "L05", label: "Rate-cycle transmission" },
    });
  }

  // 5. Gold instrument choice.
  if ((weights.gold ?? 0) > 0) {
    recs.push({
      id: "gold-instrument",
      title: "Choose the gold wrapper deliberately",
      detail:
        "Sovereign Gold Bonds pay a coupon and are tax-free at maturity; Gold ETFs track spot with a low TER. Decide on the basis of holding period and liquidity needs.",
      severity: "info",
      citation: { lectureId: "L02", label: "Gold as a crisis hedge" },
    });
  }

  // 6. Overlap / closet indexing.
  if (overlap.status !== "EXCELLENT") {
    recs.push({
      id: "overlap",
      title: `Reduce fund overlap (${overlap.overlapPct}% shared)`,
      detail:
        "Shared holdings mean you are paying active fees for duplicated exposure. Consolidate into fewer, higher-conviction sleeves.",
      severity: overlap.status === "ELEVATED" ? "important" : "consider",
      citation: { lectureId: "L11", label: "Max five non-overlapping funds" },
    });
  }

  // 7. Asymmetry.
  if (capture.spreadPts < 15) {
    recs.push({
      id: "capture",
      title: `Improve capture asymmetry (spread ${capture.spreadPts} pts)`,
      detail:
        "Aim for up-capture above 80 and down-capture below 75. Downside protection compounds: a smaller drawdown lets the next rally start from a higher base.",
      severity: "consider",
      citation: { lectureId: "L09", label: "Asymmetric compounding shield" },
    });
  }

  // 8. Cost drag.
  const ter = weightedTer(holdings);
  if (ter !== null && ter > 0.8) {
    recs.push({
      id: "cost",
      title: `Trim the weighted TER (${ter.toFixed(2)}%)`,
      detail:
        "A 1% TER difference compounds to roughly a quarter of the terminal corpus over two decades. Prefer direct plans and index alternatives where alpha is not proven.",
      severity: "consider",
      citation: { lectureId: "L05", label: "Expense drag compounding" },
    });
  }

  // 9. Horizon mismatch.
  if (horizonYears < 3 && equityWeight(weights) > 40) {
    recs.push({
      id: "horizon",
      title: "Horizon is short for this equity weight",
      detail:
        "Equity needs time to recover from drawdowns. For sub-three-year goals, shift weight to debt or arbitrage.",
      severity: "important",
      citation: { lectureId: "L02", label: "Allocation before selection" },
    });
  }

  // 10. Sleeve breadth.
  const activeSleeves = SLEEVE_KEYS.filter(
    (k) => (weights[k] ?? 0) > 0 && (selections[k]?.length ?? 0) > 0,
  );
  if (activeSleeves.length < 4) {
    recs.push({
      id: "breadth",
      title: "Broaden the sleeve mix",
      detail: `Only ${activeSleeves.length} sleeves are active. Low-correlation sleeves (debt, gold, hybrid) reduce variance without sacrificing expected return.`,
      severity: "info",
      citation: { lectureId: "L02", label: "Five laws of allocation" },
    });
  }

  // 11. Positive confirmation when nothing is flagged.
  if (recs.length === 0) {
    recs.push({
      id: "clear",
      title: "No structural gaps detected",
      detail:
        "The scenario covers cost, breadth, capture asymmetry and overlap. Maintain the ±5% rebalancing band and review annually.",
      severity: "good",
      citation: { lectureId: "L11", label: "Portfolio synthesis" },
    });
  }

  return recs;
}

/** Small helper used by the Scenario page. */
export const sleeveCoverage = (weights: SleeveWeights, selections: Selections): number =>
  SLEEVE_KEYS.filter((k) => (weights[k] ?? 0) > 0 && (selections[k]?.length ?? 0) > 0).length;
