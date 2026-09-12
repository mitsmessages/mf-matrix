import type { FundCategory, MarketCapBreakdown, SleeveWeights } from "./types";

export type SleeveKey = "flexi" | "large" | "mid" | "small" | "baf" | "debt" | "gold";

export const SLEEVE_KEYS: SleeveKey[] = ["flexi", "large", "mid", "small", "baf", "debt", "gold"];

export interface SleeveMeta {
  key: SleeveKey;
  label: string;
  shortLabel: string;
  broadType: "Equity" | "Hybrid" | "Debt" | "Commodity";
  /** Long-run expected CAGR assumption (%). */
  expectedCagrPct: number;
  /** Long-run annualised volatility assumption (%). */
  volatilityPct: number;
  /** Historical max drawdown assumption (%). */
  maxDrawdownPct: number;
  role: string;
  horizon: string;
}

export const SLEEVES: Record<SleeveKey, SleeveMeta> = {
  flexi: {
    key: "flexi",
    label: "Flexi Cap Funds",
    shortLabel: "Flexi",
    broadType: "Equity",
    expectedCagrPct: 15.2,
    volatilityPct: 14,
    maxDrawdownPct: -30,
    role: "Core Wealth Anchor",
    horizon: "> 7 Years",
  },
  large: {
    key: "large",
    label: "Large Cap / Value Anchor",
    shortLabel: "Large",
    broadType: "Equity",
    expectedCagrPct: 13.0,
    volatilityPct: 12,
    maxDrawdownPct: -22,
    role: "Franchise Stability",
    horizon: "> 5 Years",
  },
  mid: {
    key: "mid",
    label: "Mid Cap Funds",
    shortLabel: "Mid",
    broadType: "Equity",
    expectedCagrPct: 16.5,
    volatilityPct: 18,
    maxDrawdownPct: -36,
    role: "Alpha Booster",
    horizon: "> 7 Years",
  },
  small: {
    key: "small",
    label: "Small Cap Funds",
    shortLabel: "Small",
    broadType: "Equity",
    expectedCagrPct: 17.5,
    volatilityPct: 22,
    maxDrawdownPct: -42,
    role: "High-Beta Alpha",
    horizon: "> 7 Years",
  },
  baf: {
    key: "baf",
    label: "Balanced Advantage Funds",
    shortLabel: "BAF",
    broadType: "Hybrid",
    expectedCagrPct: 11.8,
    volatilityPct: 8,
    maxDrawdownPct: -14,
    role: "Counter-Cyclical Hedger",
    horizon: "> 3 Years",
  },
  debt: {
    key: "debt",
    label: "Arbitrage & Short Debt",
    shortLabel: "Debt",
    broadType: "Debt",
    expectedCagrPct: 7.2,
    volatilityPct: 1.5,
    maxDrawdownPct: -1,
    role: "Dry Powder Buffer",
    horizon: "Liquidity / Buffer",
  },
  gold: {
    key: "gold",
    label: "Sovereign Gold / Gold ETFs",
    shortLabel: "Gold",
    broadType: "Commodity",
    expectedCagrPct: 11.5,
    volatilityPct: 16,
    maxDrawdownPct: -12,
    role: "Crisis Shock Absorber",
    horizon: "> 5 Years",
  },
};

/** SEBI category → the one canonical sleeve it belongs to (ADR-0001). */
export const CATEGORY_TO_SLEEVE: Record<FundCategory, SleeveKey> = {
  "Flexi Cap": "flexi",
  "Large Cap": "large",
  "Mid Cap": "mid",
  "Small Cap": "small",
  "Balanced Advantage": "baf",
  Arbitrage: "debt",
  "Gold / Commodity": "gold",
};

export const sleeveOf = (category: FundCategory): SleeveKey => CATEGORY_TO_SLEEVE[category];

/**
 * Fallback look-through mix used when a fund is metrics-only (no holdings
 * disclosure). These are explicit assumptions, surfaced in the UI.
 */
