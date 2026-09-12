/**
 * The single source of truth for every screening threshold.
 *
 * Screening is now *sleeve-aware*: equity, hybrid, debt and commodity sleeves
 * are judged by different rules, because a down-capture ceiling designed for
 * equity will (correctly) reject every small-cap and debt fund. See CONTEXT.md.
 *
 * Changing a number here re-rates the entire fund universe. Nothing else may
 * hardcode a hurdle.
 */
import type { SleeveKey } from "./sleeves";

export interface ScreeningMetrics {
  beatBenchmarkPct: number;
  positivePct: number;
  sortino: number;
  alphaPct: number;
  upCapturePct: number;
  downCapturePct: number;
  stdDevPct: number;
}

export type ScreeningProfile = "equity" | "hybrid" | "debt" | "commodity";

export interface HurdleEval {
  id: string;
  step: number;
  label: string;
  rule: string;
  unit: string;
  value: number;
  threshold: number;
  passed: boolean;
  delta: number;
}

export interface ProfileConfig {
  profile: ScreeningProfile;
  label: string;
  description: string;
  /** Every profile has exactly five hurdles so the /5 scale is consistent. */
  hurdles: (m: ScreeningMetrics) => HurdleEval[];
}

/* -------------------------------------------------------------- operators */

const higher = (
  id: string,
  step: number,
  label: string,
  rule: string,
  unit: string,
  value: number,
  threshold: number,
): HurdleEval => ({
  id,
  step,
  label,
  rule,
  unit,
  value,
  threshold,
  passed: value > threshold,
  delta: value - threshold,
});

const higherEq = (
  id: string,
  step: number,
  label: string,
  rule: string,
  unit: string,
  value: number,
  threshold: number,
): HurdleEval => ({
  id,
  step,
  label,
  rule,
  unit,
  value,
  threshold,
  passed: value >= threshold,
  delta: value - threshold,
});

const lower = (
  id: string,
  step: number,
  label: string,
  rule: string,
  unit: string,
  value: number,
  threshold: number,
): HurdleEval => ({
  id,
  step,
  label,
  rule,
  unit,
  value,
  threshold,
  passed: value < threshold,
  // For "lower is better" a positive delta means inside the limit.
  delta: threshold - value,
});

/* -------------------------------------------------------------- profiles */

export const PROFILES: Record<ScreeningProfile, ProfileConfig> = {
  equity: {
    profile: "equity",
    label: "Equity",
    description: "Full five-hurdle gatekeeper for flexi, large, mid and small cap.",
    hurdles: (m) => [
      higherEq("rolling", 1, "Rolling Beat Rate", "≥ 75% beat benchmark & positive", "%", Math.min(m.beatBenchmarkPct, m.positivePct), 75),
      higher("sortino", 2, "Sortino Ratio", "> 1.50", "", m.sortino, 1.5),
      higher("alpha", 3, "Jensen's Alpha", "> +1.50%", "%", m.alphaPct, 1.5),
      higher("upCapture", 4, "Up-Capture", "> 80%", "%", m.upCapturePct, 80),
      lower("downCapture", 5, "Down-Capture", "< 75%", "%", m.downCapturePct, 75),
    ],
  },
  hybrid: {
    profile: "hybrid",
    label: "Hybrid / BAF",
    description: "Balanced Advantage is judged on lower drawdown than pure equity.",
    hurdles: (m) => [
      higherEq("rolling", 1, "Rolling Beat Rate", "≥ 70% of windows beat benchmark", "%", m.beatBenchmarkPct, 70),
      higher("sortino", 2, "Sortino Ratio", "> 1.20", "", m.sortino, 1.2),
      higher("alpha", 3, "Jensen's Alpha", "> +0.50%", "%", m.alphaPct, 0.5),
      higher("upCapture", 4, "Up-Capture", "> 70%", "%", m.upCapturePct, 70),
      lower("downCapture", 5, "Down-Capture", "< 90%", "%", m.downCapturePct, 90),
    ],
  },
  debt: {
    profile: "debt",
    label: "Debt / Arbitrage",
    description: "Debt is judged on stability and capital preservation, not equity capture.",
    hurdles: (m) => [
      higherEq("rolling", 1, "Rolling Beat Rate", "≥ 60% of windows beat benchmark", "%", m.beatBenchmarkPct, 60),
      higherEq("positive", 2, "Positive Windows", "≥ 99% of windows positive", "%", m.positivePct, 99),
      lower("volatility", 3, "Volatility", "< 4.0% annualised", "%", m.stdDevPct, 4),
      lower("drawdown", 4, "Downside Capture", "< 15%", "%", m.downCapturePct, 15),
      higher("sortino", 5, "Sortino Ratio", "> 1.00", "", m.sortino, 1),
    ],
  },
  commodity: {
    profile: "commodity",
    label: "Commodity / Gold",
    description: "Gold is judged on stability and tracking; crisis correlation is not in the NAV feed.",
    hurdles: (m) => [
      higherEq("rolling", 1, "Rolling Beat Rate", "≥ 50% of windows beat benchmark", "%", m.beatBenchmarkPct, 50),
      higherEq("positive", 2, "Positive Windows", "≥ 80% of windows positive", "%", m.positivePct, 80),
      lower("volatility", 3, "Volatility", "< 22% annualised", "%", m.stdDevPct, 22),
      higher("upCapture", 4, "Up-Capture", "> 70%", "%", m.upCapturePct, 70),
      higher("sortino", 5, "Sortino Ratio", "> 0.50", "", m.sortino, 0.5),
    ],
  },
};

export const PROFILE_ORDER: ScreeningProfile[] = ["equity", "hybrid", "debt", "commodity"];

/** Which screening profile applies to a canonical sleeve. */
export function profileForSleeve(sleeve: SleeveKey): ScreeningProfile {
  switch (sleeve) {
    case "baf":
      return "hybrid";
    case "debt":
      return "debt";
    case "gold":
      return "commodity";
    default:
      return "equity";
  }
}

/**
 * Verdict bands, identical across profiles. QUALIFIED requires clearing at least
 * four of the five hurdles — the council's "passes at least 4 of 5" criterion.
 * Demanding a perfect 5/5 on real NAV data is effectively unachievable and would
 * leave every category empty.
 */
export const VERDICT_BANDS = {
  qualifiedAt: 4,
  watchlistAt: 3,
} as const;

/* -------------------------------------------- legacy equity meta (UI bar) */

export const HURDLE_META = {
  rolling: { id: "rolling", step: 1, label: "Rolling Beat Rate", rule: "≥ 75% of windows beat benchmark", unit: "%" },
  sortino: { id: "sortino", step: 2, label: "Sortino Ratio", rule: "> 1.50", unit: "" },
  alpha: { id: "alpha", step: 3, label: "Jensen's Alpha", rule: "> +1.50%", unit: "%" },
  upCapture: { id: "upCapture", step: 4, label: "Up-Capture", rule: "> 80%", unit: "%" },
  downCapture: { id: "downCapture", step: 5, label: "Down-Capture", rule: "< 75%", unit: "%" },
} as const;

export type HurdleId = keyof typeof HURDLE_META;

export const HURDLE_ORDER: HurdleId[] = ["rolling", "sortino", "alpha", "upCapture", "downCapture"];
