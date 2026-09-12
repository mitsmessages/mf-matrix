/**
 * Stage 4 — annual ±band rebalancing plan.
 *
 * Rebalancing is how a static allocation harvests volatility: trim the sleeve
 * that ran, top up the sleeve that lagged. Trigger when drift exceeds the band.
 */
import { SLEEVE_KEYS, SLEEVES } from "./sleeves";
import type { SleeveKey } from "./sleeves";
import type { SleeveWeights } from "./types";
import { round } from "./portfolio";

export type RebalanceActionKind = "BUY" | "SELL" | "HOLD";

export interface RebalanceAction {
  sleeve: SleeveKey;
  label: string;
  currentPct: number;
  targetPct: number;
  driftPct: number;
  action: RebalanceActionKind;
  amountPct: number;
  amountRupees: number;
}

export interface RebalancePlan {
  triggered: boolean;
  bandPct: number;
  actions: RebalanceAction[];
  maxDriftPct: number;
}

export const DEFAULT_REBALANCE_BAND_PCT = 5;

export function buildRebalancePlan(
  currentValueBySleeve: Partial<Record<SleeveKey, number>>,
  target: SleeveWeights,
  totalValue: number,
  bandPct: number = DEFAULT_REBALANCE_BAND_PCT,
): RebalancePlan {
  const value = Math.max(0, totalValue);
  const active = SLEEVE_KEYS.filter(
    (k) => (target[k] ?? 0) > 0 || (currentValueBySleeve[k] ?? 0) > 0,
  );
  const targetTotal = active.reduce((s, k) => s + (target[k] ?? 0), 0) || 1;

  const actions: RebalanceAction[] = active.map((sleeve) => {
    const currentPct = value > 0 ? ((currentValueBySleeve[sleeve] ?? 0) / value) * 100 : 0;
    const targetPct = ((target[sleeve] ?? 0) / targetTotal) * 100;
    const driftPct = currentPct - targetPct;
    const action: RebalanceActionKind =
      driftPct > bandPct ? "SELL" : driftPct < -bandPct ? "BUY" : "HOLD";
    const amountPct = targetPct - currentPct;
    return {
      sleeve,
      label: SLEEVES[sleeve].shortLabel,
      currentPct: round(currentPct, 1),
      targetPct: round(targetPct, 1),
      driftPct: round(driftPct, 1),
      action,
      amountPct: round(amountPct, 1),
      amountRupees: Math.round((amountPct / 100) * value),
    };
  });

  const maxDriftPct = actions.reduce((m, a) => Math.max(m, Math.abs(a.driftPct)), 0);
  return {
    triggered: actions.some((a) => a.action !== "HOLD"),
    bandPct,
    actions,
    maxDriftPct: round(maxDriftPct, 1),
  };
}

/** Apply a rebalance plan to derive the post-trade sleeve values. */
export function applyRebalance(
  currentValueBySleeve: Partial<Record<SleeveKey, number>>,
  plan: RebalancePlan,
): Record<SleeveKey, number> {
  const out = {} as Record<SleeveKey, number>;
  for (const a of plan.actions) {
    const current = currentValueBySleeve[a.sleeve] ?? 0;
    out[a.sleeve] = a.action === "HOLD" ? current : current + a.amountRupees;
  }
  return out;
}
