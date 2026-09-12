import type { Fund, FundCategory, StockHolding } from "./types";
import { sleeveOf } from "./sleeves";

/** Test/fixture factory — not imported by production code. */
export function makeFund(overrides: Partial<Fund> = {}): Fund {
  const category: FundCategory = overrides.category ?? "Flexi Cap";
  const base: Fund = {
    id: overrides.id ?? "test-fund",
    name: overrides.name ?? "Test Fund - Direct Growth",
    shortName: overrides.shortName ?? "Test Fund",
    fundHouse: overrides.fundHouse ?? "Test MF",
    category,
    sleeve: overrides.sleeve ?? sleeveOf(category),
    nav: 100,
    aumCr: 10_000,
    expenseRatioPct: 0.6,
    inceptionYear: 2013,
    fundManager: "Test Manager",
    fundManagerTenureYears: 8,
    portfolioTurnoverPct: 30,
    cashHoldingPct: 4,
    benchmark: "NIFTY 500 TRI",
    style: "Blend",
    portfolioPE: 22,
    portfolioPB: 3,
    weightedMultiples: { pe: 24, pb: 2.8, evEbitda: 11, priceToSales: 2.2, dividendYieldPct: 1.8 },
    rolling: {
      avgPct: 18,
      minPct: 6,
      maxPct: 30,
      benchmarkAvgPct: 14,
      beatBenchmarkPct: 88,
      positivePct: 100,
      brackets: [],
    },
    risk: {
      stdDevPct: 12,
      beta: 0.8,
      sharpe: 1.2,
      treynor: 18,
      alphaPct: 4,
      sortino: 1.9,
      benchmarkSortino: 1.2,
      informationRatio: 0.8,
      rSquared: 0.78,
      upCapturePct: 88,
      downCapturePct: 54,
    },
    marketCapBreakdown: { largeCap: 70, midCap: 16, smallCap: 2, cashDebt: 12, commodity: 0 },
    topHoldings: [
      {
        name: "HDFC Bank",
        ticker: "HDFCBANK",
        sector: "Financials",
        weightPct: 8,
        valuationMetric: "PB",
        metricValue: 2.7,
        marketPrice: 1680,
        marketCapTier: "Large Cap",
        rationale: "Core banking franchise",
      },
    ],
    sectorAllocation: [],
    agentReviews: {
      aggressive: { score: 8, comment: "Quality compounder.", stance: "Overweight" },
      moderate: { score: 8, comment: "Great core.", stance: "Neutral" },
      conservative: { score: 6, comment: "Watch cash.", stance: "Underweight" },
      macro: { score: 7, comment: "Rate-sensitive.", stance: "Neutral" },
      dueDiligence: { score: 8, comment: "Clean books.", stance: "Approved" },
    },
  };
  return { ...base, ...overrides };
}

export function makeHolding(overrides: Partial<StockHolding> = {}): StockHolding {
  return {
    name: "HDFC Bank",
    ticker: "HDFCBANK",
    sector: "Financials",
    weightPct: 8,
    valuationMetric: "PB",
    metricValue: 2.7,
    marketPrice: 1680,
    marketCapTier: "Large Cap",
    rationale: "Core banking franchise",
    ...overrides,
  };
}
