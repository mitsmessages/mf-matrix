import type { CourseModule } from "@/domain/content/types";

/**
 * Curriculum mapped to the source transcript files. Lecture codes match the
 * transcript filenames exactly (see pipeline/build_content.py and CONTEXT.md).
 */
export const courseModules: CourseModule[] = [
  {
    id: "m01",
    order: 1,
    code: "L01",
    title: "The Advisory Value Chain & Core Philosophy",
    subtitle: "Why scheme selection is the last step, not the first",
    category: "Strategic Foundation",
    keyInsights: [
      "Point-to-point trailing returns give 100% weight to the most recent 12 months and mislead investors.",
      "Scheme selection is the final execution step in a six-stage chain, not the starting point.",
      "A disciplined asset-allocation framework explains most of long-term portfolio stability.",
    ],
    commonMistake:
      "Picking equity schemes purely from 1/3/5-year trailing returns and chasing the latest top performer.",
    scientificSolution:
      "Follow the chain: Risk Profile → Asset Allocation → Goal (TVM) → Macro → Quant Filter → Forward Valuation.",
    practicalRule:
      "Never recommend a fund before establishing risk tolerance, strategic asset mix and goal horizon.",
    formulas: [
      {
        name: "Value chain",
        formula: "Selection = f(Profile, Allocation, Goal, Macro, Quant, Valuation)",
        description: "Each prior stage constrains the next.",
      },
    ],
    lab: "allocation",
    citations: [{ lectureId: "L01-1", label: "About this course" }],
  },
  {
    id: "m02",
    order: 2,
    code: "L02",
    title: "Why Asset Allocation Matters — The Five Laws",
    subtitle: "Empirical evidence across 26 years of Indian market data",
    category: "Strategic Foundation",
    keyInsights: [
      "Low or negative correlation reduces portfolio variance without sacrificing expected return.",
      "Chasing the previous winner is self-defeating because of mean reversion.",
      "Rebalancing mechanically sells what ran and buys what lagged, removing forecast bias.",
      "Gold is a currency-devaluation and geopolitical-crisis hedge in INR terms.",
    ],
    commonMistake:
      "Going 100% into last year's winning asset class and panic-selling during drawdowns.",
    scientificSolution:
      "Chasing winners returned ~5.38% CAGR over 26 years; disciplined rebalancing delivered ~8.17% with lower risk.",
    practicalRule:
      "Rebalance annually, or whenever an asset class drifts more than ±5% from target.",
    formulas: [
      {
        name: "Portfolio variance",
        formula: "σ²p = w₁²σ₁² + w₂²σ₂² + 2·w₁·w₂·Cov(1,2)",
        description: "Low covariance makes portfolio risk far lower than the weighted sum of risks.",
      },
      {
        name: "Rebalancing trigger",
        formula: "|Current_weight − Target_weight| ≥ 5%",
        description: "Trade only on drift or at the annual review.",
      },
    ],
    lab: "allocation",
    citations: [{ lectureId: "L02-1", label: "Why asset allocation matters" }],
  },
  {
    id: "m03",
    order: 3,
    code: "L03",
    title: "Time Value of Money & Goal Planning",
    subtitle: "Bind every rupee to an inflation-adjusted life goal",
    category: "Goal Planning",
    keyInsights: [
      "Future cost = today's cost compounded at inflation; ₹1 Cr in 20 years is not ₹1 Cr today.",
      "The real return, not the nominal return, decides whether a goal is met.",
      "A goal-linked SIP survives market panic because stopping harms the goal, not an abstract number.",
      "Existing corpus compounds too, so the required SIP is the shortfall, not the whole target.",
    ],
    commonMistake: "Setting a nominal target without adjusting for inflation or existing corpus.",
    scientificSolution:
      "Solve the future inflated liability, subtract the future value of existing savings, then solve the SIP.",
    practicalRule: "Always plan in real terms and review the goal annually, not the daily NAV.",
    formulas: [
      {
        name: "Future cost",
        formula: "FV = PV × (1 + inflation)^n",
        description: "Inflate the goal to the horizon date.",
      },
      {
        name: "Real return (Fisher)",
        formula: "r_real = (1 + r_nominal) / (1 + inflation) − 1",
        description: "Return measured in today's purchasing power.",
      },
      {
        name: "SIP (annuity due)",
        formula: "SIP = FV × r / [ ((1+r)^n − 1) × (1+r) ]",
        description: "Start-of-month deposits; solved numerically when a step-up applies.",
      },
    ],
    lab: "tvm",
    citations: [
      { lectureId: "L03-1", label: "Time value of money I" },
      { lectureId: "L03-2", label: "Time value of money II" },
      { lectureId: "L03-3", label: "Case study" },
    ],
  },
  {
    id: "m04",
    order: 4,
    code: "L04",
    title: "Equity & Hybrid Fund Categories",
    subtitle: "Mapping the SEBI universe before you screen it",
    category: "Asset Classes",
    keyInsights: [
      "Flexi Cap is the modern core: no market-cap constraint, full manager freedom.",
      "Mid and Small Cap carry structural alpha and structural drawdown; size the position deliberately.",
      "Balanced Advantage funds shift equity/debt dynamically using valuation rules.",
      "Arbitrage funds are debt-like in risk but equity-taxed in treatment.",
    ],
    commonMistake: "Treating every equity fund as interchangeable and ignoring category behaviour.",
    scientificSolution:
      "Classify each scheme into a canonical sleeve and allocate by sleeve, not by fund label.",
    practicalRule: "Own the sleeve first; choose the manager second.",
    formulas: [
      {
        name: "Sleeve mapping",
        formula: "Fund → Category → SleeveKey",
        description: "One canonical allocation unit across the whole engine (ADR-0001).",
      },
    ],
    lab: "allocation",
    citations: [{ lectureId: "L04-1", label: "Equity & hybrid fund types" }],
  },
  {
    id: "m05",
    order: 5,
    code: "L05",
    title: "Macro Factors & Sector Transmission",
    subtitle: "Condense the macro noise into inflation and interest rates",
    category: "Macro Economics",
    keyInsights: [
      "Rate hikes squeeze rate-sensitive sectors: realty, autos and high-debt infra.",
      "Exporters (IT, Pharma) benefit from a weaker rupee and are relatively rate-immune.",
      "When cuts begin, falling EMIs unlock domestic auto and housing demand.",
      "Balanced Advantage funds automate this rotation with rule-based valuation triggers.",
    ],
    commonMistake: "Tracking twenty macro indicators and making emotional thematic bets.",
    scientificSolution:
      "Map fund sector exposure against the RBI rate stance: hike → defensives/exporters; cut → cyclicals.",
    practicalRule:
      "Hike/inflation: overweight IT, Pharma, FMCG, Gold. Cut/expansion: rotate to Autos, Realty, Capex, Private Banks.",
    formulas: [
      {
        name: "Cycle stance",
        formula: "Stance = (Repo trend falling) ? Cyclicals : Defensives",
        description: "Sector leadership rotates with the monetary pendulum.",
      },
    ],
    lab: "none",
    citations: [{ lectureId: "L05-1", label: "Macro factors and their impact" }],
  },
  {
    id: "m06",
    order: 6,
    code: "L06",
    title: "Rolling Returns Over a Full Cycle",
    subtitle: "Why point-to-point trailing returns lie",
    category: "Quantitative Filters",
    keyInsights: [
      "Trailing CAGR is distorted by the start date and the latest run.",
      "Rolling returns measure thousands of holding periods across bull, bear and sideways markets.",
      "Judge a fund by the share of windows that beat the benchmark and by negative-window elimination.",
    ],
    commonMistake: "Using a single 1/3/5-year trailing CAGR as the whole story.",
    scientificSolution:
      "Compute daily rolling 3-year returns over a 10-year cycle; require beating the benchmark in ≥75% of windows.",
    practicalRule:
      "Never invest where the 3-year rolling distribution shows meaningful negative-return windows.",
    formulas: [
      {
        name: "Rolling CAGR",
        formula: "CAGR(t, t+k) = (NAV_{t+k} / NAV_t)^(1/k) − 1",
        description: "Evaluated daily across a 10-year window.",
      },
      {
        name: "Hurdle",
        formula: "beat_benchmark_pct ≥ 75%",
        description: "The gatekeeper uses the share of winning windows, not the mean.",
      },
    ],
    lab: "screener",
    citations: [{ lectureId: "L06-1", label: "Rolling returns" }],
  },
  {
    id: "m07",
    order: 7,
    code: "L07",
    title: "Standard Deviation & Beta",
    subtitle: "The two measures every factsheet leads with",
    category: "Quantitative Filters",
    keyInsights: [
      "Standard deviation measures total dispersion; beta measures sensitivity to the market.",
      "High beta borrows market risk; it is not skill.",
      "R-squared tells you how much of the return the benchmark explains.",
    ],
    commonMistake: "Rewarding a high-beta fund for bull-market returns it merely borrowed.",
    scientificSolution:
      "Adjust returns for the risk actually taken: use beta and R-squared, then move to alpha and downside measures.",
    practicalRule: "Read beta with R-squared; a low R-squared makes beta meaningless.",
    formulas: [
      {
        name: "Beta",
        formula: "β = Cov(Rp, Rm) / Var(Rm)",
        description: "Market sensitivity relative to 1.0.",
      },
      {
        name: "Standard deviation",
        formula: "σ = sqrt( Σ (R_t − R̄)² / N )",
        description: "Total return dispersion.",
      },
    ],
    lab: "screener",
    citations: [{ lectureId: "L07-1", label: "Standard deviation and beta" }],
  },
  {
    id: "m08",
    order: 8,
    code: "L08",
    title: "Sharpe, Treynor & Jensen's Alpha",
    subtitle: "Separating skill from leveraged market exposure",
    category: "Quantitative Filters",
    keyInsights: [
      "Sharpe divides excess return by total risk; Treynor divides by beta.",
      "Jensen's alpha tests return above the CAPM prediction for the fund's beta.",
      "A fund with beta 1.4 that 'beats' in a bull run has created no alpha.",
    ],
    commonMistake: "Assuming any benchmark outperformance is manager skill.",
    scientificSolution:
      "Compute alpha = Rp − [Rf + β·(Rm − Rf)]; require a positive, material alpha.",
    practicalRule: "Insist on alpha > +1.5% and evidence of genuine active share.",
    formulas: [
      {
        name: "Jensen's alpha",
        formula: "αp = Rp − [Rf + βp·(Rm − Rf)]",
        description: "Excess return above the CAPM benchmark.",
      },
      {
        name: "Treynor",
        formula: "(Rp − Rf) / βp",
        description: "Excess return per unit of market risk.",
      },
    ],
    lab: "screener",
    citations: [{ lectureId: "L08-1", label: "Sharpe, Treynor and Jensen's alpha" }],
  },
  {
    id: "m09",
    order: 9,
    code: "L09",
    title: "Downside Ratios & Capture",
    subtitle: "Sortino, information ratio and the asymmetric shield",
    category: "Quantitative Filters",
    keyInsights: [
      "Investors feel only downside variance; Sortino penalises that, not upside.",
      "Capture ratios describe participation: up-capture over 80, down-capture under 75.",
      "A positive capture spread is the mathematical core of durable compounding.",
      "Drawdowns compound asymmetrically: −50% needs +100% just to break even.",
    ],
    commonMistake: "Judging funds only on bull-market returns and ignoring the drawdown.",
    scientificSolution:
      "Filter on Sortino and capture ratios so capital is preserved and compounding resumes from a higher base.",
    practicalRule: "Target up-capture > 80 and down-capture < 75; aim for a spread above +15 points.",
    formulas: [
      {
        name: "Sortino",
        formula: "Sortino = (Rp − MAR) / DownsideDeviation",
        description: "Downside semi-deviation below the minimum acceptable return.",
      },
      {
        name: "Capture spread",
        formula: "Spread = Up_Capture − Down_Capture",
        description: "Asymmetry target: > +15 points.",
      },
    ],
    lab: "screener",
    citations: [{ lectureId: "L09-1", label: "Advanced ratios and their implications" }],
  },
  {
    id: "m10",
    order: 10,
    code: "L10",
    title: "Picking the Best Fund — The Five Filters",
    subtitle: "Turning the ratios into a single gatekeeper",
    category: "Portfolio Due Diligence",
    keyInsights: [
      "Five hurdles: rolling beat rate, Sortino, Jensen's alpha, up-capture and down-capture.",
      "A fund clearing at least four of the five is a candidate; three is watchlist only.",
      "The pass is derived from data, never copied from a factsheet.",
    ],
    commonMistake: "Using a different definition of 'good' on every page and every conversation.",
    scientificSolution:
      "One threshold source and one derivation, applied identically to every fund.",
    practicalRule: "Clearing at least 4 of 5 hurdles qualifies a fund; 3/5 is watchlist; 2/5 or fewer is rejected.",
    formulas: [
      {
        name: "Gatekeeper",
        formula: "Verdict = ≥4/5 ? QUALIFIED : 3/5 ? WATCHLIST : REJECT",
        description: "Score is the count of cleared hurdles.",
      },
    ],
    lab: "screener",
    citations: [{ lectureId: "L10-1", label: "Picking the best fund" }],
  },
  {
    id: "m11",
    order: 11,
    code: "L10-2",
    title: "Forward-Looking Analysis & Method 2 Valuation",
    subtitle: "Past data is not enough — audit what the manager holds today",
    category: "Portfolio Due Diligence",
    keyInsights: [
      "A single portfolio P/E is broken because it blends incomparable sectors.",
      "Banks are valued on P/B; infra and telecom on EV/EBITDA; IT/FMCG on P/E; cyclicals on P/S; PSUs on dividend yield.",
      "A fund is a collection of businesses: judge the price paid for today's earnings, not yesterday's NAV.",
      "Stock overlap reveals whether you are paying active fees for a closet index.",
    ],
    commonMistake: "Buying a fund on last year's factsheet without decomposing the current portfolio.",
    scientificSolution:
      "Decompose holdings into sector-native multiples and compare each against its own historical median.",
    practicalRule: "Never value a bank on P/E or a utility without EV/EBITDA.",
    formulas: [
      {
        name: "Method 2 valuation",
        formula: "V = Σ wᵢ × Multiple_native(sectorᵢ)",
        description: "Sector-appropriate multiples, normalized to 5-year medians.",
      },
    ],
    lab: "diligence",
    citations: [{ lectureId: "L10-2", label: "Forward-looking approach" }],
  },
  {
    id: "m12",
    order: 12,
    code: "L11",
    title: "Portfolio Synthesis & Rebalancing",
    subtitle: "Assembling the all-weather matrix",
    category: "Synthesis",
    keyInsights: [
      "Four to five non-overlapping funds beat fifteen overlapping ones.",
      "Rebalancing harvests volatility and is worth roughly 1.5–2.0% a year.",
      "Review annually; watching daily NAVs destroys behaviour.",
      "The final verdict is the synthesis of all stages, derived, never asserted.",
    ],
    commonMistake: "Holding many funds across overlapping categories, creating an expensive closet index.",
    scientificSolution:
      "Build a small set of sleeves, enforce a ±5% band and review once a year.",
    practicalRule:
      "Max five funds: a flexi core, a large/value anchor, a mid alpha engine and a defensive cushion.",
    formulas: [
      {
        name: "Rebalance band",
        formula: "Trigger = |w_current − w_target| ≥ 5%",
        description: "Annual review plus drift-based trades.",
      },
    ],
    lab: "diligence",
    citations: [{ lectureId: "L11", label: "Bonus: performance and portfolio analysis" }],
  },
];