export const SLEEVE_DEFAULT_MARKETCAP: Record<SleeveKey, MarketCapBreakdown> = {
  flexi: { largeCap: 68, midCap: 16, smallCap: 2, cashDebt: 14, commodity: 0 },
  large: { largeCap: 88, midCap: 8, smallCap: 0, cashDebt: 4, commodity: 0 },
  mid: { largeCap: 12, midCap: 76, smallCap: 8, cashDebt: 4, commodity: 0 },
  small: { largeCap: 4, midCap: 12, smallCap: 79, cashDebt: 5, commodity: 0 },
  baf: { largeCap: 46, midCap: 12, smallCap: 3, cashDebt: 39, commodity: 0 },
  debt: { largeCap: 0, midCap: 0, smallCap: 0, cashDebt: 100, commodity: 0 },
  gold: { largeCap: 0, midCap: 0, smallCap: 0, cashDebt: 1, commodity: 99 },
};

export type RiskProfile = "aggressive" | "moderate" | "conservative";
export type AllocationModel = "baseline" | "enhanced";

export interface AllocationPreset {
  profile: RiskProfile;
  model: AllocationModel;
  weights: SleeveWeights;
  title: string;
  description: string;
}

const w = (partial: Partial<SleeveWeights>): SleeveWeights => ({
  flexi: 0,
  large: 0,
  mid: 0,
  small: 0,
  baf: 0,
  debt: 0,
  gold: 0,
  ...partial,
});

export const ALLOCATION_PRESETS: Record<RiskProfile, Record<AllocationModel, AllocationPreset>> = {
  aggressive: {
    baseline: {
      profile: "aggressive",
      model: "baseline",
      title: "L02 Two-Asset Model",
      description: "Pure lecture baseline: 80% equity / 20% debt.",
      weights: w({ flexi: 45, mid: 25, large: 10, debt: 20 }),
    },
    enhanced: {
      profile: "aggressive",
      model: "enhanced",
      title: "Council Multi-Asset",
      description: "Adds a gold crisis sleeve to the 80/12/8 mix.",
      weights: w({ flexi: 40, mid: 25, large: 15, debt: 12, gold: 8 }),
    },
  },
  moderate: {
    baseline: {
      profile: "moderate",
      model: "baseline",
      title: "L02 Balanced Model",
      description: "Classic 50:50 equity / debt blend.",
      weights: w({ flexi: 30, mid: 20, debt: 50 }),
    },
    enhanced: {
      profile: "moderate",
      model: "enhanced",
      title: "Council Balanced + Gold",
      description: "Adds a dynamic BAF sleeve and gold hedge.",
      weights: w({ flexi: 30, mid: 15, baf: 20, debt: 25, gold: 10 }),
    },
  },
  conservative: {
    baseline: {
      profile: "conservative",
      model: "baseline",
      title: "L02 Capital-Preservation Model",
      description: "20% equity to clear the inflation hurdle, 80% debt.",
      weights: w({ large: 20, debt: 80 }),
    },
    enhanced: {
      profile: "conservative",
      model: "enhanced",
      title: "Council Preservation + Gold",
      description: "20% equity, high-grade debt and a gold buffer.",
      weights: w({ large: 20, debt: 70, gold: 10 }),
    },
  },
};

export const sleeveLabel = (key: SleeveKey): string => SLEEVES[key].shortLabel;

/**
 * Scale arbitrary sleeve weights to exactly 100 using the largest-remainder
 * method. Never produces a negative residue or a void. All-zero input becomes
 * an equal split.
 */
export function balanceWeightsTo100(weights: SleeveWeights): SleeveWeights {
  const total = SLEEVE_KEYS.reduce((s, k) => s + Math.max(0, weights[k] ?? 0), 0);
  const out = {} as SleeveWeights;

  if (total <= 0) {
    const base = Math.floor(100 / SLEEVE_KEYS.length);
    let remainder = 100 - base * SLEEVE_KEYS.length;
    for (const k of SLEEVE_KEYS) {
      out[k] = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder -= 1;
    }
    return out;
  }

  const scaled = SLEEVE_KEYS.map((k) => {
    const exact = (Math.max(0, weights[k] ?? 0) / total) * 100;
    return { key: k, floor: Math.floor(exact), frac: exact - Math.floor(exact) };
  });
  let remainder = 100 - scaled.reduce((s, x) => s + x.floor, 0);
  scaled
    .slice()
    .sort((a, b) => b.frac - a.frac)
    .forEach((x) => {
      if (remainder > 0) {
        x.floor += 1;
        remainder -= 1;
      }
    });
  for (const x of scaled) out[x.key] = x.floor;
  return out;
}
