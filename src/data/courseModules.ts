import { CourseModule } from '../types';

export const courseModules: CourseModule[] = [
  {
    id: "l01",
    lectureNumber: "L01",
    title: "The Advisory Value Chain & Core Philosophy",
    subtitle: "Why 90% of Investors Fail by Starting at the Wrong End of Scheme Selection",
    category: "Strategic Foundation",
    commonAdvisorMistake: "Picking equity schemes purely based on 1, 3, or 5-year trailing returns and chasing recent top performers.",
    scientificSolution: "Scheme selection is the LAST step in a 6-stage value chain: Risk Profiling -> Asset Allocation -> Goal-Based TVM -> Macro Transmission -> 5-Factor Quant Filtering -> Forward Portfolio Valuation.",
    practicalRule: "Never recommend a fund before establishing the client's risk tolerance, strategic asset mix, and goal horizon.",
    keyInsights: [
      "Trailing returns (point-to-point) deceive investors by giving 100% weight to the most recent 12-month performance.",
      "Selecting an equity fund is the final execution step, not the starting point of wealth management.",
      "A disciplined asset allocation framework accounts for >90% of long-term portfolio return variance and emotional stability."
    ],
    formulas: [
      {
        name: "Wealth Compounding Chain",
        formula: "Final Alpha = Asset_Allocation_Score * (1 - Emotional_Churn) * Portfolio_Sortino",
        description: "Portfolio longevity is governed by allocation discipline before manager selection."
      }
    ],
    interactiveComponent: "asset-allocator"
  },
  {
    id: "l02",
    lectureNumber: "L02",
    title: "Why Asset Allocation Matters (The 5 Irrefutable Laws)",
    subtitle: "Empirical Evidence from 26 Years of Indian Market Data (1993-2019)",
    category: "Strategic Foundation",
    commonAdvisorMistake: "Chasing last year's winning asset class (e.g. going 100% equity at market peaks or panic-selling into debt during crashes).",
    scientificSolution: "In 26 years of Indian market history, no single asset class won consistently. Chasing winners delivered 5.38% CAGR; disciplined 50:50 rebalancing delivered 8.17% with half the volatility.",
    practicalRule: "Establish strict rebalancing thresholds: rebalance once per year or whenever an asset class deviates by +/- 5% from target weights.",
    keyInsights: [
      "Law 1: Negative/Low correlation between asset classes reduces portfolio variance without sacrificing expected returns.",
      "Law 2: Chasing historical winners is statistically self-defeating due to mean reversion.",
      "Law 3: Rebalancing systematically forces you to sell high and buy low without emotional forecast bias.",
      "Law 4: Gold acts as a currency devaluation hedge and geopolitical crisis parachute in INR terms."
    ],
    formulas: [
      {
        name: "Portfolio Variance Formulation",
        formula: "sigma_p^2 = w_1^2 * sigma_1^2 + w_2^2 * sigma_2^2 + 2 * w_1 * w_2 * Cov(1, 2)",
        description: "When covariance is low or negative, portfolio risk is drastically lower than the weighted sum of risks."
      }
    ],
    interactiveComponent: "asset-allocator"
  },
  {
    id: "l03",
    lectureNumber: "L03",
    title: "Method 2 Valuation & The Flaw of Single P/E",
    subtitle: "Why Portfolio-Level P/E Multiples are Scientifically Broken",
    category: "Portfolio Due Diligence",
    commonAdvisorMistake: "Looking at a single portfolio P/E on a mutual fund factsheet and concluding whether the fund is cheap or expensive.",
    scientificSolution: "Method 2 Sector-Appropriate Multiples: Value Banks on P/B, IT/Pharma on P/E, Infra/Telecom on EV/EBITDA, Cyclicals on P/S, and PSUs on Dividend Yield.",
    practicalRule: "Never evaluate a diversified fund using aggregate P/E. Decompose holdings into sector multiples to detect valuation traps.",
    keyInsights: [
      "Banks cannot be valued on P/E because debt is raw inventory, and credit loss provisions distort earnings.",
      "Capital-intensive infrastructure and power companies have heavy depreciation that artificially suppresses EPS; EV/EBITDA is the standard.",
      "Automobile and cyclical earnings peak at the top of the economic cycle; Price-to-Sales prevents buying at peak earnings.",
      "Asset-light compounding businesses (IT, FMCG) convert >90% of Net Profit to Free Cash Flow, making P/E valid."
    ],
    formulas: [
      {
        name: "Method 2 Multi-Sector Valuation",
        formula: "V_fund = sum(w_i * Multiple_native(i)) [P/B for BFSI, EV/EBITDA for Infra, P/E for IT]",
        description: "Sector-native multiples normalized against historical 5-year median valuations."
      }
    ],
    interactiveComponent: "portfolio-valuation"
  },
  {
    id: "l04",
    lectureNumber: "L04",
    title: "Macro Regimes & The 4-Sector Transmission Engine",
    subtitle: "How Inflation and RBI Interest Rate Cycles Dictate Sector Winners",
    category: "Macro Economics",
    commonAdvisorMistake: "Trying to track 20 confusing macroeconomic indicators and making emotional thematic bets on sectors.",
    scientificSolution: "All macro signals condense into one master transmission channel: Inflation and RBI Repo Rates. Map funds according to their sector exposure against the current rate cycle.",
    practicalRule: "In rate hike / inflationary cycles, overweight IT, Pharma, FMCG, and Gold. In rate cut / expansion cycles, rotate into Autos, Realty, Capex, and Private Banks.",
    keyInsights: [
      "When RBI raises rates, borrowing costs spike: interest-rate-sensitive sectors (Real Estate, Autos, High Debt Infra) face margin compression.",
      "Exporters (IT, Pharma) benefit from US Dollar strength and domestic rate immunity.",
      "When inflation peaks and the RBI begins rate cuts, EMI reductions unleash domestic auto and housing demand.",
      "Balanced Advantage Funds (BAFs) dynamically manage this asset shift using rule-based P/B or trailing P/E models."
    ],
    formulas: [
      {
        name: "Macro Transmission Ratio",
        formula: "Cycle_Stance = (RBI_Repo_Trend == 'Falling') ? Heavy_Cyclicals : Heavy_Defensives",
        description: "Sector leadership rotates systematically across the monetary policy pendulum."
      }
    ],
    interactiveComponent: "macro-simulator"
  },
  {
    id: "l05",
    lectureNumber: "L05",
    title: "Category Invalidation (The 7 Discarded SEBI Categories)",
    subtitle: "Pruning the 36 SEBI Categories Down to the Core 4",
    category: "Quantitative Filters",
    commonAdvisorMistake: "Recommending Sectoral/Thematic funds, Dividend Yield funds, Credit Risk funds, or active Large Cap funds.",
    scientificSolution: "Eliminate structurally flawed categories: Sectoral funds concentrate risk; Active Large Caps fail SPIVA index tests; Credit Risk funds carry asymmetric default danger; Regular plans leak 1-1.5% annually.",
    practicalRule: "Build portfolios strictly from 4 core categories: Flexi Cap, Mid Cap, Small Cap (for alpha), and Balanced Advantage / Arbitrage (for capital defense).",
    keyInsights: [
      "SPIVA empirical data proves >85% of actively managed Large Cap funds fail to beat the Nifty 50 TRI over 5-year horizons.",
      "Thematic funds are launched at sector market peaks when retail FOMO is highest, leading to multi-year capital lockups.",
      "Credit Risk funds offer only 100-150 bps extra yield in exchange for full bond default risk.",
      "Direct plans compound an extra 30-40% wealth over a 20-year horizon compared to distributor regular plans."
    ],
    formulas: [
      {
        name: "Expense Drag Compounding",
        formula: "Wealth_Direct / Wealth_Regular = (1 + r)^n / (1 + r - TER_drag)^n",
        description: "A 1.2% TER difference over 20 years forfeits roughly 30% of final terminal corpus."
      }
    ],
    interactiveComponent: "category-filter"
  },
  {
    id: "l06",
    lectureNumber: "L06",
    title: "3Y Rolling Returns over 10Y Horizon",
    subtitle: "Why Point-to-Point Trailing Returns Lie to Investors",
    category: "Quantitative Filters",
    commonAdvisorMistake: "Relying on 1-year, 3-year, or 5-year point-to-point trailing CAGR to judge fund consistency.",
    scientificSolution: "Compute daily rolling 3-year returns over a full 10-year market cycle. A fund must beat its benchmark category in >75% of all rolling windows with zero negative return observations.",
    practicalRule: "Never invest in a fund where the 3-year rolling return distribution had negative returns over a 10-year evaluation period.",
    keyInsights: [
      "Point-to-point trailing return is heavily distorted by the start date and the most recent market run.",
      "Rolling returns compute thousands of holding periods, capturing every bull, bear, and sideways market environment.",
      "Top-decile funds show consistent average rolling returns > 15% with benchmark outperformance percentage > 70%."
    ],
    formulas: [
      {
        name: "Rolling Return Calculation",
        formula: "Rolling_CAGR_{t, t+k} = (NAV_{t+k} / NAV_t)^(1/k) - 1",
        description: "Evaluated across daily increments across 10 years (2,400+ distinct investment windows)."
      }
    ],
    interactiveComponent: "quant-filter"
  },
  {
    id: "l07",
    lectureNumber: "L07",
    title: "Downside Deviation & The Sortino Ratio",
    subtitle: "Why the Sharpe Ratio Penalizes Bull Market Upside",
    category: "Quantitative Filters",
    commonAdvisorMistake: "Using standard deviation or the Sharpe ratio exclusively to measure fund risk.",
    scientificSolution: "The Sharpe ratio penalizes upside volatility (volatility to the north). The Sortino ratio isolates downside semi-deviation below the minimum acceptable return (MAR / risk-free rate).",
    practicalRule: "Require a Sortino Ratio > 1.50 for pure equity funds. A high Sortino proves the manager generates alpha without gut-wrenching drawdowns.",
    keyInsights: [
      "Investors only experience pain when their portfolio drops; upside volatility is beneficial wealth creation.",
      "Sortino divides excess return by Downside Deviation (semi-variance below the risk-free rate Rf).",
      "Funds with identical Sharpe ratios can have radically different drawdowns during market crashes."
    ],
    formulas: [
      {
        name: "Sortino Ratio",
        formula: "Sortino = (R_p - R_f) / Downside_Deviation = (R_p - R_f) / sqrt( (1/N) * sum( min(0, R_t - R_f)^2 ) )",
        description: "Downside deviation ignores returns that exceed the hurdle rate."
      }
    ],
    interactiveComponent: "quant-filter"
  },
  {
    id: "l08",
    lectureNumber: "L08",
    title: "Jensen's Alpha & Active Share",
    subtitle: "Separating Genuine Stock-Picking Skill from Cheap Market Beta",
    category: "Quantitative Filters",
    commonAdvisorMistake: "Assuming that a fund beating its benchmark by 3% has generated genuine manager skill.",
    scientificSolution: "Decompose total return using Jensen's Alpha: Alpha = Actual Return - [Rf + Beta * (Rm - Rf)]. If a fund has Beta of 1.4, its outperformance in a bull market is merely borrowed market risk, not alpha!",
    practicalRule: "Insist on Jensen's Alpha > +1.50% and Active Share > 65%. Never pay active management fees for closet index funds.",
    keyInsights: [
      "High beta funds surge in bull markets and collapse twice as hard in bear markets; this is not skill.",
      "Jensen's Alpha measures true risk-adjusted excess return over the Capital Asset Pricing Model (CAPM) benchmark.",
      "Active Share quantifies how much the fund's portfolio holdings differ from the benchmark index."
    ],
    formulas: [
      {
        name: "Jensen's Alpha",
        formula: "Alpha_p = R_p - [R_f + Beta_p * (R_m - R_f)]",
        description: "Positive alpha confirms returns generated above what market sensitivity alone predicts."
      }
    ],
    interactiveComponent: "quant-filter"
  },
  {
    id: "l09",
    lectureNumber: "L09",
    title: "Capture Ratios & Asymmetric Compounding Shield",
    subtitle: "The Mathematical Secret of Down-Capture < 75%",
    category: "Quantitative Filters",
    commonAdvisorMistake: "Focusing solely on bull market returns and ignoring how much capital the fund loses during market downturns.",
    scientificSolution: "The Asymmetry Law: A 50% loss requires a 100% gain just to break even! A fund with 90% Up-Capture and 60% Down-Capture will dramatically outperform a fund with 120% Up-Capture and 110% Down-Capture over a full cycle.",
    practicalRule: "Filter for Up-Capture > 80% and Down-Capture < 75%. The Downside Capture ratio is the single greatest predictor of long-term compounding success.",
    keyInsights: [
      "Geometric compounding penalizes drawdowns exponentially: -20% requires +25%, -33% requires +50%, -50% requires +100%.",
      "Preserving capital during bear phases allows compounding to start from a higher base in the subsequent bull run.",
      "Funds like Parag Parikh Flexi Cap achieved legendary 10-year track records primarily through superior Down-Capture defense."
    ],
    formulas: [
      {
        name: "Capture Ratio Formula",
        formula: "Capture_Spread = Up_Capture_Ratio - Down_Capture_Ratio (Target > +15 points)",
        description: "Positive capture spread guarantees asymmetric upside participation with truncated downside."
      }
    ],
    interactiveComponent: "quant-filter"
  },
  {
    id: "l10",
    lectureNumber: "L10",
    title: "Institutional Due Diligence & Style Drift Case Study",
    subtitle: "Why Yesterday's Superstar (Axis Bluechip) Collapsed vs Nippon Large Cap",
    category: "Portfolio Due Diligence",
    commonAdvisorMistake: "Holding onto past winners when AUM bloat and fund manager strategy drift ruin portfolio efficacy.",
    scientificSolution: "Conduct continuous forensic due diligence: Track AUM size vs category liquidity, monitor Lead Manager tenure, inspect portfolio turnover, and verify valuation style alignment.",
    practicalRule: "The Axis Bluechip Case Study: In 2017-2020, Axis Bluechip won by holding ultra-growth high P/E quality stocks. In 2021-2024, as inflation rose and valuation mean-reverted, it severely underperformed Nippon Large Cap which held value/banks at fair P/B.",
    keyInsights: [
      "AUM Bloat: In Mid/Small caps, once AUM exceeds Rs 25,000 Cr, the manager is forced to buy large caps or dilute into 100+ stocks.",
      "Manager Departure: When a lead manager with >7 years tenure departs, place the fund on an immediate 6-month probation watchlist.",
      "Turnover Drag: Portfolio turnover > 60% in a flexi-cap indicates loss of conviction and high trading cost friction."
    ],
    formulas: [
      {
        name: "Liquidity Absorption Threshold",
        formula: "Days_to_Liquidate_50pct = (0.50 * Portfolio_AUM) / (Average_Daily_Turnover * 0.20)",
        description: "Exceeding 20 days indicates structural liquidity risk during redemption panics."
      }
    ],
    interactiveComponent: "portfolio-valuation"
  },
  {
    id: "l11",
    lectureNumber: "L11",
    title: "Portfolio Synthesis, Rebalancing Bands & Execution Cadence",
    subtitle: "Putting It All Together: Constructing Your 4-Fund All-Weather Matrix",
    category: "Goal Planning",
    commonAdvisorMistake: "Holding 15-20 mutual funds across overlapping categories, creating an expensive closet index.",
    scientificSolution: "Construct an all-weather portfolio of only 4-5 non-overlapping funds. Use a strict rebalancing band (+/- 5%) and annual calendar review.",
    practicalRule: "Max 5 funds: 1 Flexi Cap Core (35-40%), 1 Large/Value Anchor (15-20%), 1 Mid Cap Alpha Engine (15-20%), and 1 Balanced Advantage / Arbitrage Safety Cushion (20-30%).",
    keyInsights: [
      "Holding more than 5 funds creates 150+ underlying stock overlaps, resulting in Nifty 50 returns with active fund fees.",
      "Rebalancing is mathematically proven to generate 1.5-2.0% excess return by harvesting market volatility.",
      "Review portfolios once a year; avoid looking at daily NAVs to prevent emotional behavioral destruction."
    ],
    formulas: [
      {
        name: "Optimal Rebalancing Band",
        formula: "Trigger = abs(Current_Asset_Weight - Target_Asset_Weight) >= 5.0%",
        description: "Rebalance only when drift exceeds 5% or at the annual 12-month review date."
      }
    ],
    interactiveComponent: "asset-allocator"
  }
];
