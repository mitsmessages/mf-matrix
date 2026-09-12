import { z } from "zod";

const verdictFree = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

const stanceReview = z.object({
  score: z.number(),
  comment: z.string(),
  stance: z.enum(["Overweight", "Neutral", "Underweight"]),
});

export const stockHoldingSchema = verdictFree({
  name: z.string().min(1),
  ticker: z.string().min(1),
  sector: z.string().min(1),
  weightPct: z.number().min(0).max(100),
  valuationMetric: z.enum(["PE", "PB", "EV/EBITDA", "P/S", "Dividend Yield"]),
  metricValue: z.number(),
  marketPrice: z.number().nonnegative(),
  marketCapTier: z.enum(["Large Cap", "Mid Cap", "Small Cap", "Debt/Cash", "Commodity"]),
  rationale: z.string(),
});

export const sectorWeightSchema = verdictFree({
  sector: z.string().min(1),
  weightPct: z.number().min(0).max(100),
  valuationMetric: z.enum(["PE", "PB", "EV/EBITDA", "P/S", "Dividend Yield"]),
  macroSensitivity: z.enum([
    "Pro-Cyclical",
    "Counter-Cyclical",
    "Defensive",
    "Export/USD-Beneficiary",
  ]),
});

export const fundSchema = verdictFree({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  fundHouse: z.string().min(1),
  category: z.enum([
    "Flexi Cap",
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Balanced Advantage",
    "Arbitrage",
    "Gold / Commodity",
  ]),
  sleeve: z.enum(["flexi", "large", "mid", "small", "baf", "debt", "gold"]),
  nav: z.number().nonnegative(),
  aumCr: z.number().min(0),
  expenseRatioPct: z.number().min(0).max(3),
  inceptionYear: z.number().int().min(0).max(2100),
  fundManager: z.string().min(1),
  fundManagerTenureYears: z.number().min(0),
  portfolioTurnoverPct: z.number().min(0).max(1000),
  cashHoldingPct: z.number().min(0).max(100),
  benchmark: z.string().min(1),
  style: z.enum(["Growth", "Value", "Blend"]),
  portfolioPE: z.number(),
  portfolioPB: z.number(),
  weightedMultiples: z
    .object({
      pe: z.number(),
      pb: z.number(),
      evEbitda: z.number(),
      priceToSales: z.number(),
      dividendYieldPct: z.number(),
    })
    .strict()
    .optional(),
  rolling: z
    .object({
      avgPct: z.number(),
      minPct: z.number(),
      maxPct: z.number(),
      benchmarkAvgPct: z.number(),
      beatBenchmarkPct: z.number().min(0).max(100),
      positivePct: z.number().min(0).max(100),
      brackets: z.array(
        z.object({ label: z.string(), pct: z.number(), count: z.number() }).strict(),
      ),
    })
    .strict(),
  risk: z
    .object({
      stdDevPct: z.number().min(0),
      beta: z.number(),
      sharpe: z.number(),
      treynor: z.number(),
      alphaPct: z.number(),
      sortino: z.number(),
      benchmarkSortino: z.number(),
      informationRatio: z.number(),
      rSquared: z.number().min(0).max(1),
      upCapturePct: z.number(),
      downCapturePct: z.number(),
    })
    .strict(),
  marketCapBreakdown: z
    .object({
      largeCap: z.number(),
      midCap: z.number(),
      smallCap: z.number(),
      cashDebt: z.number(),
      commodity: z.number(),
    })
    .strict()
    .optional(),
  topHoldings: z.array(stockHoldingSchema),
  sectorAllocation: z.array(sectorWeightSchema),
  managerProfile: z
    .object({
      name: z.string(),
      age: z.number(),
      education: z.string(),
      totalExperienceYears: z.number(),
      tenureAtSchemeYears: z.number(),
      philosophy: z.string(),
      otherFundsManaged: z.array(
        z.object({
          name: z.string(),
          category: z.string(),
          aumCr: z.number(),
          threeYearCagrPct: z.number(),
        }),
      ),
      careerMilestones: z.array(z.string()),
    })
    .strict()
    .optional(),
  quarterlyPerformance: z
    .array(
      z.object({
        quarter: z.string(),
        fundReturnPct: z.number(),
        benchmarkReturnPct: z.number(),
      }),
    )
    .optional(),
  agentReviews: z
    .object({
      aggressive: stanceReview,
      moderate: stanceReview,
      conservative: stanceReview,
      macro: stanceReview,
      dueDiligence: z.object({
        score: z.number(),
        comment: z.string(),
        stance: z.enum(["Approved", "Review", "Flagged"]),
      }),
    })
    .strict()
    .optional(),

  schemeCode: z.number().int().optional(),
  rankInCategory: z.number().int().optional(),
  isNewEntry: z.boolean().optional(),
  historyYears: z.number().optional(),
  dataQuality: z.enum(["full", "metrics-only"]).optional(),
  asOf: z.string().optional(),
  source: z.string().optional(),
});

export const datasetSchema = z
  .object({
    asOf: z.string(),
    provenance: z.string(),
    note: z.string(),
    funds: z.array(fundSchema).min(1),
  })
  .strict();

export type Dataset = z.infer<typeof datasetSchema>;

/** Guard that no derived verdict accidentally re-enters the dataset (ADR-0002). */
export function assertNoDerivedFields(value: unknown): void {
  const banned = ["fiveStepFilter", "verdict", "totalScore", "hurdleDeltas"];
  const json = JSON.stringify(value);
  for (const key of banned) {
    if (json.includes(`"${key}"`)) {
      throw new Error(`Dataset must not contain derived field "${key}" (see ADR-0002)`);
    }
  }
}
