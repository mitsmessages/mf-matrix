import type { SleeveKey } from "./sleeves";
import type { ScreeningProfile } from "./thresholds";

export interface SleeveWeights {
  flexi: number;
  large: number;
  mid: number;
  small: number;
  baf: number;
  debt: number;
  gold: number;
}

export type ScreenerVerdict = "QUALIFIED" | "WATCHLIST" | "REJECT";

export interface RollingDistribution {
  /** Mean 3Y rolling CAGR (%). */
  avgPct: number;
  minPct: number;
  maxPct: number;
  /** Mean 3Y rolling CAGR of the benchmark (%). */
  benchmarkAvgPct: number;
  /** Share of rolling windows that beat the benchmark (%). */
  beatBenchmarkPct: number;
  /** Share of rolling windows with a positive return (%). */
  positivePct: number;
  brackets: { label: string; pct: number; count: number }[];
}

export interface RiskMetrics {
  stdDevPct: number;
  beta: number;
  sharpe: number;
  treynor: number;
  /** Jensen's alpha, percentage points. */
  alphaPct: number;
  sortino: number;
  benchmarkSortino: number;
  informationRatio: number;
  rSquared: number;
  upCapturePct: number;
  downCapturePct: number;
}

export interface WeightedMultiples {
  /** P/E for IT / FMCG / asset-light */
  pe: number;
  /** P/B for banks & NBFCs */
  pb: number;
  /** EV/EBITDA for infra, power, telecom */
  evEbitda: number;
  /** P/S for auto & cyclicals */
  priceToSales: number;
  /** Dividend yield for PSUs (%) */
  dividendYieldPct: number;
}

export interface MarketCapBreakdown {
  largeCap: number;
  midCap: number;
  smallCap: number;
  cashDebt: number;
  commodity: number;
}

export interface StockHolding {
  name: string;
  ticker: string;
  sector: string;
  weightPct: number;
  valuationMetric: "PE" | "PB" | "EV/EBITDA" | "P/S" | "Dividend Yield";
  metricValue: number;
  marketPrice: number;
  marketCapTier: "Large Cap" | "Mid Cap" | "Small Cap" | "Debt/Cash" | "Commodity";
  rationale: string;
}

export interface SectorWeight {
  sector: string;
  weightPct: number;
  valuationMetric: StockHolding["valuationMetric"];
  macroSensitivity: "Pro-Cyclical" | "Counter-Cyclical" | "Defensive" | "Export/USD-Beneficiary";
}

export interface QuarterlyPerformance {
  quarter: string;
  fundReturnPct: number;
  benchmarkReturnPct: number;
}

export interface ManagedFundItem {
  name: string;
  category: string;
  aumCr: number;
  threeYearCagrPct: number;
}

export interface FundManagerProfile {
  name: string;
  age: number;
  education: string;
  totalExperienceYears: number;
  tenureAtSchemeYears: number;
  philosophy: string;
  otherFundsManaged: ManagedFundItem[];
  careerMilestones: string[];
}

export type AgentStance = "Overweight" | "Neutral" | "Underweight";
export type DiligenceStance = "Approved" | "Review" | "Flagged";

export interface AgentReviews {
  aggressive: { score: number; comment: string; stance: AgentStance };
  moderate: { score: number; comment: string; stance: AgentStance };
  conservative: { score: number; comment: string; stance: AgentStance };
  macro: { score: number; comment: string; stance: AgentStance };
  dueDiligence: { score: number; comment: string; stance: DiligenceStance };
}

export type FundCategory =
  | "Flexi Cap"
  | "Large Cap"
  | "Mid Cap"
  | "Small Cap"
  | "Balanced Advantage"
  | "Arbitrage"
  | "Gold / Commodity";

export interface Fund {
  id: string;
  name: string;
  shortName: string;
  fundHouse: string;
  category: FundCategory;
  sleeve: SleeveKey;
  nav: number;
  aumCr: number;
  expenseRatioPct: number;
  inceptionYear: number;
  fundManager: string;
  fundManagerTenureYears: number;
  /** Percentage, 0–1000. Always a percentage (ADR-0002). */
  portfolioTurnoverPct: number;
  cashHoldingPct: number;
  benchmark: string;
  style: "Growth" | "Value" | "Blend";
  portfolioPE: number;
  portfolioPB: number;
  /** Optional: only present for funds with forensic (holdings-level) data. */
  weightedMultiples?: WeightedMultiples;
  rolling: RollingDistribution;
  risk: RiskMetrics;
  /** Optional: falls back to the sleeve assumption when absent. */
  marketCapBreakdown?: MarketCapBreakdown;
  topHoldings: StockHolding[];
  sectorAllocation: SectorWeight[];
  managerProfile?: FundManagerProfile;
  quarterlyPerformance?: QuarterlyPerformance[];
  agentReviews?: AgentReviews;

  /* ------- provenance / universe metadata (present for generated funds) --- */
  /** Recent monthly NAV returns ("YYYY-MM" -> return %), for backtesting. */
  monthlyReturnsPct?: Record<string, number>;
  schemeCode?: number;
  rankInCategory?: number;
  isNewEntry?: boolean;
  historyYears?: number;
  dataQuality?: "full" | "metrics-only";
  asOf?: string;
  source?: string;
}

export interface HurdleResult {
  id: string;
  step: number;
  label: string;
  passed: boolean;
  value: number;
  threshold: number;
  delta: number;
  rule: string;
  unit: string;
}

export interface ScreenerResult {
  results: HurdleResult[];
  score: number;
  verdict: ScreenerVerdict;
  profile: ScreeningProfile;
  passed: HurdleResult[];
  failed: HurdleResult[];
  /** First failing hurdle, for the "why not" column. */
  primaryFailure?: HurdleResult;
  summary: string;
}

export interface AllocationLine {
  sleeve: SleeveKey;
  targetPct: number;
  normalizedPct: number;
}

export interface Selection {
  sleeve: SleeveKey;
  fundIds: string[];
}

export type Selections = Partial<Record<SleeveKey, string[]>>;
