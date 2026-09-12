/**
 * Phase 5 — Indian mutual-fund capital-gains tax estimator (FY 2025-26 rules).
 *
 * Pure and framework-free. Rules:
 *  - Equity-oriented (incl. arbitrage/BAF): LTCG >12m at 12.5% above the
 *    ₹1,25,000 annual exemption; STCG (≤12m) at 20%.
 *  - Gold funds: LTCG >24m at 12.5%; otherwise slab.
 *  - Non-equity/debt: slab rate regardless of holding period (post Apr-2023 rules).
 *
 * Assumptions are surfaced to the user; this is an estimate, not tax advice.
 */
import type { FundCategory } from "./types";
import type { SleeveKey } from "./sleeves";
import type { FundWeight } from "./portfolio";

export type TaxAssetClass = "equity" | "debt" | "gold";
export type GainType = "LTCG" | "STCG" | "SLAB";

export const TAX_RULES = {
  equityLtcgRatePct: 12.5,
  equityStcgRatePct: 20,
  equityLtcgExemption: 125_000,
  goldLtcgRatePct: 12.5,
  equityLtcgMonths: 12,
  goldLtcgMonths: 24,
  defaultSlabRatePct: 30,
} as const;

export function taxAssetClass(category: FundCategory): TaxAssetClass {
  switch (category) {
    case "Flexi Cap":
    case "Large Cap":
    case "Mid Cap":
    case "Small Cap":
    case "Balanced Advantage":
    case "Arbitrage":
      return "equity";
    case "Gold / Commodity":
      return "gold";
    default:
      return "debt";
  }
}

/** Fallback when only the sleeve is known. */
export function taxAssetClassForSleeve(sleeve: SleeveKey): TaxAssetClass {
  if (sleeve === "gold") return "gold";
  if (sleeve === "debt") return "debt";
  return "equity";
}

export interface TaxInput {
  gain: number;
  holdingMonths: number;
  assetClass: TaxAssetClass;
  /** Effective slab rate for debt / slab-taxed gains. */
  slabRatePct?: number;
  /** Equity LTCG exemption already consumed this financial year. */
  ltcgExemptionUsed?: number;
}

export interface TaxResult {
  assetClass: TaxAssetClass;
  gainType: GainType;
  taxableGain: number;
  exemptionUsed: number;
  tax: number;
  effectiveRatePct: number;
}

const clampGain = (gain: number) => Math.max(0, gain);

export function estimateTax(input: TaxInput): TaxResult {
  const gain = clampGain(input.gain);
  const slab = input.slabRatePct ?? TAX_RULES.defaultSlabRatePct;

  if (input.assetClass === "equity") {
    if (input.holdingMonths > TAX_RULES.equityLtcgMonths) {
      const available = Math.max(0, TAX_RULES.equityLtcgExemption - (input.ltcgExemptionUsed ?? 0));
      const exemptionUsed = Math.min(gain, available);
      const taxable = gain - exemptionUsed;
      const tax = (taxable * TAX_RULES.equityLtcgRatePct) / 100;
      return {
        assetClass: "equity",
        gainType: "LTCG",
        taxableGain: taxable,
        exemptionUsed,
        tax,
        effectiveRatePct: gain > 0 ? (tax / gain) * 100 : 0,
      };
    }
    const tax = (gain * TAX_RULES.equityStcgRatePct) / 100;
    return {
      assetClass: "equity",
      gainType: "STCG",
      taxableGain: gain,
      exemptionUsed: 0,
      tax,
      effectiveRatePct: gain > 0 ? (tax / gain) * 100 : 0,
    };
  }

  if (input.assetClass === "gold" && input.holdingMonths > TAX_RULES.goldLtcgMonths) {
    const tax = (gain * TAX_RULES.goldLtcgRatePct) / 100;
    return {
      assetClass: "gold",
      gainType: "LTCG",
      taxableGain: gain,
      exemptionUsed: 0,
      tax,
      effectiveRatePct: gain > 0 ? (tax / gain) * 100 : 0,
    };
  }

  const tax = (gain * slab) / 100;
  return {
    assetClass: input.assetClass,
    gainType: "SLAB",
    taxableGain: gain,
    exemptionUsed: 0,
    tax,
    effectiveRatePct: gain > 0 ? (tax / gain) * 100 : 0,
  };
}

export interface PortfolioTaxLine {
  assetClass: TaxAssetClass;
  weightPct: number;
  gain: number;
  tax: number;
}

export interface PortfolioTaxResult {
  lines: PortfolioTaxLine[];
  totalGain: number;
  totalTax: number;
  postTaxGain: number;
  effectiveRatePct: number;
}

/** Estimate tax on a total portfolio gain, split by each fund's asset class. */
export function estimatePortfolioTax(
  holdings: FundWeight[],
  totalGain: number,
  holdingMonths: number,
  options: { slabRatePct?: number; ltcgExemptionUsed?: number } = {},
): PortfolioTaxResult {
  const total = holdings.reduce((s, h) => s + h.weightPct, 0) || 1;
  const gain = clampGain(totalGain);
  const byClass = new Map<TaxAssetClass, number>();
  for (const { fund, weightPct } of holdings) {
    const share = (weightPct / total) * gain;
    const cls = taxAssetClass(fund.category);
    byClass.set(cls, (byClass.get(cls) ?? 0) + share);
  }

  let exemptionRemaining = options.ltcgExemptionUsed ?? 0;
  const lines: PortfolioTaxLine[] = [];
  for (const [assetClass, classGain] of byClass) {
    const result = estimateTax({
      gain: classGain,
      holdingMonths,
      assetClass,
      ...(options.slabRatePct !== undefined ? { slabRatePct: options.slabRatePct } : {}),
      ltcgExemptionUsed: exemptionRemaining,
    });
    exemptionRemaining += result.exemptionUsed;
    lines.push({
      assetClass,
      weightPct: gain > 0 ? (classGain / gain) * 100 : 0,
      gain: classGain,
      tax: result.tax,
    });
  }
  lines.sort((a, b) => b.gain - a.gain);

  const totalTax = lines.reduce((s, l) => s + l.tax, 0);
  return {
    lines,
    totalGain: gain,
    totalTax,
    postTaxGain: gain - totalTax,
    effectiveRatePct: gain > 0 ? (totalTax / gain) * 100 : 0,
  };
}
