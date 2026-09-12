/**
 * The five-hurdle gatekeeper, now sleeve-aware.
 *
 * Inputs are raw metrics; outputs are always derived (ADR-0002). Thresholds
 * come exclusively from `thresholds.ts`.
 */
import {
  PROFILE_ORDER,
  PROFILES,
  VERDICT_BANDS,
  profileForSleeve,
  type ScreeningMetrics,
  type ScreeningProfile,
} from "./thresholds";
import type { Fund, HurdleResult, ScreenerResult, ScreenerVerdict } from "./types";

export type { ScreeningMetrics } from "./thresholds";
export { PROFILE_ORDER, PROFILES };

export function verdictFor(score: number): ScreenerVerdict {
  if (score >= VERDICT_BANDS.qualifiedAt) return "QUALIFIED";
  if (score >= VERDICT_BANDS.watchlistAt) return "WATCHLIST";
  return "REJECT";
}

function summarise(
  verdict: ScreenerVerdict,
  profile: ScreeningProfile,
  passed: HurdleResult[],
  failed: HurdleResult[],
): string {
  const tag = PROFILES[profile].label;
  if (verdict === "QUALIFIED") {
    return `${tag}: clears all ${passed.length} hurdles.`;
  }
  const names = failed.map((f) => f.label).join(", ");
  return verdict === "WATCHLIST"
    ? `${tag} watchlist: fails ${failed.length} hurdle(s) — ${names}.`
    : `${tag} rejected: fails ${failed.length} hurdle(s) — ${names}.`;
}

export function evaluateScreening(
  metrics: ScreeningMetrics,
  profile: ScreeningProfile = "equity",
): ScreenerResult {
  const results = PROFILES[profile].hurdles(metrics);
  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);
  const score = passed.length;
  const verdict = verdictFor(score);
  const primaryFailure = failed[0];
  return {
    results,
    score,
    verdict,
    profile,
    passed,
    failed,
    ...(primaryFailure ? { primaryFailure } : {}),
    summary: summarise(verdict, profile, passed, failed),
  };
}

export function runScreener(fund: Fund): ScreenerResult {
  const profile = profileForSleeve(fund.sleeve);
  return evaluateScreening(
    {
      beatBenchmarkPct: fund.rolling.beatBenchmarkPct,
      positivePct: fund.rolling.positivePct,
      sortino: fund.risk.sortino,
      alphaPct: fund.risk.alphaPct,
      upCapturePct: fund.risk.upCapturePct,
      downCapturePct: fund.risk.downCapturePct,
      stdDevPct: fund.risk.stdDevPct,
    },
    profile,
  );
}

export type ScreenerSortField = "rolling" | "sortino" | "alpha" | "downCapture" | "aum";

export function metricValue(fund: Fund, field: ScreenerSortField): number {
  switch (field) {
    case "rolling":
      return fund.rolling.beatBenchmarkPct;
    case "sortino":
      return fund.risk.sortino;
    case "alpha":
      return fund.risk.alphaPct;
    case "downCapture":
      return fund.risk.downCapturePct;
    case "aum":
      return fund.aumCr;
  }
}
