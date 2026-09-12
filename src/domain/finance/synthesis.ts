/**
 * Stage 4 — derived committee synthesis.
 *
 * The old engine asserted a hardcoded "96/100". This computes a transparent
 * score from the actual portfolio, with a visible pillar breakdown.
 */
import type { ScreenerResult } from "./types";
import type { CaptureSummary, CrashResult, OverlapSummary, RiskSummary } from "./portfolio";
import type { RebalancePlan } from "./rebalance";
import { round } from "./portfolio";

export type SynthesisVerdict = "READY" | "CONDITIONAL" | "NOT_READY";

export interface SynthesisPillar {
  id: string;
  label: string;
  score: number;
  max: number;
  detail: string;
}

export interface SynthesisResult {
  score: number;
  verdict: SynthesisVerdict;
  pillars: SynthesisPillar[];
}

export interface SynthesisInput {
  /** Per-fund effective weight (%) and derived screener result. */
  parts: { weightPct: number; result: ScreenerResult }[];
  capture: CaptureSummary;
  overlap: OverlapSummary;
  crash: CrashResult[];
  risk: RiskSummary;
  rebalance: RebalancePlan;
  activeSleeves: number;
  filledSleeves: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const linear = (v: number, lo: number, hi: number, max: number) =>
  clamp(((v - lo) / (hi - lo)) * max, 0, max);

export function buildSynthesis(input: SynthesisInput): SynthesisResult {
  const { parts, capture, overlap, crash, risk, rebalance, activeSleeves, filledSleeves } = input;

  // An empty portfolio must never score above zero — no phantom pass.
  if (parts.length === 0) {
    return {
      score: 0,
      verdict: "NOT_READY",
      pillars: [
        {
          id: "empty",
          label: "Portfolio not constructed",
          score: 0,
          max: 100,
          detail: "Select at least one fund in Stage 3 to score the portfolio.",
        },
      ],
    };
  }

  const totalWeight = parts.reduce((s, p) => s + p.weightPct, 0) || 1;
  const weightedQuality =
    parts.reduce((s, p) => s + (p.weightPct / totalWeight) * (p.result.score / 5), 0) * 40;

  const asymmetry = linear(capture.spreadPts, 0, 15, 20);

  const overlapScore =
    overlap.uniqueStocks === 0 ? 0 : overlap.overlapPct < 25 ? 15 : overlap.overlapPct < 40 ? 8 : 3;

  const worstCrash = crash.length ? Math.max(...crash.map((c) => c.protectedPct)) : 0;
  const defence = linear(capture.downCapturePct <= 75 ? risk.diversificationBenefitPct + 10 : 5, 0, 25, 15);

  const planScore = activeSleeves > 0 ? (filledSleeves / activeSleeves) * (rebalance.triggered ? 7 : 10) : 0;

  const pillars: SynthesisPillar[] = [
    {
      id: "quality",
      label: "Fund quality (weighted handicap)",
      score: round(weightedQuality, 1),
      max: 40,
      detail: "Weighted average of each selected fund's 5-hurdle score.",
    },
    {
      id: "asymmetry",
      label: "Asymmetry (capture spread)",
      score: round(asymmetry, 1),
      max: 20,
      detail: `Up ${capture.upCapturePct}% vs down ${capture.downCapturePct}% = ${capture.spreadPts} pt spread.`,
    },
    {
      id: "diversification",
      label: "Diversification (stock overlap)",
      score: round(overlapScore, 1),
      max: 15,
      detail: `Overlap ${overlap.overlapPct}% across ${overlap.uniqueStocks} tracked names.`,
    },
    {
      id: "defence",
      label: "Downside defence & covariance",
      score: round(defence, 1),
      max: 15,
      detail: `Covariance cuts volatility ${risk.diversificationBenefitPct.toFixed(1)} pts; worst-case protected ${worstCrash.toFixed(1)} pts.`,
    },
    {
      id: "discipline",
      label: "Allocation completeness & band",
      score: round(planScore, 1),
      max: 10,
      detail:
        filledSleeves === activeSleeves
          ? `All ${activeSleeves} active sleeves filled. Rebalance ${rebalance.triggered ? "triggered" : "within band"}.`
          : `${filledSleeves}/${activeSleeves} active sleeves filled.`,
    },
  ];

  const score = round(
    pillars.reduce((s, p) => s + p.score, 0),
    0,
  );
  const verdict: SynthesisVerdict = score >= 80 ? "READY" : score >= 60 ? "CONDITIONAL" : "NOT_READY";
  return { score, verdict, pillars };
}
