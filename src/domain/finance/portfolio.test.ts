import { describe, expect, it } from "vitest";
import {
  blendedCapture,
  crashStress,
  CRASH_SCENARIOS,
  naiveVolatility,
  portfolioVolatility,
  stockOverlap,
  summariseRisk,
  topConcentration,
  type FundWeight,
} from "./portfolio";
import { makeFund } from "./factories";
import type { StockHolding } from "./types";
import type { SleeveWeights } from "./types";

const W = (p: Partial<SleeveWeights>): SleeveWeights => ({
  flexi: 0,
  large: 0,
  mid: 0,
  small: 0,
  baf: 0,
  debt: 0,
  gold: 0,
  ...p,
});

describe("portfolioVolatility", () => {
  it("returns the sleeve volatility for a single-sleeve portfolio", () => {
    expect(portfolioVolatility(W({ flexi: 100 }))).toBeCloseTo(14, 5);
    expect(portfolioVolatility(W({ debt: 100 }))).toBeCloseTo(1.5, 5);
  });

  it("shows a diversification benefit for low-correlation sleeves", () => {
    const mix = W({ flexi: 50, gold: 50 });
    expect(portfolioVolatility(mix)).toBeLessThan(naiveVolatility(mix));
  });

  it("summarises risk with expected CAGR and drawdown", () => {
    const s = summariseRisk(W({ flexi: 40, mid: 25, large: 15, debt: 12, gold: 8 }));
    expect(s.expectedCagrPct).toBeGreaterThan(10);
    expect(s.diversificationBenefitPct).toBeGreaterThan(0);
    expect(s.naiveDrawdownPct).toBeLessThan(0);
  });

  it("ignores negative weights and re-normalises", () => {
    expect(portfolioVolatility(W({ flexi: -10, debt: 100 }))).toBeCloseTo(1.5, 5);
  });
});

describe("capture", () => {
  it("weights up/down capture across funds", () => {
    const a = { fund: makeFund({ id: "a", risk: { ...makeFund().risk, upCapturePct: 100, downCapturePct: 50 } }), weightPct: 50 };
    const b = { fund: makeFund({ id: "b", risk: { ...makeFund().risk, upCapturePct: 80, downCapturePct: 70 } }), weightPct: 50 };
    const c = blendedCapture([a, b]);
    expect(c.upCapturePct).toBe(90);
    expect(c.downCapturePct).toBe(60);
    expect(c.spreadPts).toBe(30);
  });
});

describe("crashStress", () => {
  const equity = makeFund({
    id: "eq",
    category: "Flexi Cap",
    risk: { ...makeFund().risk, downCapturePct: 50 },
  });
  const gold = makeFund({ id: "gold", category: "Gold / Commodity", sleeve: "gold" });
  const debt = makeFund({ id: "arb", category: "Arbitrage", sleeve: "debt" });

  it("scales the benchmark drawdown by down-capture for equity", () => {
    const holdings: FundWeight[] = [{ fund: equity, weightPct: 100 }];
    const r = crashStress(holdings, CRASH_SCENARIOS[0]!);
    expect(r.portfolioPct).toBeCloseTo(-19.2, 1);
    expect(r.protectedPct).toBeGreaterThan(0);
  });

  it("applies positive crisis returns to gold and debt", () => {
    const holdings: FundWeight[] = [
      { fund: gold, weightPct: 50 },
      { fund: debt, weightPct: 50 },
    ];
    const r = crashStress(holdings, CRASH_SCENARIOS[0]!);
    expect(r.portfolioPct).toBeCloseTo((12.4 + 0.8) / 2, 1);
  });
});

describe("overlap & concentration", () => {
  const shared: StockHolding[] = [
    makeHolding({ ticker: "A", name: "A", weightPct: 10 }),
    makeHolding({ ticker: "B", name: "B", weightPct: 5 }),
  ];
  function makeHolding(overrides: Partial<StockHolding>): StockHolding {
    return {
      name: "X",
      ticker: "X",
      sector: "Financials",
      weightPct: 5,
      valuationMetric: "PB",
      metricValue: 2,
      marketPrice: 100,
      marketCapTier: "Large Cap",
      rationale: "",
      ...overrides,
    };
  }

  it("detects shared stocks and sums their combined weight", () => {
    const f1 = makeFund({ id: "f1", topHoldings: shared });
    const f2 = makeFund({ id: "f2", topHoldings: shared });
    const holdings: FundWeight[] = [
      { fund: f1, weightPct: 50 },
      { fund: f2, weightPct: 50 },
    ];
    const o = stockOverlap(holdings);
    expect(o.items).toHaveLength(2);
    expect(o.overlapPct).toBeCloseTo(15, 1);
    expect(o.status).toBe("EXCELLENT");
    expect(o.uniqueStocks).toBe(2);
  });

  it("computes top-10 concentration", () => {
    const f = makeFund({ id: "f", topHoldings: shared });
    expect(topConcentration([{ fund: f, weightPct: 100 }], 10)).toBeCloseTo(15, 1);
  });
});
