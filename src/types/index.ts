export type FundCategory = 
  | 'Large Cap' 
  | 'Large & Mid Cap' 
  | 'Mid Cap' 
  | 'Small Cap' 
  | 'Flexi Cap' 
  | 'Focused Fund' 
  | 'ELSS' 
  | 'Aggressive Hybrid' 
  | 'Balanced Advantage' 
  | 'Multi Asset' 
  | 'Arbitrage' 
  | 'Conservative Hybrid' 
  | 'Equity Savings'
  | 'Gold / Commodity';

export type InvestmentHorizon = 'Short (< 3Y)' | 'Medium (3-7Y)' | 'Long (> 7Y)';

export interface StockHolding {
  name: string;
  ticker: string;
  sector: string;
  weight: number; // e.g. 7.5%
  valuationMetric: 'PE' | 'PB' | 'EV/EBITDA' | 'P/S' | 'Dividend Yield';
  metricValue: number;
  marketPrice: number;
  rationale: string;
  marketCapTier?: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Debt/Cash' | 'Commodity';
}

export interface SectorWeight {
  sector: string;
  weight: number;
  valuationMetric: 'PE' | 'PB' | 'EV/EBITDA' | 'P/S' | 'Dividend Yield';
  macroSensitivity: 'Pro-Cyclical' | 'Counter-Cyclical' | 'Defensive' | 'Export/USD-Beneficiary';
}

export interface RollingReturnDistribution {
  threeYearRollingAvg: number;
  threeYearRollingMin: number;
  threeYearRollingMax: number;
  benchmarkRollingAvg: number;
  percentBeatingBenchmark: number;
  percentPositiveReturns: number;
  brackets: { label: string; percentage: number; count: number }[];
}

export interface RiskMetrics {
  standardDeviation: number; // Total portfolio risk
  beta: number; // Market sensitivity
  sharpeRatio: number; // (Rp - Rf) / SD
  treynorRatio: number; // (Rp - Rf) / Beta
  jensensAlpha: number; // Actual - Minimum expected return via CAPM
  sortinoRatio: number; // (Rp - Rf) / Downside SD
  benchmarkSortino: number;
  informationRatio: number; // Active return / Tracking error
  rSquared: number; // % return explained by benchmark
  upCaptureRatio: number; // > 100 is outperformance in up markets
  downCaptureRatio: number; // < 100 is superior downside defense
}

export interface HurdleDeltas {
  rollingDelta: number; // fund - benchmark
  sortinoDelta: number; // fund - 1.50
  alphaDelta: number;   // fund - 1.50%
  upCaptureDelta: number; // fund - 80%
  downCaptureDelta: number; // 75% - fund (positive = safe below 75%, negative = breached)
  primaryFailureHurdle?: string;
  rejectionReason?: string;
}

export interface FundFiveStepStatus {
  rollingPassed: boolean;
  sortinoPassed: boolean;
  alphaPassed: boolean;
  upCapturePassed: boolean;
  downCapturePassed: boolean;
  totalScore: number; // 0 to 5
  verdict: 'QUALIFIED' | 'WATCHLIST' | 'REJECT';
  summary: string;
  hurdleDeltas?: HurdleDeltas;
}

export interface MarketCapBreakdown {
  largeCap: number;   // %
  midCap: number;     // %
  smallCap: number;   // %
  cashDebt: number;   // %
  commodity: number;  // % (e.g. 100 for Gold)
}

export interface ManagedFundItem {
  name: string;
  category: string;
  aumCr: number;
  threeYearCagr: number;
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

export interface QuarterlyPerformance {
  quarter: string;
  fundReturn: number;
  benchmarkReturn: number;
  alpha: number;
}

export interface Fund {
  id: string;
  name: string;
  shortName: string;
  fundHouse: string;
  category: FundCategory;
  broadType: 'Equity' | 'Hybrid' | 'Debt/Cash' | 'Commodity';
  nav: number;
  aumCr: number;
  expenseRatio: number;
  inceptionYear: number;
  fundManager: string;
  fundManagerTenureYears: number;
  portfolioTurnover: number;
  cashHoldingPct: number;
  benchmark: string;
  style: 'Growth' | 'Value' | 'Blend';
  portfolioPE: number;
  portfolioPB: number;
  weightedMultiples: {
    pe: number; // FMCG, IT, Pharma weighted PE
    pb: number; // Banks, NBFCs, Real Estate, Infra weighted PB
    evEbitda: number; // Power, Telecom, Oil & Gas weighted EV/EBITDA
    priceToSales: number; // Auto & Cyclicals weighted P/S
    dividendYield: number; // PSUs weighted Div Yield
  };
  rollingDistribution: RollingReturnDistribution;
  riskMetrics: RiskMetrics;
  fiveStepFilter: FundFiveStepStatus;
  marketCapBreakdown?: MarketCapBreakdown;
  managerProfile?: FundManagerProfile;
  quarterlyPerformance?: QuarterlyPerformance[];
  topHoldings: StockHolding[];
  sectorAllocation: SectorWeight[];
  agentReviews: {
    aggressive: { score: number; comment: string; stance: 'Overweight' | 'Neutral' | 'Underweight' };
    moderate: { score: number; comment: string; stance: 'Overweight' | 'Neutral' | 'Underweight' };
    conservative: { score: number; comment: string; stance: 'Overweight' | 'Neutral' | 'Underweight' };
    macro: { score: number; comment: string; stance: 'Overweight' | 'Neutral' | 'Underweight' };
    dueDiligence: { score: number; comment: string; stance: 'Approved' | 'Review' | 'Flagged' };
  };
}

export interface CourseModule {
  id: string;
  lectureNumber: string;
  title: string;
  subtitle: string;
  category: 'Strategic Foundation' | 'Goal Planning' | 'Macro Economics' | 'Quantitative Filters' | 'Portfolio Due Diligence';
  keyInsights: string[];
  commonAdvisorMistake: string;
  scientificSolution: string;
  practicalRule: string;
  formulas?: { name: string; formula: string; description: string }[];
  interactiveComponent: 'asset-allocator' | 'tvm-goal' | 'category-filter' | 'macro-simulator' | 'quant-filter' | 'portfolio-valuation';
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  variant: 'Aggressive' | 'Moderate' | 'Conservative' | 'Macro' | 'DueDiligence';
  tagline: string;
  mandate: string;
  assetAllocation: { equity: number; debt: number; gold: number; cash: number };
  philosophy: string;
  screeningCriteria: string[];
  avoidances: string[];
  keyQuote: string;
}

export interface TVMGoalInput {
  goalName: string;
  horizonYears: number;
  targetAmountToday: number;
  inflationRatePct: number;
  expectedReturnPct: number;
  existingLumpSum: number;
}

export interface TVMGoalResult {
  futureTargetAmount: number;
  realRateOfReturn: number;
  requiredMonthlySIP: number;
  requiredLumpSumToday: number;
  wealthCreated: number;
  totalInvested: number;
}
