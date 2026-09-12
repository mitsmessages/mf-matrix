/**
 * Stage 3/4 — look-through and capital deployment.
 *
 * Resolves the "asset allocation illusion": a Flexi Cap fund is not equity,
 * it is a basket of large/mid/small stocks plus cash. All maths keys off the
 * canonical sleeve set (ADR-0001).
 */
import { SLEEVES, SLEEVE_DEFAULT_MARKETCAP, SLEEVE_KEYS } from "./sleeves";
import type { SleeveKey } from "./sleeves";
import type { Fund, Selections, SleeveWeights } from "./types";
import { round, type FundWeight } from "./portfolio";

export interface TierBreakdown {
  largeCap: number;
  midCap: number;
  smallCap: number;
  cashDebt: number;
  commodity: number;
}

export function activeSleeveKeys(weights: SleeveWeights, selections: Selections): SleeveKey[] {
  return SLEEVE_KEYS.filter((k) => (weights[k] ?? 0) > 0 && (selections[k]?.length ?? 0) > 0);
}

/** Re-normalise only the active sleeves so the portfolio always sums to 100. */
export function normalisedSleeveWeights(
  weights: SleeveWeights,
  selections: Selections,
): SleeveWeights {
  const active = activeSleeveKeys(weights, selections);
  const total = active.reduce((s, k) => s + (weights[k] ?? 0), 0);
  const out: SleeveWeights = {
    flexi: 0,
    large: 0,
    mid: 0,
    small: 0,
    baf: 0,
    debt: 0,
    gold: 0,
  };
  if (total <= 0) return out;
  for (const k of active) out[k] = ((weights[k] ?? 0) / total) * 100;
  return out;
}

export function resolveHoldings(
  weights: SleeveWeights,
  selections: Selections,
  funds: Fund[],
): FundWeight[] {
  const normalised = normalisedSleeveWeights(weights, selections);
  const byId = new Map(funds.map((f) => [f.id, f]));
  const out: FundWeight[] = [];
  for (const sleeve of activeSleeveKeys(weights, selections)) {
    const ids = selections[sleeve] ?? [];
    if (ids.length === 0) continue;
    const perFund = normalised[sleeve] / ids.length;
    for (const id of ids) {
      const fund = byId.get(id);
      if (fund) out.push({ fund, weightPct: perFund });
    }
  }
  return out;
}

export function tierBreakdown(holdings: FundWeight[]): TierBreakdown {
  const total = holdings.reduce((s, h) => s + h.weightPct, 0) || 1;
  const out: TierBreakdown = { largeCap: 0, midCap: 0, smallCap: 0, cashDebt: 0, commodity: 0 };
  for (const { fund, weightPct } of holdings) {
    const w = weightPct / total;
    // Metrics-only funds fall back to the documented sleeve assumption.
    const mc = fund.marketCapBreakdown ?? SLEEVE_DEFAULT_MARKETCAP[fund.sleeve];
    out.largeCap += w * mc.largeCap;
    out.midCap += w * mc.midCap;
    out.smallCap += w * mc.smallCap;
    out.cashDebt += w * mc.cashDebt;
    out.commodity += w * mc.commodity;
  }
  out.largeCap = round(out.largeCap, 1);
  out.midCap = round(out.midCap, 1);
  out.smallCap = round(out.smallCap, 1);
  out.cashDebt = round(out.cashDebt, 1);
  out.commodity = round(out.commodity, 1);
  return out;
}

export interface DeploymentRow {
  sleeve: SleeveKey;
  sleeveLabel: string;
  fund: Fund;
  effectivePct: number;
  splitNote: string | null;
  lumpSum: number;
  monthlySip: number;
  note: string;
}

const SLEEVE_NOTES: Record<SleeveKey, string> = {
  flexi: "Core compounder: suitable for SIP or a 6-month STP.",
  large: "Valuation anchor: Tier-1 balance sheets for resilience.",
  mid: "Alpha engine: stagger lump sums over 6–12 months via STP.",
  small: "High beta: cap allocation and enter gradually.",
  baf: "Dynamic hedge: deploys counter-cyclically by design.",
  debt: "Capital shield: park lump sums here before STP into equity.",
  gold: "Crisis hedge: direct lump-sum for the INR/geopolitical buffer.",
};

export function deploymentPlan(
  weights: SleeveWeights,
  selections: Selections,
  funds: Fund[],
  lumpSum: number,
  monthlySip: number,
): DeploymentRow[] {
  const normalised = normalisedSleeveWeights(weights, selections);
  const byId = new Map(funds.map((f) => [f.id, f]));
  const rows: DeploymentRow[] = [];
  for (const sleeve of activeSleeveKeys(weights, selections)) {
    const ids = selections[sleeve] ?? [];
    if (ids.length === 0) continue;
    const perFundPct = normalised[sleeve] / ids.length;
    for (const id of ids) {
      const fund = byId.get(id);
      if (!fund) continue;
      rows.push({
        sleeve,
        sleeveLabel: SLEEVES[sleeve].label,
        fund,
        effectivePct: round(perFundPct, 2),
        splitNote: ids.length > 1 ? `split ${ids.length} ways` : null,
        lumpSum: Math.round((lumpSum * perFundPct) / 100),
        monthlySip: Math.round((monthlySip * perFundPct) / 100),
        note: SLEEVE_NOTES[sleeve],
      });
    }
  }
  return rows;
}

/** Aggregate the underlying top holdings across the active funds. */
export interface AggregatedHolding {
  ticker: string;
  name: string;
  sector: string;
  tier: Fund["topHoldings"][number]["marketCapTier"];
  weightPct: number;
  monthlySip: number;
  lumpSum: number;
  sources: { fund: string; contributionPct: number }[];
}

export function aggregateHoldings(
  holdings: FundWeight[],
  lumpSum: number,
  monthlySip: number,
): AggregatedHolding[] {
  const total = holdings.reduce((s, h) => s + h.weightPct, 0) || 1;
  const map = new Map<string, AggregatedHolding>();
  for (const { fund, weightPct } of holdings) {
    const w = weightPct / total;
    for (const h of fund.topHoldings) {
      const key = h.ticker || h.name;
      const contribution = w * h.weightPct;
      const existing = map.get(key);
      if (existing) {
        existing.weightPct += contribution;
        existing.monthlySip += (monthlySip * contribution) / 100;
        existing.lumpSum += (lumpSum * contribution) / 100;
        existing.sources.push({ fund: fund.shortName, contributionPct: contribution });
      } else {
        map.set(key, {
          ticker: h.ticker,
          name: h.name,
          sector: h.sector,
          tier: h.marketCapTier,
          weightPct: contribution,
          monthlySip: (monthlySip * contribution) / 100,
          lumpSum: (lumpSum * contribution) / 100,
          sources: [{ fund: fund.shortName, contributionPct: contribution }],
        });
      }
    }
  }
  return [...map.values()]
    .map((h) => ({
      ...h,
      weightPct: round(h.weightPct, 2),
      monthlySip: Math.round(h.monthlySip),
      lumpSum: Math.round(h.lumpSum),
    }))
    .sort((a, b) => b.weightPct - a.weightPct);
}
