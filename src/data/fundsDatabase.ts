import { Fund } from '../types';

export const mutualFundsDatabase: Fund[] = [
  {
    "id": "ppfc-01",
    "name": "Parag Parikh Flexi Cap Fund - Direct Growth",
    "shortName": "Parag Parikh Flexi Cap",
    "fundHouse": "PPFAS Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 84.62,
    "aumCr": 68450,
    "expenseRatio": 0.62,
    "inceptionYear": 2013,
    "fundManager": "Rajeev Thakkar",
    "fundManagerTenureYears": 11,
    "portfolioTurnover": 0.18,
    "cashHoldingPct": 14.2,
    "benchmark": "NIFTY 500 TRI",
    "style": "Value",
    "portfolioPE": 21.8,
    "portfolioPB": 3.4,
    "marketCapBreakdown": {
      "largeCap": 68,
      "midCap": 16,
      "smallCap": 2,
      "cashDebt": 14,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 24.2,
      "pb": 2.8,
      "evEbitda": 11.4,
      "priceToSales": 2.3,
      "dividendYield": 1.8
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 19.84,
      "threeYearRollingMin": 8.21,
      "threeYearRollingMax": 32.4,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 88.4,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 48,
          "count": 864
        },
        {
          "label": "15% - 20%",
          "percentage": 32,
          "count": 576
        },
        {
          "label": "10% - 15%",
          "percentage": 16,
          "count": 288
        },
        {
          "label": "0% - 10%",
          "percentage": 4,
          "count": 72
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 12.4,
      "beta": 0.72,
      "sharpeRatio": 1.28,
      "treynorRatio": 18.2,
      "jensensAlpha": 4.82,
      "sortinoRatio": 1.94,
      "benchmarkSortino": 1.21,
      "informationRatio": 0.88,
      "rSquared": 0.78,
      "upCaptureRatio": 88.5,
      "downCaptureRatio": 54.2
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "Elite Tier-1 active compounding vehicle. Unmatched downside preservation (54.2% down-capture) with high active alpha.",
      "hurdleDeltas": {
        "rollingDelta": 5.22,
        "sortinoDelta": 0.44,
        "alphaDelta": 3.32,
        "upCaptureDelta": 8.5,
        "downCaptureDelta": 20.8
      }
    },
    "topHoldings": [
      {
        "name": "HDFC Bank Ltd",
        "ticker": "HDFCBANK",
        "sector": "Financials",
        "weight": 7.8,
        "valuationMetric": "PB",
        "metricValue": 2.7,
        "marketPrice": 1680,
        "rationale": "Private banking moat trading below 10Y median P/B",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "ITC Ltd",
        "ticker": "ITC",
        "sector": "FMCG",
        "weight": 6.4,
        "valuationMetric": "PE",
        "metricValue": 24.5,
        "marketPrice": 465,
        "rationale": "Pricing power and high cash dividend yield buffer",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Bajaj Holdings & Inv",
        "ticker": "BAJAJHLDNG",
        "sector": "Financials",
        "weight": 6.1,
        "valuationMetric": "PB",
        "metricValue": 1.6,
        "marketPrice": 8900,
        "rationale": "Holding co discount with high underlying earnings growth",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Power Grid Corp",
        "ticker": "POWERGRID",
        "sector": "Utilities",
        "weight": 5.2,
        "valuationMetric": "EV/EBITDA",
        "metricValue": 9.8,
        "marketPrice": 320,
        "rationale": "Regulated return-on-equity asset base insulating from recession",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Alphabet Inc (Google)",
        "ticker": "GOOGL",
        "sector": "Global Tech",
        "weight": 4.8,
        "valuationMetric": "PE",
        "metricValue": 22.1,
        "marketPrice": 175,
        "rationale": "Monopolistic search moat + cloud growth",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "ICICI Bank Ltd",
        "ticker": "ICICIBANK",
        "sector": "Financials",
        "weight": 4.6,
        "valuationMetric": "PB",
        "metricValue": 2.9,
        "marketPrice": 1240,
        "rationale": "High return on assets and disciplined underwriting",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Coal India Ltd",
        "ticker": "COALINDIA",
        "sector": "Energy",
        "weight": 4.1,
        "valuationMetric": "PE",
        "metricValue": 8.4,
        "marketPrice": 485,
        "rationale": "High free cash flow and dividend yield play",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Persistent Systems",
        "ticker": "PERSISTENT",
        "sector": "Technology",
        "weight": 3.8,
        "valuationMetric": "PE",
        "metricValue": 42,
        "marketPrice": 4850,
        "rationale": "Fast growing digital engineering mid-cap compounder",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Coforge Ltd",
        "ticker": "COFORGE",
        "sector": "Technology",
        "weight": 3.4,
        "valuationMetric": "PE",
        "metricValue": 36.2,
        "marketPrice": 6400,
        "rationale": "Strong mid-cap order book execution",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Central Depository (CDSL)",
        "ticker": "CDSL",
        "sector": "Capital Markets",
        "weight": 2.8,
        "valuationMetric": "PE",
        "metricValue": 48,
        "marketPrice": 1520,
        "rationale": "Beneficiary of India retail equity financialization",
        "marketCapTier": "Mid Cap"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 26.4,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      },
      {
        "sector": "FMCG",
        "weight": 14.8,
        "valuationMetric": "PE",
        "macroSensitivity": "Defensive"
      },
      {
        "sector": "Global Tech",
        "weight": 12.5,
        "valuationMetric": "PE",
        "macroSensitivity": "Export/USD-Beneficiary"
      },
      {
        "sector": "Utilities",
        "weight": 8.2,
        "valuationMetric": "EV/EBITDA",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 9.2,
        "comment": "Essential core anchor. Allocates safely across large caps while preserving active flexibility.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9.8,
        "comment": "The ideal foundational fund. Low beta (0.72) and low down-capture make it top choice.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 9,
        "comment": "High cash buffer (14%) and value discipline protect capital against crashes.",
        "stance": "Overweight"
      },
      "macro": {
        "score": 9.1,
        "comment": "Foreign equity exposure hedges domestic currency depreciation.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.6,
        "comment": "Zero stylistic drift, low 18% turnover, veteran fund manager tenure.",
        "stance": "Approved"
      }
    },
    "managerProfile": {
      "name": "Rajeev Thakkar",
      "age": 52,
      "education": "Chartered Accountant (CA), CFA Charterholder, Grad ICWA",
      "totalExperienceYears": 24,
      "tenureAtSchemeYears": 11,
      "philosophy": "Value-conscious compounding, unconstrained market-cap flexibility, global diversification, and holding high cash during bubble valuations.",
      "otherFundsManaged": [
        {
          "name": "Parag Parikh Tax Saver Fund",
          "category": "ELSS",
          "aumCr": 4200,
          "threeYearCagr": 21.4
        },
        {
          "name": "Parag Parikh Dynamic Asset Allocation",
          "category": "Hybrid",
          "aumCr": 2100,
          "threeYearCagr": 14.2
        },
        {
          "name": "Parag Parikh Liquid Fund",
          "category": "Liquid",
          "aumCr": 1850,
          "threeYearCagr": 6.9
        }
      ],
      "careerMilestones": [
        "Steered PPFAS Mutual Fund since inception in 2013 with lowest down-capture in Indian mutual fund history.",
        "Pioneered holding foreign tech giants (Alphabet, Microsoft, Meta) to protect Indian investors from INR depreciation.",
        "Successfully held >15% cash during 2021 market peak, deployable during the 2022 correction."
      ]
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 3.46,
        "benchmarkReturn": 1.26,
        "alpha": 2.2
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.82,
        "benchmarkReturn": 1.72,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 3.48,
        "benchmarkReturn": 2.38,
        "alpha": 1.1
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.91,
        "benchmarkReturn": -0.29,
        "alpha": 2.2
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 1.29,
        "benchmarkReturn": 0.19,
        "alpha": 1.1
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -0.94,
        "benchmarkReturn": -2.04,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 4.19,
        "benchmarkReturn": 1.99,
        "alpha": 2.2
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 2.34,
        "benchmarkReturn": 1.24,
        "alpha": 1.1
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": 0.32,
        "benchmarkReturn": -0.78,
        "alpha": 1.1
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.97,
        "benchmarkReturn": 2.77,
        "alpha": 2.2
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 2.75,
        "benchmarkReturn": 1.65,
        "alpha": 1.1
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.58,
        "benchmarkReturn": 2.48,
        "alpha": 1.1
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 3.2,
        "benchmarkReturn": 1,
        "alpha": 2.2
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 2.75,
        "benchmarkReturn": 1.65,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.9,
        "benchmarkReturn": 1.8,
        "alpha": 1.1
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.69,
        "benchmarkReturn": -0.51,
        "alpha": 2.2
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 2.02,
        "benchmarkReturn": 0.92,
        "alpha": 1.1
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 2.41,
        "benchmarkReturn": 1.31,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 3.71,
        "benchmarkReturn": 1.51,
        "alpha": 2.2
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 2.27,
        "benchmarkReturn": 1.17,
        "alpha": 1.1
      }
    ]
  },
  {
    "id": "hdfc-fc-02",
    "name": "HDFC Flexi Cap Fund - Direct Growth",
    "shortName": "HDFC Flexi Cap",
    "fundHouse": "HDFC Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 1720.5,
    "aumCr": 58200,
    "expenseRatio": 0.78,
    "inceptionYear": 1995,
    "fundManager": "Roshi Jain",
    "fundManagerTenureYears": 4,
    "portfolioTurnover": 0.35,
    "cashHoldingPct": 6.8,
    "benchmark": "NIFTY 500 TRI",
    "style": "Blend",
    "portfolioPE": 22.4,
    "portfolioPB": 3.8,
    "marketCapBreakdown": {
      "largeCap": 72,
      "midCap": 20,
      "smallCap": 2,
      "cashDebt": 6,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 23.1,
      "pb": 3.1,
      "evEbitda": 12,
      "priceToSales": 2.6,
      "dividendYield": 1.4
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 18.9,
      "threeYearRollingMin": 6.8,
      "threeYearRollingMax": 34.1,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 84.2,
      "percentPositiveReturns": 99.1,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 44,
          "count": 792
        },
        {
          "label": "15% - 20%",
          "percentage": 34,
          "count": 612
        },
        {
          "label": "10% - 15%",
          "percentage": 16,
          "count": 288
        },
        {
          "label": "0% - 10%",
          "percentage": 6,
          "count": 108
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 13.8,
      "beta": 0.88,
      "sharpeRatio": 1.15,
      "treynorRatio": 16.5,
      "jensensAlpha": 3.4,
      "sortinoRatio": 1.72,
      "benchmarkSortino": 1.21,
      "informationRatio": 0.74,
      "rSquared": 0.89,
      "upCaptureRatio": 94.2,
      "downCaptureRatio": 68.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "High-conviction value-blend compounding with strong banking and manufacturing beta.",
      "hurdleDeltas": {
        "rollingDelta": 4.28,
        "sortinoDelta": 0.22,
        "alphaDelta": 1.9,
        "upCaptureDelta": 14.2,
        "downCaptureDelta": 6.5
      }
    },
    "topHoldings": [
      {
        "name": "ICICI Bank Ltd",
        "ticker": "ICICIBANK",
        "sector": "Financials",
        "weight": 8.5,
        "valuationMetric": "PB",
        "metricValue": 2.9,
        "marketPrice": 1240,
        "rationale": "Industry-leading ROA and credit underwriting"
      },
      {
        "name": "Infosys Ltd",
        "ticker": "INFY",
        "sector": "Technology",
        "weight": 6.2,
        "valuationMetric": "PE",
        "metricValue": 26,
        "marketPrice": 1850,
        "rationale": "High free cash flow conversion"
      },
      {
        "name": "Larsen & Toubro",
        "ticker": "LT",
        "sector": "Cap Goods",
        "weight": 5.8,
        "valuationMetric": "PE",
        "metricValue": 31.2,
        "marketPrice": 3550,
        "rationale": "Direct infrastructure and capex proxy"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 32.1,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      },
      {
        "sector": "Cap Goods",
        "weight": 14.2,
        "valuationMetric": "PE",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.8,
        "comment": "Great domestic economic recovery play.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9,
        "comment": "Consistent performer with Roshi Jain at the helm.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 8.2,
        "comment": "Slightly higher beta than PPFAS but solid down-capture.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 9,
        "comment": "High capex and banking weights align with India cycle.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 8.9,
        "comment": "Large AUM managed well via liquid large-cap tilt.",
        "stance": "Approved"
      }
    },
    "managerProfile": {
      "name": "Roshi Jain",
      "age": 46,
      "education": "Chartered Accountant (CA - All India Rank 2), IIM Ahmedabad MBA, CFA",
      "totalExperienceYears": 19,
      "tenureAtSchemeYears": 4,
      "philosophy": "High-conviction, bottom-up value & cyclical recovery investing with strong focus on cash-flow generating balance sheets.",
      "otherFundsManaged": [
        {
          "name": "HDFC Focused 30 Fund",
          "category": "Focused",
          "aumCr": 14200,
          "threeYearCagr": 24.8
        },
        {
          "name": "HDFC Large & Mid Cap Fund",
          "category": "Large & Mid",
          "aumCr": 19500,
          "threeYearCagr": 22.1
        }
      ],
      "careerMilestones": [
        "Previously Senior VP at Franklin Templeton managing flagship India equity funds for over 15 years.",
        "Engineered top-quartile turnaround of HDFC Flexi Cap since taking charge in 2021.",
        "Overweight positioning in PSU banking and engineering capex drove substantial alpha."
      ]
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 3.16,
        "benchmarkReturn": 1.26,
        "alpha": 1.9
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.52,
        "benchmarkReturn": 1.72,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 3.18,
        "benchmarkReturn": 2.38,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.61,
        "benchmarkReturn": -0.29,
        "alpha": 1.9
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 0.99,
        "benchmarkReturn": 0.19,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.24,
        "benchmarkReturn": -2.04,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.89,
        "benchmarkReturn": 1.99,
        "alpha": 1.9
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 2.04,
        "benchmarkReturn": 1.24,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": 0.02,
        "benchmarkReturn": -0.78,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.67,
        "benchmarkReturn": 2.77,
        "alpha": 1.9
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 2.45,
        "benchmarkReturn": 1.65,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.28,
        "benchmarkReturn": 2.48,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.9,
        "benchmarkReturn": 1,
        "alpha": 1.9
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 2.45,
        "benchmarkReturn": 1.65,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.6,
        "benchmarkReturn": 1.8,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.39,
        "benchmarkReturn": -0.51,
        "alpha": 1.9
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 1.72,
        "benchmarkReturn": 0.92,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 2.11,
        "benchmarkReturn": 1.31,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 3.41,
        "benchmarkReturn": 1.51,
        "alpha": 1.9
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.97,
        "benchmarkReturn": 1.17,
        "alpha": 0.8
      }
    ]
  },
  {
    "id": "jm-fc-03",
    "name": "JM Flexicap Fund - Direct Growth",
    "shortName": "JM Flexicap",
    "fundHouse": "JM Financial Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 114.2,
    "aumCr": 4200,
    "expenseRatio": 0.48,
    "inceptionYear": 2008,
    "fundManager": "Satish Ramanathan",
    "fundManagerTenureYears": 4,
    "portfolioTurnover": 0.85,
    "cashHoldingPct": 4.5,
    "benchmark": "NIFTY 500 TRI",
    "style": "Growth",
    "portfolioPE": 26.8,
    "portfolioPB": 4.8,
    "marketCapBreakdown": {
      "largeCap": 52,
      "midCap": 32,
      "smallCap": 12,
      "cashDebt": 4,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 28.5,
      "pb": 4.2,
      "evEbitda": 14.5,
      "priceToSales": 3.1,
      "dividendYield": 0.8
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 22.4,
      "threeYearRollingMin": 7.1,
      "threeYearRollingMax": 38.5,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 91,
      "percentPositiveReturns": 99.5,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 56,
          "count": 1008
        },
        {
          "label": "15% - 20%",
          "percentage": 28,
          "count": 504
        },
        {
          "label": "10% - 15%",
          "percentage": 12,
          "count": 216
        },
        {
          "label": "0% - 10%",
          "percentage": 4,
          "count": 72
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 14.8,
      "beta": 0.94,
      "sharpeRatio": 1.34,
      "treynorRatio": 19.8,
      "jensensAlpha": 5.6,
      "sortinoRatio": 1.88,
      "benchmarkSortino": 1.21,
      "informationRatio": 0.92,
      "rSquared": 0.82,
      "upCaptureRatio": 108.5,
      "downCaptureRatio": 71.2
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "High-alpha growth momentum generator with agile mid-cap tilts.",
      "hurdleDeltas": {
        "rollingDelta": 7.78,
        "sortinoDelta": 0.38,
        "alphaDelta": 4.1,
        "upCaptureDelta": 28.5,
        "downCaptureDelta": 3.8
      }
    },
    "topHoldings": [
      {
        "name": "Larsen & Toubro",
        "ticker": "LT",
        "sector": "Cap Goods",
        "weight": 6.8,
        "valuationMetric": "PE",
        "metricValue": 31.2,
        "marketPrice": 3550,
        "rationale": "Capex expansion"
      },
      {
        "name": "State Bank of India",
        "ticker": "SBIN",
        "sector": "Financials",
        "weight": 5.4,
        "valuationMetric": "PB",
        "metricValue": 1.4,
        "marketPrice": 820,
        "rationale": "PSU credit cycle"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 28.5,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 9.4,
        "comment": "Tremendous alpha engine in mid-market cap range.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 8.6,
        "comment": "Aggressive portfolio but passes down-capture.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 7.5,
        "comment": "Higher standard deviation than conservative threshold.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 8.8,
        "comment": "Dynamic rotation between manufacturing and financial sectors.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 8.5,
        "comment": "Turnover is elevated (85%) but alpha generation validates execution.",
        "stance": "Approved"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 3.16,
        "benchmarkReturn": 1.36,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.55,
        "benchmarkReturn": 1.85,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 3.26,
        "benchmarkReturn": 2.56,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.49,
        "benchmarkReturn": -0.31,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 0.91,
        "benchmarkReturn": 0.21,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.49,
        "benchmarkReturn": -2.19,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.94,
        "benchmarkReturn": 2.14,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 2.03,
        "benchmarkReturn": 1.33,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -0.14,
        "benchmarkReturn": -0.84,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.78,
        "benchmarkReturn": 2.98,
        "alpha": 1.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 2.48,
        "benchmarkReturn": 1.78,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.36,
        "benchmarkReturn": 2.66,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.87,
        "benchmarkReturn": 1.07,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 2.48,
        "benchmarkReturn": 1.78,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.63,
        "benchmarkReturn": 1.93,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.25,
        "benchmarkReturn": -0.55,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 1.69,
        "benchmarkReturn": 0.99,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 2.11,
        "benchmarkReturn": 1.41,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 3.42,
        "benchmarkReturn": 1.62,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.95,
        "benchmarkReturn": 1.25,
        "alpha": 0.7
      }
    ],
    "managerProfile": {
      "name": "Satish Ramanathan",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 4,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "JM Financial Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "JM Financial Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing JM Flexicap for 4 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "uti-fc-04",
    "name": "UTI Flexi Cap Fund - Direct Growth",
    "shortName": "UTI Flexi Cap",
    "fundHouse": "UTI Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 295.4,
    "aumCr": 24500,
    "expenseRatio": 0.94,
    "inceptionYear": 2005,
    "fundManager": "Ajay Tyagi",
    "fundManagerTenureYears": 8,
    "portfolioTurnover": 0.12,
    "cashHoldingPct": 3.2,
    "benchmark": "NIFTY 500 TRI",
    "style": "Growth",
    "portfolioPE": 34.2,
    "portfolioPB": 6.2,
    "marketCapBreakdown": {
      "largeCap": 70,
      "midCap": 24,
      "smallCap": 3,
      "cashDebt": 3,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 36.4,
      "pb": 5.8,
      "evEbitda": 18.2,
      "priceToSales": 4.2,
      "dividendYield": 0.6
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 14.8,
      "threeYearRollingMin": 3.2,
      "threeYearRollingMax": 29.5,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 54,
      "percentPositiveReturns": 94,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 24,
          "count": 432
        },
        {
          "label": "15% - 20%",
          "percentage": 30,
          "count": 540
        },
        {
          "label": "10% - 15%",
          "percentage": 28,
          "count": 504
        },
        {
          "label": "0% - 10%",
          "percentage": 14,
          "count": 252
        },
        {
          "label": "< 0%",
          "percentage": 4,
          "count": 72
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 13.9,
      "beta": 0.91,
      "sharpeRatio": 0.82,
      "treynorRatio": 11.2,
      "jensensAlpha": 0.85,
      "sortinoRatio": 1.32,
      "benchmarkSortino": 1.21,
      "informationRatio": 0.12,
      "rSquared": 0.86,
      "upCaptureRatio": 84,
      "downCaptureRatio": 78.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 2,
      "verdict": "WATCHLIST",
      "summary": "High quality growth focus, but hampered by expensive quality stock valuations, causing 3Y rolling return compression and down-capture breach.",
      "hurdleDeltas": {
        "rollingDelta": 0.18,
        "sortinoDelta": -0.18,
        "alphaDelta": -0.65,
        "upCaptureDelta": 4,
        "downCaptureDelta": -3.5,
        "primaryFailureHurdle": "Alpha & Down-Capture Failed",
        "rejectionReason": "Jensen's Alpha (+0.85%) failed >1.5% target; Down-Capture (78.5%) breached <75% ceiling."
      }
    },
    "topHoldings": [
      {
        "name": "LTI Mindtree",
        "ticker": "LTIM",
        "sector": "Technology",
        "weight": 6.1,
        "valuationMetric": "PE",
        "metricValue": 34,
        "marketPrice": 5200,
        "rationale": "Premium IT quality"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Technology",
        "weight": 22,
        "valuationMetric": "PE",
        "macroSensitivity": "Export/USD-Beneficiary"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 6.8,
        "comment": "Valuations are elevated, reducing forward alpha headroom.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 7.2,
        "comment": "High quality franchise but underperforming benchmark recently.",
        "stance": "Neutral"
      },
      "conservative": {
        "score": 7.4,
        "comment": "Low turnover, high ROE portfolio.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 7,
        "comment": "Quality growth factor is currently lagging capex-led value cyclicals.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 7.8,
        "comment": "Disciplined tenure but expensive portfolio PE (34.2).",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.16,
        "benchmarkReturn": 1.36,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 1.55,
        "benchmarkReturn": 1.85,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.26,
        "benchmarkReturn": 2.56,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.49,
        "benchmarkReturn": -0.31,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.09,
        "benchmarkReturn": 0.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -2.49,
        "benchmarkReturn": -2.19,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.94,
        "benchmarkReturn": 2.14,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.03,
        "benchmarkReturn": 1.33,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.14,
        "benchmarkReturn": -0.84,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.78,
        "benchmarkReturn": 2.98,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.48,
        "benchmarkReturn": 1.78,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 2.36,
        "benchmarkReturn": 2.66,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 1.87,
        "benchmarkReturn": 1.07,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.48,
        "benchmarkReturn": 1.78,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 1.63,
        "benchmarkReturn": 1.93,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.25,
        "benchmarkReturn": -0.55,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.69,
        "benchmarkReturn": 0.99,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.11,
        "benchmarkReturn": 1.41,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.42,
        "benchmarkReturn": 1.62,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.95,
        "benchmarkReturn": 1.25,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Ajay Tyagi",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 16,
      "tenureAtSchemeYears": 8,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "UTI Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "UTI Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing UTI Flexi Cap for 8 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "quant-fc-05",
    "name": "Quant Flexi Cap Fund - Direct Growth",
    "shortName": "Quant Flexi Cap",
    "fundHouse": "Quant Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 98.6,
    "aumCr": 6100,
    "expenseRatio": 0.65,
    "inceptionYear": 2018,
    "fundManager": "Sandeep Tandon",
    "fundManagerTenureYears": 6,
    "portfolioTurnover": 1.95,
    "cashHoldingPct": 8.2,
    "benchmark": "NIFTY 500 TRI",
    "style": "Growth",
    "portfolioPE": 25.1,
    "portfolioPB": 4.5,
    "marketCapBreakdown": {
      "largeCap": 58,
      "midCap": 26,
      "smallCap": 8,
      "cashDebt": 8,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 26.2,
      "pb": 4.1,
      "evEbitda": 13.8,
      "priceToSales": 2.8,
      "dividendYield": 1
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 23.8,
      "threeYearRollingMin": 4.5,
      "threeYearRollingMax": 44,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 88,
      "percentPositiveReturns": 96,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 60,
          "count": 1080
        },
        {
          "label": "15% - 20%",
          "percentage": 22,
          "count": 396
        },
        {
          "label": "10% - 15%",
          "percentage": 10,
          "count": 180
        },
        {
          "label": "0% - 10%",
          "percentage": 5,
          "count": 90
        },
        {
          "label": "< 0%",
          "percentage": 3,
          "count": 54
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 17.5,
      "beta": 1.15,
      "sharpeRatio": 1.18,
      "treynorRatio": 18,
      "jensensAlpha": 5.1,
      "sortinoRatio": 1.54,
      "benchmarkSortino": 1.21,
      "informationRatio": 0.72,
      "rSquared": 0.74,
      "upCaptureRatio": 124,
      "downCaptureRatio": 88.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 4,
      "verdict": "WATCHLIST",
      "summary": "Massive bull-market alpha (124% up-capture), but failed Down-Market Capture hurdle (88.5% vs <75%), resulting in elevated crash drawdowns.",
      "hurdleDeltas": {
        "rollingDelta": 9.18,
        "sortinoDelta": 0.04,
        "alphaDelta": 3.6,
        "upCaptureDelta": 44,
        "downCaptureDelta": -13.5,
        "primaryFailureHurdle": "Down-Capture Breached",
        "rejectionReason": "Failed Step 5: Down-Capture (88.5%) breached 75% limit by +13.5%; portfolio turnover 195% creates transaction friction."
      }
    },
    "topHoldings": [
      {
        "name": "Reliance Industries",
        "ticker": "RELIANCE",
        "sector": "Energy",
        "weight": 9.2,
        "valuationMetric": "PE",
        "metricValue": 24.5,
        "marketPrice": 3020,
        "rationale": "Momentum breakout"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Energy",
        "weight": 24,
        "valuationMetric": "PE",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 9,
        "comment": "High octance momentum vehicle.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 7,
        "comment": "High beta (1.15) and 88.5% down-capture violate capital safety principles.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 5.5,
        "comment": "Extremely volatile during sharp drawdowns.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 8.5,
        "comment": "Dynamic VLRT framework catches tactical sector surges.",
        "stance": "Neutral"
      },
      "dueDiligence": {
        "score": 6.8,
        "comment": "Extreme turnover (195%) and SEBI front-running regulatory queries require caution.",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.16,
        "benchmarkReturn": 1.36,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 1.55,
        "benchmarkReturn": 1.85,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.26,
        "benchmarkReturn": 2.56,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.49,
        "benchmarkReturn": -0.31,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.09,
        "benchmarkReturn": 0.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -2.49,
        "benchmarkReturn": -2.19,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.94,
        "benchmarkReturn": 2.14,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.03,
        "benchmarkReturn": 1.33,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.14,
        "benchmarkReturn": -0.84,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.78,
        "benchmarkReturn": 2.98,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.48,
        "benchmarkReturn": 1.78,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 2.36,
        "benchmarkReturn": 2.66,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 1.87,
        "benchmarkReturn": 1.07,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.48,
        "benchmarkReturn": 1.78,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 1.63,
        "benchmarkReturn": 1.93,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.25,
        "benchmarkReturn": -0.55,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.69,
        "benchmarkReturn": 0.99,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.11,
        "benchmarkReturn": 1.41,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.42,
        "benchmarkReturn": 1.62,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.95,
        "benchmarkReturn": 1.25,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Sandeep Tandon",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 6,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Quant Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Quant Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Quant Flexi Cap for 6 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "axis-fc-06",
    "name": "Axis Flexi Cap Fund - Direct Growth",
    "shortName": "Axis Flexi Cap",
    "fundHouse": "Axis Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 26.4,
    "aumCr": 11800,
    "expenseRatio": 0.88,
    "inceptionYear": 2017,
    "fundManager": "Shreyash Devalkar",
    "fundManagerTenureYears": 3,
    "portfolioTurnover": 0.42,
    "cashHoldingPct": 5.1,
    "benchmark": "NIFTY 500 TRI",
    "style": "Growth",
    "portfolioPE": 38.5,
    "portfolioPB": 6.8,
    "marketCapBreakdown": {
      "largeCap": 74,
      "midCap": 20,
      "smallCap": 1,
      "cashDebt": 5,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 39.1,
      "pb": 6.4,
      "evEbitda": 21,
      "priceToSales": 4.8,
      "dividendYield": 0.5
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 11.2,
      "threeYearRollingMin": -2.1,
      "threeYearRollingMax": 26.4,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 28,
      "percentPositiveReturns": 84,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 12,
          "count": 216
        },
        {
          "label": "15% - 20%",
          "percentage": 22,
          "count": 396
        },
        {
          "label": "10% - 15%",
          "percentage": 34,
          "count": 612
        },
        {
          "label": "0% - 10%",
          "percentage": 24,
          "count": 432
        },
        {
          "label": "< 0%",
          "percentage": 8,
          "count": 144
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 14.2,
      "beta": 0.95,
      "sharpeRatio": 0.54,
      "treynorRatio": 7.2,
      "jensensAlpha": -1.82,
      "sortinoRatio": 0.98,
      "benchmarkSortino": 1.21,
      "informationRatio": -0.65,
      "rSquared": 0.88,
      "upCaptureRatio": 76,
      "downCaptureRatio": 92.4
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": false,
      "downCapturePassed": false,
      "totalScore": 0,
      "verdict": "REJECT",
      "summary": "Severe institutional underperformance across all 5 hurdles. Negative alpha (-1.82%), poor Sortino (0.98), and 92.4% down-capture.",
      "hurdleDeltas": {
        "rollingDelta": -3.42,
        "sortinoDelta": -0.52,
        "alphaDelta": -3.32,
        "upCaptureDelta": -4,
        "downCaptureDelta": -17.4,
        "primaryFailureHurdle": "Failed All 5 Hurdle Steps",
        "rejectionReason": "Rolling return lagged benchmark by -3.42%; negative Jensen Alpha (-1.82%); Down-Capture (92.4%) severely breached shield."
      }
    },
    "topHoldings": [
      {
        "name": "Bajaj Finance",
        "ticker": "BAJFINANCE",
        "sector": "Financials",
        "weight": 7.5,
        "valuationMetric": "PB",
        "metricValue": 5.4,
        "marketPrice": 7100,
        "rationale": "Expensive consumer NBFC"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 34,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 4,
        "comment": "Destroys wealth relative to benchmark. Immediate avoidance.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 4.2,
        "comment": "Fails basic risk-adjusted hurdles.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 4.5,
        "comment": "Falls harder than index on market declines.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 4.8,
        "comment": "Stuck in high-PE growth stocks that derated during inflation spikes.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 3.8,
        "comment": "Negative alpha for 3 consecutive rolling cycles. Severe red flag.",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 0.96,
        "benchmarkReturn": 1.36,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.35,
        "benchmarkReturn": 1.85,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.06,
        "benchmarkReturn": 2.56,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.71,
        "benchmarkReturn": -0.31,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.29,
        "benchmarkReturn": 0.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.69,
        "benchmarkReturn": -2.19,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.74,
        "benchmarkReturn": 2.14,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": -0.17,
        "benchmarkReturn": 1.33,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.34,
        "benchmarkReturn": -0.84,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.58,
        "benchmarkReturn": 2.98,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.28,
        "benchmarkReturn": 1.78,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.16,
        "benchmarkReturn": 2.66,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.67,
        "benchmarkReturn": 1.07,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.28,
        "benchmarkReturn": 1.78,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.43,
        "benchmarkReturn": 1.93,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -0.95,
        "benchmarkReturn": -0.55,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.51,
        "benchmarkReturn": 0.99,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": -0.09,
        "benchmarkReturn": 1.41,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.22,
        "benchmarkReturn": 1.62,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": -0.25,
        "benchmarkReturn": 1.25,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Shreyash Devalkar",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 3,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Axis Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Axis Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Axis Flexi Cap for 3 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "sbi-fc-07",
    "name": "SBI Flexicap Fund - Direct Growth",
    "shortName": "SBI Flexicap",
    "fundHouse": "SBI Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 104.5,
    "aumCr": 21500,
    "expenseRatio": 0.84,
    "inceptionYear": 2005,
    "fundManager": "Rama Iyer Srinivasan",
    "fundManagerTenureYears": 2,
    "portfolioTurnover": 0.38,
    "cashHoldingPct": 4.8,
    "benchmark": "NIFTY 500 TRI",
    "style": "Blend",
    "portfolioPE": 24.5,
    "portfolioPB": 4.1,
    "marketCapBreakdown": {
      "largeCap": 65,
      "midCap": 25,
      "smallCap": 5,
      "cashDebt": 5,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 25.4,
      "pb": 3.8,
      "evEbitda": 13.2,
      "priceToSales": 2.7,
      "dividendYield": 1.1
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 13.4,
      "threeYearRollingMin": 1.4,
      "threeYearRollingMax": 28,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 42,
      "percentPositiveReturns": 91,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 18,
          "count": 324
        },
        {
          "label": "15% - 20%",
          "percentage": 26,
          "count": 468
        },
        {
          "label": "10% - 15%",
          "percentage": 32,
          "count": 576
        },
        {
          "label": "0% - 10%",
          "percentage": 20,
          "count": 360
        },
        {
          "label": "< 0%",
          "percentage": 4,
          "count": 72
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 14.6,
      "beta": 0.98,
      "sharpeRatio": 0.71,
      "treynorRatio": 9.8,
      "jensensAlpha": -0.45,
      "sortinoRatio": 1.14,
      "benchmarkSortino": 1.21,
      "informationRatio": -0.24,
      "rSquared": 0.91,
      "upCaptureRatio": 88,
      "downCaptureRatio": 94.5
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 1,
      "verdict": "REJECT",
      "summary": "Closet-indexing large-cap bias with negative alpha (-0.45%) and elevated down-capture (94.5%).",
      "hurdleDeltas": {
        "rollingDelta": -1.22,
        "sortinoDelta": -0.36,
        "alphaDelta": -1.95,
        "upCaptureDelta": 8,
        "downCaptureDelta": -19.5,
        "primaryFailureHurdle": "Negative Alpha & Down-Capture Failure",
        "rejectionReason": "Failed 3Y Rolling (-1.22% below benchmark), Sortino (1.14 < 1.50), and Down-Capture (94.5% vs <75%)."
      }
    },
    "topHoldings": [
      {
        "name": "ICICI Bank",
        "ticker": "ICICIBANK",
        "sector": "Financials",
        "weight": 7.2,
        "valuationMetric": "PB",
        "metricValue": 2.9,
        "marketPrice": 1240,
        "rationale": "Core banking"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 30,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 5.5,
        "comment": "Underwhelming performance. Better options exist in PPFAS/HDFC.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 5.8,
        "comment": "Fails downside defense metrics.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 6,
        "comment": "High down-capture (94.5%) does not fit conservative safety.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 6.5,
        "comment": "Broad index tracking with high fees.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 5.2,
        "comment": "Frequent manager transitions (tenure 2 years).",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 0.96,
        "benchmarkReturn": 1.36,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.35,
        "benchmarkReturn": 1.85,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.06,
        "benchmarkReturn": 2.56,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.71,
        "benchmarkReturn": -0.31,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.29,
        "benchmarkReturn": 0.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.69,
        "benchmarkReturn": -2.19,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.74,
        "benchmarkReturn": 2.14,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": -0.17,
        "benchmarkReturn": 1.33,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.34,
        "benchmarkReturn": -0.84,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.58,
        "benchmarkReturn": 2.98,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.28,
        "benchmarkReturn": 1.78,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.16,
        "benchmarkReturn": 2.66,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.67,
        "benchmarkReturn": 1.07,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.28,
        "benchmarkReturn": 1.78,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.43,
        "benchmarkReturn": 1.93,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -0.95,
        "benchmarkReturn": -0.55,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.51,
        "benchmarkReturn": 0.99,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": -0.09,
        "benchmarkReturn": 1.41,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.22,
        "benchmarkReturn": 1.62,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": -0.25,
        "benchmarkReturn": 1.25,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Rama Iyer Srinivasan",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 2,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "SBI Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "SBI Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing SBI Flexicap for 2 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "absl-fc-08",
    "name": "Aditya Birla Sun Life Flexi Cap Fund - Direct Growth",
    "shortName": "ABSL Flexi Cap",
    "fundHouse": "Aditya Birla Sun Life Mutual Fund",
    "category": "Flexi Cap",
    "broadType": "Equity",
    "nav": 1540.2,
    "aumCr": 19800,
    "expenseRatio": 0.89,
    "inceptionYear": 1998,
    "fundManager": "Anil Shah",
    "fundManagerTenureYears": 9,
    "portfolioTurnover": 0.45,
    "cashHoldingPct": 4.2,
    "benchmark": "NIFTY 500 TRI",
    "style": "Growth",
    "portfolioPE": 26.2,
    "portfolioPB": 4.4,
    "marketCapBreakdown": {
      "largeCap": 66,
      "midCap": 26,
      "smallCap": 4,
      "cashDebt": 4,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 27,
      "pb": 4.1,
      "evEbitda": 14.1,
      "priceToSales": 2.9,
      "dividendYield": 0.9
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 12.8,
      "threeYearRollingMin": -1.8,
      "threeYearRollingMax": 27.2,
      "benchmarkRollingAvg": 14.62,
      "percentBeatingBenchmark": 36,
      "percentPositiveReturns": 89,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 15,
          "count": 270
        },
        {
          "label": "15% - 20%",
          "percentage": 24,
          "count": 432
        },
        {
          "label": "10% - 15%",
          "percentage": 35,
          "count": 630
        },
        {
          "label": "0% - 10%",
          "percentage": 20,
          "count": 360
        },
        {
          "label": "< 0%",
          "percentage": 6,
          "count": 108
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 14.8,
      "beta": 0.99,
      "sharpeRatio": 0.65,
      "treynorRatio": 8.9,
      "jensensAlpha": -0.92,
      "sortinoRatio": 1.08,
      "benchmarkSortino": 1.21,
      "informationRatio": -0.38,
      "rSquared": 0.92,
      "upCaptureRatio": 89,
      "downCaptureRatio": 96.8
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 1,
      "verdict": "REJECT",
      "summary": "Lagging performance with severe downside exposure (96.8% down-capture) and negative active alpha.",
      "hurdleDeltas": {
        "rollingDelta": -1.82,
        "sortinoDelta": -0.42,
        "alphaDelta": -2.42,
        "upCaptureDelta": 9,
        "downCaptureDelta": -21.8,
        "primaryFailureHurdle": "Down-Capture & Alpha Failure",
        "rejectionReason": "Down-Capture 96.8% provides zero downside protection; negative Jensen Alpha -0.92%."
      }
    },
    "topHoldings": [
      {
        "name": "Infosys Ltd",
        "ticker": "INFY",
        "sector": "Technology",
        "weight": 6.8,
        "valuationMetric": "PE",
        "metricValue": 26,
        "marketPrice": 1850,
        "rationale": "IT services"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Technology",
        "weight": 20,
        "valuationMetric": "PE",
        "macroSensitivity": "Export/USD-Beneficiary"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 5,
        "comment": "Chronic underperformer. Exit candidate.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 5.2,
        "comment": "Fails institutional screener.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 5.4,
        "comment": "Too much downside volatility for low active alpha.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 6,
        "comment": "Portfolio structure resembles passive Nifty 500.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 5,
        "comment": "Underperformed category benchmark on 3Y rolling basis.",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 0.96,
        "benchmarkReturn": 1.36,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.35,
        "benchmarkReturn": 1.85,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.06,
        "benchmarkReturn": 2.56,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.71,
        "benchmarkReturn": -0.31,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.29,
        "benchmarkReturn": 0.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.69,
        "benchmarkReturn": -2.19,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.74,
        "benchmarkReturn": 2.14,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": -0.17,
        "benchmarkReturn": 1.33,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.34,
        "benchmarkReturn": -0.84,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.58,
        "benchmarkReturn": 2.98,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.28,
        "benchmarkReturn": 1.78,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.16,
        "benchmarkReturn": 2.66,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.67,
        "benchmarkReturn": 1.07,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.28,
        "benchmarkReturn": 1.78,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.43,
        "benchmarkReturn": 1.93,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -0.95,
        "benchmarkReturn": -0.55,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.51,
        "benchmarkReturn": 0.99,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": -0.09,
        "benchmarkReturn": 1.41,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.22,
        "benchmarkReturn": 1.62,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": -0.25,
        "benchmarkReturn": 1.25,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Anil Shah",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 17,
      "tenureAtSchemeYears": 9,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Aditya Birla Sun Life Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Aditya Birla Sun Life Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing ABSL Flexi Cap for 9 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "motilal-mc-01",
    "name": "Motilal Oswal Midcap Fund - Direct Growth",
    "shortName": "Motilal Oswal Midcap",
    "fundHouse": "Motilal Oswal Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 98.42,
    "aumCr": 16800,
    "expenseRatio": 0.68,
    "inceptionYear": 2014,
    "fundManager": "Niket Shah",
    "fundManagerTenureYears": 6,
    "portfolioTurnover": 0.42,
    "cashHoldingPct": 4.8,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Growth",
    "portfolioPE": 31.4,
    "portfolioPB": 5.8,
    "marketCapBreakdown": {
      "largeCap": 12,
      "midCap": 76,
      "smallCap": 8,
      "cashDebt": 4,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 32.5,
      "pb": 5.2,
      "evEbitda": 18.4,
      "priceToSales": 3.8,
      "dividendYield": 0.6
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 26.82,
      "threeYearRollingMin": 11.4,
      "threeYearRollingMax": 46.8,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 94.2,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 72,
          "count": 1296
        },
        {
          "label": "15% - 20%",
          "percentage": 18,
          "count": 324
        },
        {
          "label": "10% - 15%",
          "percentage": 8,
          "count": 144
        },
        {
          "label": "0% - 10%",
          "percentage": 2,
          "count": 36
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 14.8,
      "beta": 0.84,
      "sharpeRatio": 1.45,
      "treynorRatio": 22.4,
      "jensensAlpha": 6.84,
      "sortinoRatio": 2.18,
      "benchmarkSortino": 1.34,
      "informationRatio": 1.12,
      "rSquared": 0.81,
      "upCaptureRatio": 104.2,
      "downCaptureRatio": 64.8
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "Pre-eminent high conviction mid-cap compounder. Astonishing 6.84% Jensen's Alpha with superior 64.8% down-capture defense.",
      "hurdleDeltas": {
        "rollingDelta": 8.58,
        "sortinoDelta": 0.68,
        "alphaDelta": 5.34,
        "upCaptureDelta": 24.2,
        "downCaptureDelta": 10.2
      }
    },
    "topHoldings": [
      {
        "name": "Persistent Systems",
        "ticker": "PERSISTENT",
        "sector": "Technology",
        "weight": 8.4,
        "valuationMetric": "PE",
        "metricValue": 42,
        "marketPrice": 4850,
        "rationale": "AI engineering and enterprise digital scale",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Polycab India Ltd",
        "ticker": "POLYCAB",
        "sector": "Cap Goods",
        "weight": 7.2,
        "valuationMetric": "PE",
        "metricValue": 38.4,
        "marketPrice": 6200,
        "rationale": "Market share leadership in electrification cables",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Coforge Ltd",
        "ticker": "COFORGE",
        "sector": "Technology",
        "weight": 6.8,
        "valuationMetric": "PE",
        "metricValue": 36.2,
        "marketPrice": 6400,
        "rationale": "Strong order book in banking tech execution",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Dixon Technologies",
        "ticker": "DIXON",
        "sector": "Consumer Durables",
        "weight": 5.9,
        "valuationMetric": "PE",
        "metricValue": 68,
        "marketPrice": 12400,
        "rationale": "Domestic electronics manufacturing champion (PLI)",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "KAYNES Technology",
        "ticker": "KAYNES",
        "sector": "Electronics",
        "weight": 5.4,
        "valuationMetric": "PE",
        "metricValue": 72,
        "marketPrice": 5100,
        "rationale": "High-margin IoT and aerospace electronics EMS",
        "marketCapTier": "Small Cap"
      },
      {
        "name": "Federal Bank Ltd",
        "ticker": "FEDERALBNK",
        "sector": "Financials",
        "weight": 4.8,
        "valuationMetric": "PB",
        "metricValue": 1.4,
        "marketPrice": 195,
        "rationale": "Mid-tier private bank ROA expansion",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "APL Apollo Tubes",
        "ticker": "APLAPOLLO",
        "sector": "Building Products",
        "weight": 4.5,
        "valuationMetric": "PE",
        "metricValue": 44,
        "marketPrice": 1480,
        "rationale": "Structural steel tube monopoly with 55% market share",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Prestige Estates",
        "ticker": "PRESTIGE",
        "sector": "Real Estate",
        "weight": 4.2,
        "valuationMetric": "PB",
        "metricValue": 2.8,
        "marketPrice": 1840,
        "rationale": "Aggressive residential pre-sales and commercial leasing",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Max Financial Services",
        "ticker": "MFSL",
        "sector": "Insurance",
        "weight": 3.9,
        "valuationMetric": "PB",
        "metricValue": 3.2,
        "marketPrice": 1120,
        "rationale": "Long-term private life insurance structural growth",
        "marketCapTier": "Mid Cap"
      },
      {
        "name": "Tata Technologies",
        "ticker": "TATATECH",
        "sector": "Auto Ancillary",
        "weight": 3.5,
        "valuationMetric": "PE",
        "metricValue": 34,
        "marketPrice": 1050,
        "rationale": "Global EV software and design partner",
        "marketCapTier": "Large Cap"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Technology",
        "weight": 26.4,
        "valuationMetric": "PE",
        "macroSensitivity": "Export/USD-Beneficiary"
      },
      {
        "sector": "Cap Goods",
        "weight": 18.2,
        "valuationMetric": "PE",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 9.8,
        "comment": "Top alpha booster in the Indian market.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 8.8,
        "comment": "Exceptional downside defense for a mid-cap fund.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 7,
        "comment": "Mid cap volatility requires strict 15% portfolio cap.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 9,
        "comment": "Benefits directly from domestic capex and global tech outsourcing.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.2,
        "comment": "Niket Shah's focused 30-stock framework has delivered world-class metrics.",
        "stance": "Approved"
      }
    },
    "managerProfile": {
      "name": "Niket Shah",
      "age": 42,
      "education": "MBA in Finance, Mumbai University",
      "totalExperienceYears": 16,
      "tenureAtSchemeYears": 6,
      "philosophy": "Focused 25-30 high-growth mid-cap compounders with high ROE, capital efficiency, and clean corporate governance.",
      "otherFundsManaged": [
        {
          "name": "Motilal Oswal Large and Midcap Fund",
          "category": "Large & Mid",
          "aumCr": 6800,
          "threeYearCagr": 25.2
        },
        {
          "name": "Motilal Oswal ELSS Tax Saver",
          "category": "ELSS",
          "aumCr": 3900,
          "threeYearCagr": 23.4
        }
      ],
      "careerMilestones": [
        "Generated >6.8% Jensen's Alpha, ranking Motilal Midcap #1 in 3Y rolling returns.",
        "Early backer of Indian electrification and EMS manufacturing leaders (Polycab, Persistent, Coforge).",
        "Maintains zero exposure to highly leveraged real estate or commodity cyclical mid-caps."
      ]
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 4.56,
        "benchmarkReturn": 1.56,
        "alpha": 3
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 4.03,
        "benchmarkReturn": 2.13,
        "alpha": 1.9
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 4.84,
        "benchmarkReturn": 2.94,
        "alpha": 1.9
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 2.64,
        "benchmarkReturn": -0.36,
        "alpha": 3
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 2.14,
        "benchmarkReturn": 0.24,
        "alpha": 1.9
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -0.62,
        "benchmarkReturn": -2.52,
        "alpha": 1.9
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 5.46,
        "benchmarkReturn": 2.46,
        "alpha": 3
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 3.43,
        "benchmarkReturn": 1.53,
        "alpha": 1.9
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": 0.94,
        "benchmarkReturn": -0.96,
        "alpha": 1.9
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 6.42,
        "benchmarkReturn": 3.42,
        "alpha": 3
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 3.94,
        "benchmarkReturn": 2.04,
        "alpha": 1.9
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 4.96,
        "benchmarkReturn": 3.06,
        "alpha": 1.9
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 4.23,
        "benchmarkReturn": 1.23,
        "alpha": 3
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 3.94,
        "benchmarkReturn": 2.04,
        "alpha": 1.9
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 4.12,
        "benchmarkReturn": 2.22,
        "alpha": 1.9
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 2.37,
        "benchmarkReturn": -0.63,
        "alpha": 3
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 3.04,
        "benchmarkReturn": 1.14,
        "alpha": 1.9
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 3.52,
        "benchmarkReturn": 1.62,
        "alpha": 1.9
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 4.86,
        "benchmarkReturn": 1.86,
        "alpha": 3
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 3.34,
        "benchmarkReturn": 1.44,
        "alpha": 1.9
      }
    ]
  },
  {
    "id": "hdfc-mc-02",
    "name": "HDFC Mid-Cap Opportunities Fund - Direct Growth",
    "shortName": "HDFC Mid-Cap Opp",
    "fundHouse": "HDFC Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 184.2,
    "aumCr": 68500,
    "expenseRatio": 0.74,
    "inceptionYear": 2007,
    "fundManager": "Chirag Setalvad",
    "fundManagerTenureYears": 16,
    "portfolioTurnover": 0.22,
    "cashHoldingPct": 5.4,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Blend",
    "portfolioPE": 26.4,
    "portfolioPB": 4.2,
    "marketCapBreakdown": {
      "largeCap": 15,
      "midCap": 74,
      "smallCap": 6,
      "cashDebt": 5,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 27.2,
      "pb": 4,
      "evEbitda": 14.8,
      "priceToSales": 2.8,
      "dividendYield": 1.1
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 23.4,
      "threeYearRollingMin": 8.4,
      "threeYearRollingMax": 41.2,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 88,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 62,
          "count": 1116
        },
        {
          "label": "15% - 20%",
          "percentage": 24,
          "count": 432
        },
        {
          "label": "10% - 15%",
          "percentage": 10,
          "count": 180
        },
        {
          "label": "0% - 10%",
          "percentage": 4,
          "count": 72
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 14.2,
      "beta": 0.82,
      "sharpeRatio": 1.32,
      "treynorRatio": 20.1,
      "jensensAlpha": 4.8,
      "sortinoRatio": 1.96,
      "benchmarkSortino": 1.34,
      "informationRatio": 0.89,
      "rSquared": 0.86,
      "upCaptureRatio": 96,
      "downCaptureRatio": 68.2
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "The bedrock institutional mid-cap compounding engine. Managed by Chirag Setalvad for 16+ years with 68.2% down-capture.",
      "hurdleDeltas": {
        "rollingDelta": 5.16,
        "sortinoDelta": 0.46,
        "alphaDelta": 3.3,
        "upCaptureDelta": 16,
        "downCaptureDelta": 6.8
      }
    },
    "topHoldings": [
      {
        "name": "Tata Technologies",
        "ticker": "TATATECH",
        "sector": "Auto Ancillary",
        "weight": 5.8,
        "valuationMetric": "PE",
        "metricValue": 34,
        "marketPrice": 1050,
        "rationale": "EV engineering solutions"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Auto Ancillary",
        "weight": 16,
        "valuationMetric": "PE",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 9,
        "comment": "High quality mid-cap compounding.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9.5,
        "comment": "Best-in-class risk-adjusted mid-cap fund for moderate investors.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 7.8,
        "comment": "Solid downside protection managed by a 16-year veteran.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 8.8,
        "comment": "Strong balance sheets capable of navigating interest rate cycles.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.6,
        "comment": "Gold standard manager tenure (16 years), low turnover (22%).",
        "stance": "Approved"
      }
    },
    "managerProfile": {
      "name": "Chirag Setalvad",
      "age": 49,
      "education": "BS in Business Administration, University of North Carolina",
      "totalExperienceYears": 24,
      "tenureAtSchemeYears": 16,
      "philosophy": "Bedrock fundamental growth at reasonable price (GARP). Disciplined risk management and avoiding speculative thematic manias.",
      "otherFundsManaged": [
        {
          "name": "HDFC Small Cap Fund",
          "category": "Small Cap",
          "aumCr": 34100,
          "threeYearCagr": 26.5
        },
        {
          "name": "HDFC Hybrid Equity Fund",
          "category": "Hybrid",
          "aumCr": 24500,
          "threeYearCagr": 18.2
        }
      ],
      "careerMilestones": [
        "One of the longest tenured fund managers in India (16+ continuous years on HDFC Mid-Cap Opportunities).",
        "Navigated the 2008 Global Financial Crisis, 2013 Taper Tantrum, and 2020 Covid Crash with superior resilience.",
        "Manages over ₹1,00,000 Cr across mid and small cap strategies."
      ]
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 3.76,
        "benchmarkReturn": 1.56,
        "alpha": 2.2
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 3.23,
        "benchmarkReturn": 2.13,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 4.04,
        "benchmarkReturn": 2.94,
        "alpha": 1.1
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.84,
        "benchmarkReturn": -0.36,
        "alpha": 2.2
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 1.34,
        "benchmarkReturn": 0.24,
        "alpha": 1.1
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.42,
        "benchmarkReturn": -2.52,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 4.66,
        "benchmarkReturn": 2.46,
        "alpha": 2.2
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 2.63,
        "benchmarkReturn": 1.53,
        "alpha": 1.1
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": 0.14,
        "benchmarkReturn": -0.96,
        "alpha": 1.1
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 5.62,
        "benchmarkReturn": 3.42,
        "alpha": 2.2
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 3.14,
        "benchmarkReturn": 2.04,
        "alpha": 1.1
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 4.16,
        "benchmarkReturn": 3.06,
        "alpha": 1.1
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 3.43,
        "benchmarkReturn": 1.23,
        "alpha": 2.2
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 3.14,
        "benchmarkReturn": 2.04,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 3.32,
        "benchmarkReturn": 2.22,
        "alpha": 1.1
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.57,
        "benchmarkReturn": -0.63,
        "alpha": 2.2
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 2.24,
        "benchmarkReturn": 1.14,
        "alpha": 1.1
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 2.72,
        "benchmarkReturn": 1.62,
        "alpha": 1.1
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 4.06,
        "benchmarkReturn": 1.86,
        "alpha": 2.2
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 2.54,
        "benchmarkReturn": 1.44,
        "alpha": 1.1
      }
    ]
  },
  {
    "id": "kotak-mc-03",
    "name": "Kotak Emerging Equity Fund - Direct Growth",
    "shortName": "Kotak Emerging Equity",
    "fundHouse": "Kotak Mahindra Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 124.5,
    "aumCr": 49200,
    "expenseRatio": 0.72,
    "inceptionYear": 2007,
    "fundManager": "Pankaj Tibrewal",
    "fundManagerTenureYears": 13,
    "portfolioTurnover": 0.28,
    "cashHoldingPct": 6.2,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Growth",
    "portfolioPE": 28.5,
    "portfolioPB": 4.9,
    "marketCapBreakdown": {
      "largeCap": 10,
      "midCap": 78,
      "smallCap": 6,
      "cashDebt": 6,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 29.1,
      "pb": 4.6,
      "evEbitda": 15.6,
      "priceToSales": 3.2,
      "dividendYield": 0.9
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 20.8,
      "threeYearRollingMin": 6.4,
      "threeYearRollingMax": 37.8,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 78,
      "percentPositiveReturns": 98,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 54,
          "count": 972
        },
        {
          "label": "15% - 20%",
          "percentage": 28,
          "count": 504
        },
        {
          "label": "10% - 15%",
          "percentage": 14,
          "count": 252
        },
        {
          "label": "0% - 10%",
          "percentage": 4,
          "count": 72
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 14.9,
      "beta": 0.88,
      "sharpeRatio": 1.12,
      "treynorRatio": 16.8,
      "jensensAlpha": 2.1,
      "sortinoRatio": 1.62,
      "benchmarkSortino": 1.34,
      "informationRatio": 0.54,
      "rSquared": 0.85,
      "upCaptureRatio": 91,
      "downCaptureRatio": 76.8
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 4,
      "verdict": "WATCHLIST",
      "summary": "Phenomenal track record, but AUM has swelled to ~₹50,000 Cr and Down-Capture is slightly above limit (76.8% vs 75%).",
      "hurdleDeltas": {
        "rollingDelta": 2.56,
        "sortinoDelta": 0.12,
        "alphaDelta": 0.6,
        "upCaptureDelta": 11,
        "downCaptureDelta": -1.8,
        "primaryFailureHurdle": "Down-Capture Borderline Breach",
        "rejectionReason": "Down-capture (76.8%) exceeded 75% limit; massive AUM size limits agile small/mid cap entries."
      }
    },
    "topHoldings": [
      {
        "name": "Supreme Industries",
        "ticker": "SUPREMEIND",
        "sector": "Plastics",
        "weight": 4.8,
        "valuationMetric": "PE",
        "metricValue": 36,
        "marketPrice": 4900,
        "rationale": "Industrial piping moat"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Industrials",
        "weight": 22,
        "valuationMetric": "PE",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8,
        "comment": "High quality mid-cap portfolio.",
        "stance": "Neutral"
      },
      "moderate": {
        "score": 8.2,
        "comment": "Pankaj Tibrewal tenure is stellar but watch AUM bloat.",
        "stance": "Neutral"
      },
      "conservative": {
        "score": 7.2,
        "comment": "Borderline down-capture requires monitoring.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 8.2,
        "comment": "Good manufacturing proxy.",
        "stance": "Neutral"
      },
      "dueDiligence": {
        "score": 7.9,
        "comment": "AUM of ~₹50,000 Cr in mid caps forces higher cash and large cap allocation.",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.49,
        "benchmarkReturn": 1.69,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.01,
        "benchmarkReturn": 2.31,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.89,
        "benchmarkReturn": 3.19,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.41,
        "benchmarkReturn": -0.39,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.04,
        "benchmarkReturn": 0.26,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.04,
        "benchmarkReturn": -2.74,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.47,
        "benchmarkReturn": 2.67,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.36,
        "benchmarkReturn": 1.66,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.34,
        "benchmarkReturn": -1.04,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.51,
        "benchmarkReturn": 3.71,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.91,
        "benchmarkReturn": 2.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.02,
        "benchmarkReturn": 3.32,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.14,
        "benchmarkReturn": 1.34,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.91,
        "benchmarkReturn": 2.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.11,
        "benchmarkReturn": 2.41,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.12,
        "benchmarkReturn": -0.68,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.94,
        "benchmarkReturn": 1.24,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.46,
        "benchmarkReturn": 1.76,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.82,
        "benchmarkReturn": 2.02,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.26,
        "benchmarkReturn": 1.56,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Pankaj Tibrewal",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 21,
      "tenureAtSchemeYears": 13,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Kotak Mahindra Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Kotak Mahindra Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Kotak Emerging Equity for 13 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "nippon-mc-04",
    "name": "Nippon India Growth Fund - Direct Growth",
    "shortName": "Nippon India Growth",
    "fundHouse": "Nippon India Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 3820.4,
    "aumCr": 32400,
    "expenseRatio": 0.79,
    "inceptionYear": 1995,
    "fundManager": "Rupesh Patel",
    "fundManagerTenureYears": 3,
    "portfolioTurnover": 0.52,
    "cashHoldingPct": 4.2,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Growth",
    "portfolioPE": 29.8,
    "portfolioPB": 5.2,
    "marketCapBreakdown": {
      "largeCap": 14,
      "midCap": 72,
      "smallCap": 10,
      "cashDebt": 4,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 31,
      "pb": 4.9,
      "evEbitda": 16.8,
      "priceToSales": 3.4,
      "dividendYield": 0.7
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 24.1,
      "threeYearRollingMin": 7.8,
      "threeYearRollingMax": 44.5,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 86,
      "percentPositiveReturns": 99,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 66,
          "count": 1188
        },
        {
          "label": "15% - 20%",
          "percentage": 20,
          "count": 360
        },
        {
          "label": "10% - 15%",
          "percentage": 10,
          "count": 180
        },
        {
          "label": "0% - 10%",
          "percentage": 4,
          "count": 72
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 16.2,
      "beta": 0.96,
      "sharpeRatio": 1.24,
      "treynorRatio": 18.5,
      "jensensAlpha": 4.2,
      "sortinoRatio": 1.78,
      "benchmarkSortino": 1.34,
      "informationRatio": 0.76,
      "rSquared": 0.84,
      "upCaptureRatio": 114,
      "downCaptureRatio": 82.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 4,
      "verdict": "WATCHLIST",
      "summary": "High bull-market up-capture (114%), but down-capture (82.5%) breaches the 75% risk threshold.",
      "hurdleDeltas": {
        "rollingDelta": 5.86,
        "sortinoDelta": 0.28,
        "alphaDelta": 2.7,
        "upCaptureDelta": 34,
        "downCaptureDelta": -7.5,
        "primaryFailureHurdle": "Down-Capture Failed",
        "rejectionReason": "Failed Step 5: Down-Capture is 82.5% vs 75% max limit; high standard deviation of 16.2%."
      }
    },
    "topHoldings": [
      {
        "name": "Varun Beverages",
        "ticker": "VBL",
        "sector": "FMCG",
        "weight": 4.5,
        "valuationMetric": "PE",
        "metricValue": 58,
        "marketPrice": 1540,
        "rationale": "Pepsi bottling franchise expansion"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "FMCG",
        "weight": 14,
        "valuationMetric": "PE",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 9,
        "comment": "High octane mid cap growth.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 7.5,
        "comment": "Downside capture exceeds 75% ceiling.",
        "stance": "Neutral"
      },
      "conservative": {
        "score": 6.2,
        "comment": "Too volatile during broad mid-cap corrections.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 8.2,
        "comment": "Well positioned in domestic consumption.",
        "stance": "Neutral"
      },
      "dueDiligence": {
        "score": 7.8,
        "comment": "Rupesh Patel tenure is relatively recent (3 years).",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.49,
        "benchmarkReturn": 1.69,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.01,
        "benchmarkReturn": 2.31,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.89,
        "benchmarkReturn": 3.19,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.41,
        "benchmarkReturn": -0.39,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.04,
        "benchmarkReturn": 0.26,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.04,
        "benchmarkReturn": -2.74,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.47,
        "benchmarkReturn": 2.67,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.36,
        "benchmarkReturn": 1.66,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.34,
        "benchmarkReturn": -1.04,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.51,
        "benchmarkReturn": 3.71,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.91,
        "benchmarkReturn": 2.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.02,
        "benchmarkReturn": 3.32,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.14,
        "benchmarkReturn": 1.34,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.91,
        "benchmarkReturn": 2.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.11,
        "benchmarkReturn": 2.41,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.12,
        "benchmarkReturn": -0.68,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.94,
        "benchmarkReturn": 1.24,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.46,
        "benchmarkReturn": 1.76,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.82,
        "benchmarkReturn": 2.02,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.26,
        "benchmarkReturn": 1.56,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Rupesh Patel",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 3,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Nippon India Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Nippon India Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Nippon India Growth for 3 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "axis-mc-05",
    "name": "Axis Midcap Fund - Direct Growth",
    "shortName": "Axis Midcap",
    "fundHouse": "Axis Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 92.4,
    "aumCr": 28400,
    "expenseRatio": 0.78,
    "inceptionYear": 2011,
    "fundManager": "Shreyash Devalkar",
    "fundManagerTenureYears": 6,
    "portfolioTurnover": 0.38,
    "cashHoldingPct": 7.5,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Growth",
    "portfolioPE": 36.2,
    "portfolioPB": 6.4,
    "marketCapBreakdown": {
      "largeCap": 18,
      "midCap": 70,
      "smallCap": 4,
      "cashDebt": 8,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 38,
      "pb": 6,
      "evEbitda": 19.5,
      "priceToSales": 4.4,
      "dividendYield": 0.5
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 15.2,
      "threeYearRollingMin": 2.4,
      "threeYearRollingMax": 31,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 38,
      "percentPositiveReturns": 92,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 28,
          "count": 504
        },
        {
          "label": "15% - 20%",
          "percentage": 32,
          "count": 576
        },
        {
          "label": "10% - 15%",
          "percentage": 26,
          "count": 468
        },
        {
          "label": "0% - 10%",
          "percentage": 12,
          "count": 216
        },
        {
          "label": "< 0%",
          "percentage": 2,
          "count": 36
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 13.8,
      "beta": 0.78,
      "sharpeRatio": 0.72,
      "treynorRatio": 11.4,
      "jensensAlpha": -0.65,
      "sortinoRatio": 1.18,
      "benchmarkSortino": 1.34,
      "informationRatio": -0.42,
      "rSquared": 0.85,
      "upCaptureRatio": 72,
      "downCaptureRatio": 74
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": false,
      "downCapturePassed": true,
      "totalScore": 1,
      "verdict": "REJECT",
      "summary": "Severe lag in mid-cap bull run. Failed 3Y rolling returns (-3.04%), Sortino (1.18 vs 1.50), and Jensen's Alpha (-0.65%).",
      "hurdleDeltas": {
        "rollingDelta": -3.04,
        "sortinoDelta": -0.32,
        "alphaDelta": -2.15,
        "upCaptureDelta": -8,
        "downCaptureDelta": 1,
        "primaryFailureHurdle": "Lagged Rolling, Alpha & Up-Capture",
        "rejectionReason": "Failed 3Y rolling (-3.04% below benchmark); Sortino 1.18 is below 1.50 minimum; Up-Capture 72% failed 80% threshold."
      }
    },
    "topHoldings": [
      {
        "name": "Astral Ltd",
        "ticker": "ASTRAL",
        "sector": "Building Products",
        "weight": 5.2,
        "valuationMetric": "PE",
        "metricValue": 62,
        "marketPrice": 1980,
        "rationale": "Expensive plumbing fittings leader"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Industrials",
        "weight": 26,
        "valuationMetric": "PE",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 4.8,
        "comment": "Missed the massive mid-cap rally completely.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 5.2,
        "comment": "Negative active alpha for 3 years.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 5.8,
        "comment": "Down-capture is acceptable (74%), but returns severely depressed.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 5.5,
        "comment": "Excessive exposure to derating high-PE stocks.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 4.9,
        "comment": "Severe alpha decay in last 36 months.",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 1.29,
        "benchmarkReturn": 1.69,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.81,
        "benchmarkReturn": 2.31,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.69,
        "benchmarkReturn": 3.19,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.79,
        "benchmarkReturn": -0.39,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.24,
        "benchmarkReturn": 0.26,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -4.24,
        "benchmarkReturn": -2.74,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.27,
        "benchmarkReturn": 2.67,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.16,
        "benchmarkReturn": 1.66,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.54,
        "benchmarkReturn": -1.04,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.31,
        "benchmarkReturn": 3.71,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.71,
        "benchmarkReturn": 2.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.82,
        "benchmarkReturn": 3.32,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.94,
        "benchmarkReturn": 1.34,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.71,
        "benchmarkReturn": 2.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.91,
        "benchmarkReturn": 2.41,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -1.08,
        "benchmarkReturn": -0.68,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.26,
        "benchmarkReturn": 1.24,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 0.26,
        "benchmarkReturn": 1.76,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.62,
        "benchmarkReturn": 2.02,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.06,
        "benchmarkReturn": 1.56,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Shreyash Devalkar",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 6,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Axis Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Axis Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Axis Midcap for 6 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "sbi-mc-06",
    "name": "SBI Magnum Midcap Fund - Direct Growth",
    "shortName": "SBI Magnum Midcap",
    "fundHouse": "SBI Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 224.8,
    "aumCr": 18200,
    "expenseRatio": 0.82,
    "inceptionYear": 2005,
    "fundManager": "Bhavin Vithlani",
    "fundManagerTenureYears": 4,
    "portfolioTurnover": 0.44,
    "cashHoldingPct": 5.8,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Blend",
    "portfolioPE": 27.8,
    "portfolioPB": 4.8,
    "marketCapBreakdown": {
      "largeCap": 12,
      "midCap": 75,
      "smallCap": 7,
      "cashDebt": 6,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 28.5,
      "pb": 4.5,
      "evEbitda": 15.2,
      "priceToSales": 3,
      "dividendYield": 0.8
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 19.8,
      "threeYearRollingMin": 4.8,
      "threeYearRollingMax": 38,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 62,
      "percentPositiveReturns": 96,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 48,
          "count": 864
        },
        {
          "label": "15% - 20%",
          "percentage": 30,
          "count": 540
        },
        {
          "label": "10% - 15%",
          "percentage": 16,
          "count": 288
        },
        {
          "label": "0% - 10%",
          "percentage": 6,
          "count": 108
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 15.8,
      "beta": 0.94,
      "sharpeRatio": 0.98,
      "treynorRatio": 14.5,
      "jensensAlpha": 0.8,
      "sortinoRatio": 1.34,
      "benchmarkSortino": 1.34,
      "informationRatio": 0.22,
      "rSquared": 0.87,
      "upCaptureRatio": 92,
      "downCaptureRatio": 89.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 2,
      "verdict": "REJECT",
      "summary": "Breached downside capture shield (89.5% vs 75%) and generated sub-par active alpha (+0.80% vs 1.50%).",
      "hurdleDeltas": {
        "rollingDelta": 1.56,
        "sortinoDelta": -0.16,
        "alphaDelta": -0.7,
        "upCaptureDelta": 12,
        "downCaptureDelta": -14.5,
        "primaryFailureHurdle": "Down-Capture & Alpha Failed",
        "rejectionReason": "Failed Step 5 Down-Capture (89.5% vs <75%) and Step 3 Alpha (0.80% vs >1.50%)."
      }
    },
    "topHoldings": [
      {
        "name": "Crisil Ltd",
        "ticker": "CRISIL",
        "sector": "Financials",
        "weight": 4.9,
        "valuationMetric": "PE",
        "metricValue": 46,
        "marketPrice": 4800,
        "rationale": "Rating agency monopoly"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 22,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 6.5,
        "comment": "Mediocre mid cap alpha.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 6,
        "comment": "Down-capture of 89.5% fails downside protection.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 5.5,
        "comment": "High drawdown volatility.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 6.8,
        "comment": "Decent portfolio companies but lags category leaders.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 6.2,
        "comment": "Sortino 1.34 does not meet institutional hurdle (1.50).",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 1.29,
        "benchmarkReturn": 1.69,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.81,
        "benchmarkReturn": 2.31,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.69,
        "benchmarkReturn": 3.19,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.79,
        "benchmarkReturn": -0.39,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.24,
        "benchmarkReturn": 0.26,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -4.24,
        "benchmarkReturn": -2.74,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.27,
        "benchmarkReturn": 2.67,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.16,
        "benchmarkReturn": 1.66,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.54,
        "benchmarkReturn": -1.04,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.31,
        "benchmarkReturn": 3.71,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.71,
        "benchmarkReturn": 2.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.82,
        "benchmarkReturn": 3.32,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.94,
        "benchmarkReturn": 1.34,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.71,
        "benchmarkReturn": 2.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.91,
        "benchmarkReturn": 2.41,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -1.08,
        "benchmarkReturn": -0.68,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.26,
        "benchmarkReturn": 1.24,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 0.26,
        "benchmarkReturn": 1.76,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.62,
        "benchmarkReturn": 2.02,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.06,
        "benchmarkReturn": 1.56,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Bhavin Vithlani",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 4,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "SBI Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "SBI Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing SBI Magnum Midcap for 4 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "dsp-mc-07",
    "name": "DSP Midcap Fund - Direct Growth",
    "shortName": "DSP Midcap",
    "fundHouse": "DSP Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 138.4,
    "aumCr": 17400,
    "expenseRatio": 0.81,
    "inceptionYear": 2006,
    "fundManager": "Vinit Sambre",
    "fundManagerTenureYears": 9,
    "portfolioTurnover": 0.32,
    "cashHoldingPct": 4.6,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Growth",
    "portfolioPE": 29.4,
    "portfolioPB": 4.9,
    "marketCapBreakdown": {
      "largeCap": 16,
      "midCap": 70,
      "smallCap": 9,
      "cashDebt": 5,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 30.1,
      "pb": 4.7,
      "evEbitda": 16,
      "priceToSales": 3.1,
      "dividendYield": 0.8
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 16.84,
      "threeYearRollingMin": 3.1,
      "threeYearRollingMax": 34,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 44,
      "percentPositiveReturns": 94,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 34,
          "count": 612
        },
        {
          "label": "15% - 20%",
          "percentage": 32,
          "count": 576
        },
        {
          "label": "10% - 15%",
          "percentage": 22,
          "count": 396
        },
        {
          "label": "0% - 10%",
          "percentage": 10,
          "count": 180
        },
        {
          "label": "< 0%",
          "percentage": 2,
          "count": 36
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 15.2,
      "beta": 0.91,
      "sharpeRatio": 0.78,
      "treynorRatio": 12.1,
      "jensensAlpha": -0.25,
      "sortinoRatio": 1.22,
      "benchmarkSortino": 1.34,
      "informationRatio": -0.28,
      "rSquared": 0.86,
      "upCaptureRatio": 84,
      "downCaptureRatio": 88
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 1,
      "verdict": "REJECT",
      "summary": "3Y rolling return underperformed category benchmark by -1.40% with negative Jensen's alpha (-0.25%).",
      "hurdleDeltas": {
        "rollingDelta": -1.4,
        "sortinoDelta": -0.28,
        "alphaDelta": -1.75,
        "upCaptureDelta": 4,
        "downCaptureDelta": -13,
        "primaryFailureHurdle": "3Y Rolling & Alpha Failed",
        "rejectionReason": "Failed 3Y rolling returns (-1.40% vs benchmark), Sortino (1.22 < 1.50), and Down-capture (88% > 75%)."
      }
    },
    "topHoldings": [
      {
        "name": "IPCA Laboratories",
        "ticker": "IPCALAB",
        "sector": "Healthcare",
        "weight": 5.1,
        "valuationMetric": "PE",
        "metricValue": 38,
        "marketPrice": 1320,
        "rationale": "Pharma API recovery"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Healthcare",
        "weight": 20,
        "valuationMetric": "PE",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 5.8,
        "comment": "Underperforming relative to Motilal and HDFC.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 6,
        "comment": "Sub-par alpha generation over 3 years.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 5.6,
        "comment": "Down-capture of 88% is too high.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 6.2,
        "comment": "Pharma tilt has weighed down relative performance.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 6.4,
        "comment": "Veteran manager Vinit Sambre has experienced factor headwinds.",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 1.29,
        "benchmarkReturn": 1.69,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.81,
        "benchmarkReturn": 2.31,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.69,
        "benchmarkReturn": 3.19,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.79,
        "benchmarkReturn": -0.39,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.24,
        "benchmarkReturn": 0.26,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -4.24,
        "benchmarkReturn": -2.74,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.27,
        "benchmarkReturn": 2.67,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.16,
        "benchmarkReturn": 1.66,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.54,
        "benchmarkReturn": -1.04,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.31,
        "benchmarkReturn": 3.71,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.71,
        "benchmarkReturn": 2.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.82,
        "benchmarkReturn": 3.32,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.94,
        "benchmarkReturn": 1.34,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.71,
        "benchmarkReturn": 2.21,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.91,
        "benchmarkReturn": 2.41,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -1.08,
        "benchmarkReturn": -0.68,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.26,
        "benchmarkReturn": 1.24,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 0.26,
        "benchmarkReturn": 1.76,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.62,
        "benchmarkReturn": 2.02,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.06,
        "benchmarkReturn": 1.56,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Vinit Sambre",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 17,
      "tenureAtSchemeYears": 9,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "DSP Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "DSP Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing DSP Midcap for 9 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "mirae-mc-08",
    "name": "Mirae Asset Midcap Fund - Direct Growth",
    "shortName": "Mirae Asset Midcap",
    "fundHouse": "Mirae Asset Mutual Fund",
    "category": "Mid Cap",
    "broadType": "Equity",
    "nav": 38.6,
    "aumCr": 15200,
    "expenseRatio": 0.69,
    "inceptionYear": 2019,
    "fundManager": "Ankit Jain",
    "fundManagerTenureYears": 3,
    "portfolioTurnover": 0.48,
    "cashHoldingPct": 4.9,
    "benchmark": "NIFTY Midcap 150 TRI",
    "style": "Growth",
    "portfolioPE": 30.2,
    "portfolioPB": 5.4,
    "marketCapBreakdown": {
      "largeCap": 14,
      "midCap": 74,
      "smallCap": 7,
      "cashDebt": 5,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 31.4,
      "pb": 5,
      "evEbitda": 17.2,
      "priceToSales": 3.5,
      "dividendYield": 0.7
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 22.1,
      "threeYearRollingMin": 6.2,
      "threeYearRollingMax": 39.5,
      "benchmarkRollingAvg": 18.24,
      "percentBeatingBenchmark": 82,
      "percentPositiveReturns": 98,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 58,
          "count": 1044
        },
        {
          "label": "15% - 20%",
          "percentage": 24,
          "count": 432
        },
        {
          "label": "10% - 15%",
          "percentage": 12,
          "count": 216
        },
        {
          "label": "0% - 10%",
          "percentage": 6,
          "count": 108
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 15.4,
      "beta": 0.92,
      "sharpeRatio": 1.16,
      "treynorRatio": 17.2,
      "jensensAlpha": 2.8,
      "sortinoRatio": 1.68,
      "benchmarkSortino": 1.34,
      "informationRatio": 0.62,
      "rSquared": 0.85,
      "upCaptureRatio": 98,
      "downCaptureRatio": 78.2
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 4,
      "verdict": "WATCHLIST",
      "summary": "Solid active alpha (+2.80%) and high Sortino (1.68), but Down-Capture (78.2%) slightly breaches 75% limit.",
      "hurdleDeltas": {
        "rollingDelta": 3.86,
        "sortinoDelta": 0.18,
        "alphaDelta": 1.3,
        "upCaptureDelta": 18,
        "downCaptureDelta": -3.2,
        "primaryFailureHurdle": "Down-Capture Borderline Breach",
        "rejectionReason": "Down-Capture 78.2% breached 75% threshold; manager tenure is under 5 years."
      }
    },
    "topHoldings": [
      {
        "name": "Federal Bank",
        "ticker": "FEDERALBNK",
        "sector": "Financials",
        "weight": 4.8,
        "valuationMetric": "PB",
        "metricValue": 1.4,
        "marketPrice": 195,
        "rationale": "Mid-tier private bank ROA expansion"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 24,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.5,
        "comment": "Competitive mid cap performer.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 7.8,
        "comment": "Borderline down-capture holds it back from Tier-1 Qualified status.",
        "stance": "Neutral"
      },
      "conservative": {
        "score": 6.8,
        "comment": "Higher beta than HDFC Mid-Cap.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 8,
        "comment": "Good cyclical exposure.",
        "stance": "Neutral"
      },
      "dueDiligence": {
        "score": 7.6,
        "comment": "Fund inception in 2019 means 10-year full cycle data is still maturing.",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.49,
        "benchmarkReturn": 1.69,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.01,
        "benchmarkReturn": 2.31,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.89,
        "benchmarkReturn": 3.19,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.41,
        "benchmarkReturn": -0.39,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.04,
        "benchmarkReturn": 0.26,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.04,
        "benchmarkReturn": -2.74,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.47,
        "benchmarkReturn": 2.67,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.36,
        "benchmarkReturn": 1.66,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.34,
        "benchmarkReturn": -1.04,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.51,
        "benchmarkReturn": 3.71,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.91,
        "benchmarkReturn": 2.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.02,
        "benchmarkReturn": 3.32,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.14,
        "benchmarkReturn": 1.34,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.91,
        "benchmarkReturn": 2.21,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.11,
        "benchmarkReturn": 2.41,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.12,
        "benchmarkReturn": -0.68,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.94,
        "benchmarkReturn": 1.24,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.46,
        "benchmarkReturn": 1.76,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.82,
        "benchmarkReturn": 2.02,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.26,
        "benchmarkReturn": 1.56,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Ankit Jain",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 3,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Mirae Asset Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Mirae Asset Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Mirae Asset Midcap for 3 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "nippon-lc-01",
    "name": "Nippon India Large Cap Fund - Direct Growth",
    "shortName": "Nippon India Large Cap",
    "fundHouse": "Nippon India Mutual Fund",
    "category": "Large Cap",
    "broadType": "Equity",
    "nav": 92.4,
    "aumCr": 34500,
    "expenseRatio": 0.72,
    "inceptionYear": 2007,
    "fundManager": "Sailesh Raj Bhan",
    "fundManagerTenureYears": 17,
    "portfolioTurnover": 0.28,
    "cashHoldingPct": 4.2,
    "benchmark": "BSE 100 TRI",
    "style": "Value",
    "portfolioPE": 20.4,
    "portfolioPB": 2.9,
    "marketCapBreakdown": {
      "largeCap": 88,
      "midCap": 8,
      "smallCap": 0,
      "cashDebt": 4,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 21,
      "pb": 2.7,
      "evEbitda": 10.8,
      "priceToSales": 2.1,
      "dividendYield": 1.6
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 17.8,
      "threeYearRollingMin": 6.2,
      "threeYearRollingMax": 31.4,
      "benchmarkRollingAvg": 13.8,
      "percentBeatingBenchmark": 86.4,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 42,
          "count": 756
        },
        {
          "label": "15% - 20%",
          "percentage": 36,
          "count": 648
        },
        {
          "label": "10% - 15%",
          "percentage": 16,
          "count": 288
        },
        {
          "label": "0% - 10%",
          "percentage": 6,
          "count": 108
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 12.8,
      "beta": 0.88,
      "sharpeRatio": 1.22,
      "treynorRatio": 16.4,
      "jensensAlpha": 3.65,
      "sortinoRatio": 1.82,
      "benchmarkSortino": 1.18,
      "informationRatio": 0.82,
      "rSquared": 0.91,
      "upCaptureRatio": 96.4,
      "downCaptureRatio": 64.2
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "The definitive large cap value-cushion. Sailesh Raj Bhan (17y tenure) delivers 3.65% alpha with a defensive 64.2% down-capture.",
      "hurdleDeltas": {
        "rollingDelta": 4,
        "sortinoDelta": 0.32,
        "alphaDelta": 2.15,
        "upCaptureDelta": 16.4,
        "downCaptureDelta": 10.8
      }
    },
    "topHoldings": [
      {
        "name": "HDFC Bank Ltd",
        "ticker": "HDFCBANK",
        "sector": "Financials",
        "weight": 9.2,
        "valuationMetric": "PB",
        "metricValue": 2.7,
        "marketPrice": 1680,
        "rationale": "Private bank value anchor",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "ICICI Bank Ltd",
        "ticker": "ICICIBANK",
        "sector": "Financials",
        "weight": 8.8,
        "valuationMetric": "PB",
        "metricValue": 2.9,
        "marketPrice": 1240,
        "rationale": "Best-in-class return on assets",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Reliance Industries",
        "ticker": "RELIANCE",
        "sector": "Energy",
        "weight": 8.2,
        "valuationMetric": "PE",
        "metricValue": 24.5,
        "marketPrice": 3020,
        "rationale": "Oil to telecom/retail diversified cash cow",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Larsen & Toubro",
        "ticker": "LT",
        "sector": "Cap Goods",
        "weight": 7.4,
        "valuationMetric": "PE",
        "metricValue": 31.2,
        "marketPrice": 3550,
        "rationale": "Multi-year capex execution pipeline",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Infosys Ltd",
        "ticker": "INFY",
        "sector": "Technology",
        "weight": 6.8,
        "valuationMetric": "PE",
        "metricValue": 26,
        "marketPrice": 1850,
        "rationale": "Tier-1 IT cash return",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "State Bank of India",
        "ticker": "SBIN",
        "sector": "Financials",
        "weight": 5.6,
        "valuationMetric": "PB",
        "metricValue": 1.4,
        "marketPrice": 820,
        "rationale": "Dominant public sector balance sheet",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "ITC Ltd",
        "ticker": "ITC",
        "sector": "FMCG",
        "weight": 4.8,
        "valuationMetric": "PE",
        "metricValue": 24.5,
        "marketPrice": 465,
        "rationale": "FMCG pricing power and dividend yield",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Axis Bank Ltd",
        "ticker": "AXISBANK",
        "sector": "Financials",
        "weight": 4.5,
        "valuationMetric": "PB",
        "metricValue": 1.8,
        "marketPrice": 1180,
        "rationale": "Margin expansion post Citi acquisition",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Bharti Airtel",
        "ticker": "BHARTIARTL",
        "sector": "Telecom",
        "weight": 4.2,
        "valuationMetric": "EV/EBITDA",
        "metricValue": 10.2,
        "marketPrice": 1540,
        "rationale": "ARPU expansion in duopoly telecom sector",
        "marketCapTier": "Large Cap"
      },
      {
        "name": "Tata Motors Ltd",
        "ticker": "TATAMOTORS",
        "sector": "Automobile",
        "weight": 3.8,
        "valuationMetric": "PE",
        "metricValue": 16.2,
        "marketPrice": 980,
        "rationale": "JLR debt reduction and domestic EV leadership",
        "marketCapTier": "Large Cap"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 34,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.8,
        "comment": "Terrific foundational anchor for aggressive portfolios.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9.6,
        "comment": "Top recommendation for large-cap allocation.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 9.4,
        "comment": "Low down-capture (64.2%) provides stellar crash cushion.",
        "stance": "Overweight"
      },
      "macro": {
        "score": 9.2,
        "comment": "Beneficiary of institutional liquidity and corporate earnings.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.8,
        "comment": "17-year single manager tenure represents highest governance tier in India.",
        "stance": "Approved"
      }
    },
    "managerProfile": {
      "name": "Sailesh Raj Bhan",
      "age": 51,
      "education": "MBA in Finance, CFA",
      "totalExperienceYears": 25,
      "tenureAtSchemeYears": 17,
      "philosophy": "Pragmatic value investing in Tier-1 dominant market leaders with solid balance sheets and high dividend yields.",
      "otherFundsManaged": [
        {
          "name": "Nippon India Multi Cap Fund",
          "category": "Multi Cap",
          "aumCr": 36200,
          "threeYearCagr": 22.8
        },
        {
          "name": "Nippon India Pharma Fund",
          "category": "Sectoral",
          "aumCr": 7800,
          "threeYearCagr": 21
        }
      ],
      "careerMilestones": [
        "17 consecutive years managing Nippon India Large Cap Fund with exceptional downside preservation.",
        "Known for holding high banking and infrastructure weights ahead of credit expansion cycles."
      ]
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.99,
        "benchmarkReturn": 1.19,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.32,
        "benchmarkReturn": 1.62,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.94,
        "benchmarkReturn": 2.24,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.53,
        "benchmarkReturn": -0.27,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 0.88,
        "benchmarkReturn": 0.18,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.22,
        "benchmarkReturn": -1.92,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.67,
        "benchmarkReturn": 1.87,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.87,
        "benchmarkReturn": 1.17,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -0.03,
        "benchmarkReturn": -0.73,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.41,
        "benchmarkReturn": 2.61,
        "alpha": 1.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 2.25,
        "benchmarkReturn": 1.55,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.03,
        "benchmarkReturn": 2.33,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.74,
        "benchmarkReturn": 0.94,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 2.25,
        "benchmarkReturn": 1.55,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.39,
        "benchmarkReturn": 1.69,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.32,
        "benchmarkReturn": -0.48,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 1.57,
        "benchmarkReturn": 0.87,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.93,
        "benchmarkReturn": 1.23,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 3.22,
        "benchmarkReturn": 1.42,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.8,
        "benchmarkReturn": 1.1,
        "alpha": 0.7
      }
    ]
  },
  {
    "id": "icici-bc-02",
    "name": "ICICI Prudential Bluechip Fund - Direct Growth",
    "shortName": "ICICI Pru Bluechip",
    "fundHouse": "ICICI Prudential Mutual Fund",
    "category": "Large Cap",
    "broadType": "Equity",
    "nav": 112.4,
    "aumCr": 55400,
    "expenseRatio": 0.82,
    "inceptionYear": 2008,
    "fundManager": "Anish Tawakley",
    "fundManagerTenureYears": 7,
    "portfolioTurnover": 0.34,
    "cashHoldingPct": 5.8,
    "benchmark": "NIFTY 100 TRI",
    "style": "Blend",
    "portfolioPE": 22.1,
    "portfolioPB": 3.2,
    "marketCapBreakdown": {
      "largeCap": 90,
      "midCap": 6,
      "smallCap": 0,
      "cashDebt": 4,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 22.8,
      "pb": 3,
      "evEbitda": 11.5,
      "priceToSales": 2.4,
      "dividendYield": 1.4
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 16.4,
      "threeYearRollingMin": 5.8,
      "threeYearRollingMax": 29.8,
      "benchmarkRollingAvg": 13.8,
      "percentBeatingBenchmark": 82,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 38,
          "count": 684
        },
        {
          "label": "15% - 20%",
          "percentage": 36,
          "count": 648
        },
        {
          "label": "10% - 15%",
          "percentage": 18,
          "count": 324
        },
        {
          "label": "0% - 10%",
          "percentage": 8,
          "count": 144
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 13.1,
      "beta": 0.9,
      "sharpeRatio": 1.14,
      "treynorRatio": 15.2,
      "jensensAlpha": 2.45,
      "sortinoRatio": 1.68,
      "benchmarkSortino": 1.18,
      "informationRatio": 0.71,
      "rSquared": 0.93,
      "upCaptureRatio": 94,
      "downCaptureRatio": 68.8
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "Low-volatility bluechip powerhouse. Consistent 68.8% down-capture defense with Anish Tawakley at the helm.",
      "hurdleDeltas": {
        "rollingDelta": 2.6,
        "sortinoDelta": 0.18,
        "alphaDelta": 0.95,
        "upCaptureDelta": 14,
        "downCaptureDelta": 6.2
      }
    },
    "topHoldings": [
      {
        "name": "ICICI Bank",
        "ticker": "ICICIBANK",
        "sector": "Financials",
        "weight": 9.8,
        "valuationMetric": "PB",
        "metricValue": 2.9,
        "marketPrice": 1240,
        "rationale": "Flagship group bank"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 32,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.2,
        "comment": "Dependable blue chip anchor.",
        "stance": "Neutral"
      },
      "moderate": {
        "score": 9.2,
        "comment": "Very stable risk-adjusted compounder.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 9.2,
        "comment": "Down-capture under 70% meets conservative criteria.",
        "stance": "Overweight"
      },
      "macro": {
        "score": 8.8,
        "comment": "High institutional liquidity.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.1,
        "comment": "High institutional standards, low stylistic churn.",
        "stance": "Approved"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 3.08,
        "benchmarkReturn": 1.28,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.45,
        "benchmarkReturn": 1.75,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 3.12,
        "benchmarkReturn": 2.42,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.5,
        "benchmarkReturn": -0.3,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 0.9,
        "benchmarkReturn": 0.2,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.37,
        "benchmarkReturn": -2.07,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.82,
        "benchmarkReturn": 2.02,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.96,
        "benchmarkReturn": 1.26,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -0.09,
        "benchmarkReturn": -0.79,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.61,
        "benchmarkReturn": 2.81,
        "alpha": 1.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 2.38,
        "benchmarkReturn": 1.68,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.21,
        "benchmarkReturn": 2.51,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.81,
        "benchmarkReturn": 1.01,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 2.38,
        "benchmarkReturn": 1.68,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.52,
        "benchmarkReturn": 1.82,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.28,
        "benchmarkReturn": -0.52,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 1.64,
        "benchmarkReturn": 0.94,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 2.03,
        "benchmarkReturn": 1.33,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 3.33,
        "benchmarkReturn": 1.53,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.88,
        "benchmarkReturn": 1.18,
        "alpha": 0.7
      }
    ],
    "managerProfile": {
      "name": "Anish Tawakley",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 7,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "ICICI Prudential Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "ICICI Prudential Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing ICICI Pru Bluechip for 7 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "axis-bc-03",
    "name": "Axis Bluechip Fund - Direct Growth",
    "shortName": "Axis Bluechip",
    "fundHouse": "Axis Mutual Fund",
    "category": "Large Cap",
    "broadType": "Equity",
    "nav": 54.2,
    "aumCr": 29800,
    "expenseRatio": 0.88,
    "inceptionYear": 2010,
    "fundManager": "Shreyash Devalkar",
    "fundManagerTenureYears": 7,
    "portfolioTurnover": 0.46,
    "cashHoldingPct": 4.8,
    "benchmark": "NIFTY 100 TRI",
    "style": "Growth",
    "portfolioPE": 38.4,
    "portfolioPB": 7.2,
    "marketCapBreakdown": {
      "largeCap": 92,
      "midCap": 4,
      "smallCap": 0,
      "cashDebt": 4,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 39.5,
      "pb": 6.9,
      "evEbitda": 22,
      "priceToSales": 4.9,
      "dividendYield": 0.5
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 11.4,
      "threeYearRollingMin": -1.8,
      "threeYearRollingMax": 26.2,
      "benchmarkRollingAvg": 13.8,
      "percentBeatingBenchmark": 24,
      "percentPositiveReturns": 86,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 14,
          "count": 252
        },
        {
          "label": "15% - 20%",
          "percentage": 22,
          "count": 396
        },
        {
          "label": "10% - 15%",
          "percentage": 34,
          "count": 612
        },
        {
          "label": "0% - 10%",
          "percentage": 24,
          "count": 432
        },
        {
          "label": "< 0%",
          "percentage": 6,
          "count": 108
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 13.9,
      "beta": 0.94,
      "sharpeRatio": 0.52,
      "treynorRatio": 7.1,
      "jensensAlpha": -2.1,
      "sortinoRatio": 0.92,
      "benchmarkSortino": 1.18,
      "informationRatio": -0.74,
      "rSquared": 0.92,
      "upCaptureRatio": 74,
      "downCaptureRatio": 94.2
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": false,
      "downCapturePassed": false,
      "totalScore": 0,
      "verdict": "REJECT",
      "summary": "Severe active underperformance across all hurdles. Negative alpha (-2.10%), sub-1.0 Sortino, and zero downside protection (94.2% down-capture).",
      "hurdleDeltas": {
        "rollingDelta": -2.4,
        "sortinoDelta": -0.58,
        "alphaDelta": -3.6,
        "upCaptureDelta": -6,
        "downCaptureDelta": -19.2,
        "primaryFailureHurdle": "Failed All 5 Hurdle Steps",
        "rejectionReason": "Failed 3Y rolling (-2.40% below index), Sortino (0.92 < 1.50), and Down-Capture (94.2% vs <75%)."
      }
    },
    "topHoldings": [
      {
        "name": "Bajaj Finance",
        "ticker": "BAJFINANCE",
        "sector": "Financials",
        "weight": 8.5,
        "valuationMetric": "PB",
        "metricValue": 5.4,
        "marketPrice": 7100,
        "rationale": "High PE consumer lending"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financials",
        "weight": 36,
        "valuationMetric": "PB",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 4.2,
        "comment": "Chronic underperformance vs index.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 4.5,
        "comment": "Fails all 5 institutional hurdles.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 4.8,
        "comment": "High down-capture (94.2%) destroys capital during crashes.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 5,
        "comment": "Extreme PE growth bias suffered during rate-hiking cycle.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 4,
        "comment": "Severe stylistic stubbornness.",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 0.88,
        "benchmarkReturn": 1.28,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.25,
        "benchmarkReturn": 1.75,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 0.92,
        "benchmarkReturn": 2.42,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.7,
        "benchmarkReturn": -0.3,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.3,
        "benchmarkReturn": 0.2,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.57,
        "benchmarkReturn": -2.07,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.62,
        "benchmarkReturn": 2.02,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": -0.24,
        "benchmarkReturn": 1.26,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.29,
        "benchmarkReturn": -0.79,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.41,
        "benchmarkReturn": 2.81,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.18,
        "benchmarkReturn": 1.68,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.01,
        "benchmarkReturn": 2.51,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.61,
        "benchmarkReturn": 1.01,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.18,
        "benchmarkReturn": 1.68,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.32,
        "benchmarkReturn": 1.82,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -0.92,
        "benchmarkReturn": -0.52,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.56,
        "benchmarkReturn": 0.94,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": -0.17,
        "benchmarkReturn": 1.33,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.13,
        "benchmarkReturn": 1.53,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": -0.32,
        "benchmarkReturn": 1.18,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Shreyash Devalkar",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 7,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Axis Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Axis Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Axis Bluechip for 7 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "sbi-bc-04",
    "name": "SBI Bluechip Fund - Direct Growth",
    "shortName": "SBI Bluechip",
    "fundHouse": "SBI Mutual Fund",
    "category": "Large Cap",
    "broadType": "Equity",
    "nav": 84.5,
    "aumCr": 44200,
    "expenseRatio": 0.84,
    "inceptionYear": 2006,
    "fundManager": "Sohini Andani",
    "fundManagerTenureYears": 13,
    "portfolioTurnover": 0.24,
    "cashHoldingPct": 4.5,
    "benchmark": "BSE 100 TRI",
    "style": "Blend",
    "portfolioPE": 23.8,
    "portfolioPB": 3.5,
    "marketCapBreakdown": {
      "largeCap": 86,
      "midCap": 9,
      "smallCap": 0,
      "cashDebt": 5,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 24.2,
      "pb": 3.2,
      "evEbitda": 12.2,
      "priceToSales": 2.6,
      "dividendYield": 1.2
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 13.1,
      "threeYearRollingMin": 3.8,
      "threeYearRollingMax": 27.5,
      "benchmarkRollingAvg": 13.8,
      "percentBeatingBenchmark": 44,
      "percentPositiveReturns": 92,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 22,
          "count": 396
        },
        {
          "label": "15% - 20%",
          "percentage": 28,
          "count": 504
        },
        {
          "label": "10% - 15%",
          "percentage": 34,
          "count": 612
        },
        {
          "label": "0% - 10%",
          "percentage": 14,
          "count": 252
        },
        {
          "label": "< 0%",
          "percentage": 2,
          "count": 36
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 13.4,
      "beta": 0.94,
      "sharpeRatio": 0.72,
      "treynorRatio": 10.2,
      "jensensAlpha": -0.45,
      "sortinoRatio": 1.15,
      "benchmarkSortino": 1.18,
      "informationRatio": -0.22,
      "rSquared": 0.94,
      "upCaptureRatio": 88,
      "downCaptureRatio": 89.4
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": false,
      "totalScore": 1,
      "verdict": "REJECT",
      "summary": "Closet indexer charging active management fees with negative alpha (-0.45%) and high down-capture (89.4%).",
      "hurdleDeltas": {
        "rollingDelta": -0.7,
        "sortinoDelta": -0.35,
        "alphaDelta": -1.95,
        "upCaptureDelta": 8,
        "downCaptureDelta": -14.4,
        "primaryFailureHurdle": "Negative Alpha & Down-Capture Failed",
        "rejectionReason": "Failed 3Y rolling returns (-0.70% vs benchmark); Down-Capture (89.4%) failed <75% shield."
      }
    },
    "topHoldings": [
      {
        "name": "Reliance Industries",
        "ticker": "RELIANCE",
        "sector": "Energy",
        "weight": 8.8,
        "valuationMetric": "PE",
        "metricValue": 24.5,
        "marketPrice": 3020,
        "rationale": "Energy conglomerate"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Energy",
        "weight": 18,
        "valuationMetric": "PE",
        "macroSensitivity": "Pro-Cyclical"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 5.5,
        "comment": "Better off buying a Nifty 50 Index fund for 0.06% TER.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 6,
        "comment": "Lagging performance.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 6.2,
        "comment": "High down-capture (89.4%) violates capital preservation.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 6.8,
        "comment": "Closet index replication.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 5.8,
        "comment": "Low active share (under 40%). High active fee for beta.",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 0.88,
        "benchmarkReturn": 1.28,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.25,
        "benchmarkReturn": 1.75,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 0.92,
        "benchmarkReturn": 2.42,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.7,
        "benchmarkReturn": -0.3,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.3,
        "benchmarkReturn": 0.2,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.57,
        "benchmarkReturn": -2.07,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.62,
        "benchmarkReturn": 2.02,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": -0.24,
        "benchmarkReturn": 1.26,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.29,
        "benchmarkReturn": -0.79,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.41,
        "benchmarkReturn": 2.81,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.18,
        "benchmarkReturn": 1.68,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.01,
        "benchmarkReturn": 2.51,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.61,
        "benchmarkReturn": 1.01,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.18,
        "benchmarkReturn": 1.68,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.32,
        "benchmarkReturn": 1.82,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -0.92,
        "benchmarkReturn": -0.52,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.56,
        "benchmarkReturn": 0.94,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": -0.17,
        "benchmarkReturn": 1.33,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.13,
        "benchmarkReturn": 1.53,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": -0.32,
        "benchmarkReturn": 1.18,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Sohini Andani",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 21,
      "tenureAtSchemeYears": 13,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "SBI Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "SBI Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing SBI Bluechip for 13 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "kotak-arb-01",
    "name": "Kotak Arbitrage Fund - Direct Growth",
    "shortName": "Kotak Arbitrage",
    "fundHouse": "Kotak Mahindra Mutual Fund",
    "category": "Arbitrage",
    "broadType": "Debt/Cash",
    "nav": 34.2,
    "aumCr": 46500,
    "expenseRatio": 0.34,
    "inceptionYear": 2005,
    "fundManager": "Hiten Shah",
    "fundManagerTenureYears": 12,
    "portfolioTurnover": 4.8,
    "cashHoldingPct": 32.5,
    "benchmark": "NIFTY 50 Arbitrage Index",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 100,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 7.42,
      "threeYearRollingMin": 5.12,
      "threeYearRollingMax": 8.94,
      "benchmarkRollingAvg": 6.85,
      "percentBeatingBenchmark": 96.2,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "15% - 20%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "10% - 15%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "0% - 10%",
          "percentage": 100,
          "count": 1800
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 0.84,
      "beta": 0.04,
      "sharpeRatio": 1.84,
      "treynorRatio": 48,
      "jensensAlpha": 1.62,
      "sortinoRatio": 3.42,
      "benchmarkSortino": 2.1,
      "informationRatio": 1.24,
      "rSquared": 0.12,
      "upCaptureRatio": 98,
      "downCaptureRatio": 1.2
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "Flawless market-neutral capital preservation vehicle. Zero equity market risk, 100% positive rolling windows, and equity tax shielding.",
      "hurdleDeltas": {
        "rollingDelta": 0.57,
        "sortinoDelta": 1.92,
        "alphaDelta": 0.12,
        "upCaptureDelta": 18,
        "downCaptureDelta": 73.8
      }
    },
    "topHoldings": [
      {
        "name": "HDFC Bank (Cash/Futures Spread)",
        "ticker": "HDFCBANK-FUT",
        "sector": "Arbitrage",
        "weight": 8.2,
        "valuationMetric": "Dividend Yield",
        "metricValue": 7.2,
        "marketPrice": 1680,
        "rationale": "Cash-futures spread arbitrage locking in annualized return"
      },
      {
        "name": "Reliance Industries (Spread)",
        "ticker": "RELIANCE-FUT",
        "sector": "Arbitrage",
        "weight": 6.8,
        "valuationMetric": "Dividend Yield",
        "metricValue": 7.4,
        "marketPrice": 3020,
        "rationale": "Riskless cash-futures arbitrage"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Cash & Futures Arbitrage",
        "weight": 67.5,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      },
      {
        "sector": "Sovereign T-Bills",
        "weight": 32.5,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.5,
        "comment": "Essential dry powder buffer to redeploy into equities during crashes.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9.8,
        "comment": "Best tax-advantaged fixed income replacement in India.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 10,
        "comment": "Maximum historical drawdown is less than -0.2%. Pure capital safety.",
        "stance": "Overweight"
      },
      "macro": {
        "score": 9.5,
        "comment": "Completely immune to RBI interest rate hikes and corporate credit defaults.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.9,
        "comment": "Hiten Shah tenure 12 years. Zero credit events in scheme history.",
        "stance": "Approved"
      }
    },
    "managerProfile": {
      "name": "Hiten Shah",
      "age": 45,
      "education": "Chartered Accountant (CA), B.Com",
      "totalExperienceYears": 18,
      "tenureAtSchemeYears": 12,
      "philosophy": "Strict market-neutral cash-futures arbitrage and sovereign debt management with zero credit and equity risk.",
      "otherFundsManaged": [
        {
          "name": "Kotak Equity Savings Fund",
          "category": "Hybrid",
          "aumCr": 7200,
          "threeYearCagr": 11.8
        },
        {
          "name": "Kotak Multi Asset Allocation",
          "category": "Multi Asset",
          "aumCr": 5800,
          "threeYearCagr": 15.2
        }
      ],
      "careerMilestones": [
        "12 years managing Kotak Arbitrage with zero credit events or negative annual returns.",
        "Consistently captures the highest spreads during retail derivative expiry weeks."
      ]
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 1.61,
        "benchmarkReturn": 0.61,
        "alpha": 1
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.74,
        "benchmarkReturn": 0.84,
        "alpha": -0.1
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.06,
        "benchmarkReturn": 1.16,
        "alpha": -0.1
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.86,
        "benchmarkReturn": -0.14,
        "alpha": 1
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.01,
        "benchmarkReturn": 0.09,
        "alpha": -0.1
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.09,
        "benchmarkReturn": -0.99,
        "alpha": -0.1
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.97,
        "benchmarkReturn": 0.97,
        "alpha": 1
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.5,
        "benchmarkReturn": 0.6,
        "alpha": -0.1
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -0.48,
        "benchmarkReturn": -0.38,
        "alpha": -0.1
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.34,
        "benchmarkReturn": 1.34,
        "alpha": 1
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.7,
        "benchmarkReturn": 0.8,
        "alpha": -0.1
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.1,
        "benchmarkReturn": 1.2,
        "alpha": -0.1
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 1.48,
        "benchmarkReturn": 0.48,
        "alpha": 1
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.7,
        "benchmarkReturn": 0.8,
        "alpha": -0.1
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.77,
        "benchmarkReturn": 0.87,
        "alpha": -0.1
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.75,
        "benchmarkReturn": -0.25,
        "alpha": 1
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.35,
        "benchmarkReturn": 0.45,
        "alpha": -0.1
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 0.54,
        "benchmarkReturn": 0.64,
        "alpha": -0.1
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.73,
        "benchmarkReturn": 0.73,
        "alpha": 1
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.47,
        "benchmarkReturn": 0.57,
        "alpha": -0.1
      }
    ]
  },
  {
    "id": "icici-arb-02",
    "name": "ICICI Prudential Arbitrage Fund - Direct Growth",
    "shortName": "ICICI Pru Arbitrage",
    "fundHouse": "ICICI Prudential Mutual Fund",
    "category": "Arbitrage",
    "broadType": "Debt/Cash",
    "nav": 32.8,
    "aumCr": 38200,
    "expenseRatio": 0.36,
    "inceptionYear": 2006,
    "fundManager": "Kayzad Eghlim",
    "fundManagerTenureYears": 14,
    "portfolioTurnover": 5.1,
    "cashHoldingPct": 34,
    "benchmark": "NIFTY 50 Arbitrage Index",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 100,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 7.35,
      "threeYearRollingMin": 5.08,
      "threeYearRollingMax": 8.82,
      "benchmarkRollingAvg": 6.85,
      "percentBeatingBenchmark": 94,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "15% - 20%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "10% - 15%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "0% - 10%",
          "percentage": 100,
          "count": 1800
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 0.88,
      "beta": 0.05,
      "sharpeRatio": 1.78,
      "treynorRatio": 45,
      "jensensAlpha": 1.55,
      "sortinoRatio": 3.25,
      "benchmarkSortino": 2.1,
      "informationRatio": 1.15,
      "rSquared": 0.14,
      "upCaptureRatio": 96,
      "downCaptureRatio": 1.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "Premier institutional arbitrage fund. 14-year veteran management with near-zero downside risk.",
      "hurdleDeltas": {
        "rollingDelta": 0.5,
        "sortinoDelta": 1.75,
        "alphaDelta": 0.05,
        "upCaptureDelta": 16,
        "downCaptureDelta": 73.5
      }
    },
    "topHoldings": [
      {
        "name": "ICICI Bank (Arbitrage Spread)",
        "ticker": "ICICIBANK-FUT",
        "sector": "Arbitrage",
        "weight": 7.8,
        "valuationMetric": "Dividend Yield",
        "metricValue": 7.3,
        "marketPrice": 1240,
        "rationale": "Cash futures spread"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Cash & Futures Arbitrage",
        "weight": 66,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      },
      {
        "sector": "Sovereign T-Bills",
        "weight": 34,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.5,
        "comment": "High liquidity for rebalancing.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9.6,
        "comment": "High safety buffer.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 9.8,
        "comment": "Virtually zero credit and duration risk.",
        "stance": "Overweight"
      },
      "macro": {
        "score": 9.2,
        "comment": "Thrives when retail derivative speculation expands futures spread.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.8,
        "comment": "14-year manager tenure, top tier risk controls.",
        "stance": "Approved"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.44,
        "benchmarkReturn": 0.64,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 1.57,
        "benchmarkReturn": 0.87,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.9,
        "benchmarkReturn": 1.2,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.65,
        "benchmarkReturn": -0.15,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 0.8,
        "benchmarkReturn": 0.1,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -0.33,
        "benchmarkReturn": -1.03,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.8,
        "benchmarkReturn": 1,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.32,
        "benchmarkReturn": 0.62,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": 0.31,
        "benchmarkReturn": -0.39,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.19,
        "benchmarkReturn": 1.39,
        "alpha": 1.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.53,
        "benchmarkReturn": 0.83,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.95,
        "benchmarkReturn": 1.25,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.3,
        "benchmarkReturn": 0.5,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.53,
        "benchmarkReturn": 0.83,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 1.61,
        "benchmarkReturn": 0.91,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.54,
        "benchmarkReturn": -0.26,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 1.16,
        "benchmarkReturn": 0.46,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.36,
        "benchmarkReturn": 0.66,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.56,
        "benchmarkReturn": 0.76,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.29,
        "benchmarkReturn": 0.59,
        "alpha": 0.7
      }
    ],
    "managerProfile": {
      "name": "Kayzad Eghlim",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 22,
      "tenureAtSchemeYears": 14,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "ICICI Prudential Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "ICICI Prudential Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing ICICI Pru Arbitrage for 14 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "sbi-arb-03",
    "name": "SBI Arbitrage Opportunities Fund - Direct Growth",
    "shortName": "SBI Arbitrage",
    "fundHouse": "SBI Mutual Fund",
    "category": "Arbitrage",
    "broadType": "Debt/Cash",
    "nav": 31.4,
    "aumCr": 31200,
    "expenseRatio": 0.42,
    "inceptionYear": 2006,
    "fundManager": "Neeraj Kumar",
    "fundManagerTenureYears": 5,
    "portfolioTurnover": 4.2,
    "cashHoldingPct": 35.5,
    "benchmark": "NIFTY 50 Arbitrage Index",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 100,
      "commodity": 0
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 7.02,
      "threeYearRollingMin": 4.85,
      "threeYearRollingMax": 8.42,
      "benchmarkRollingAvg": 6.85,
      "percentBeatingBenchmark": 74,
      "percentPositiveReturns": 100,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "15% - 20%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "10% - 15%",
          "percentage": 0,
          "count": 0
        },
        {
          "label": "0% - 10%",
          "percentage": 100,
          "count": 1800
        },
        {
          "label": "< 0%",
          "percentage": 0,
          "count": 0
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 0.92,
      "beta": 0.05,
      "sharpeRatio": 1.42,
      "treynorRatio": 38,
      "jensensAlpha": 1.1,
      "sortinoRatio": 2.65,
      "benchmarkSortino": 2.1,
      "informationRatio": 0.48,
      "rSquared": 0.15,
      "upCaptureRatio": 91,
      "downCaptureRatio": 2.1
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 4,
      "verdict": "WATCHLIST",
      "summary": "Safe capital preservation but slightly higher expense ratio (0.42%) results in lower net active alpha (+1.10% vs >1.50%).",
      "hurdleDeltas": {
        "rollingDelta": 0.17,
        "sortinoDelta": 1.15,
        "alphaDelta": -0.4,
        "upCaptureDelta": 11,
        "downCaptureDelta": 72.9,
        "primaryFailureHurdle": "Alpha Below 1.5% Threshold",
        "rejectionReason": "Expense ratio of 0.42% compresses net alpha (+1.10% vs >1.50% hurdle)."
      }
    },
    "topHoldings": [
      {
        "name": "T-Bills 91D",
        "ticker": "TBILL-91",
        "sector": "Sovereign Debt",
        "weight": 12,
        "valuationMetric": "Dividend Yield",
        "metricValue": 6.9,
        "marketPrice": 100,
        "rationale": "Sovereign cash buffer"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Cash & Futures Arbitrage",
        "weight": 64.5,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      },
      {
        "sector": "Sovereign Debt",
        "weight": 35.5,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 7.8,
        "comment": "Kotak has lower TER.",
        "stance": "Neutral"
      },
      "moderate": {
        "score": 8.2,
        "comment": "Decent alternative.",
        "stance": "Neutral"
      },
      "conservative": {
        "score": 8.8,
        "comment": "Extremely safe.",
        "stance": "Overweight"
      },
      "macro": {
        "score": 8.5,
        "comment": "High sovereign backing.",
        "stance": "Neutral"
      },
      "dueDiligence": {
        "score": 8,
        "comment": "0.42% expense ratio is 8 bps higher than Kotak (0.34%).",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 1.44,
        "benchmarkReturn": 0.64,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.57,
        "benchmarkReturn": 0.87,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 0.9,
        "benchmarkReturn": 1.2,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.65,
        "benchmarkReturn": -0.15,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.2,
        "benchmarkReturn": 0.1,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.33,
        "benchmarkReturn": -1.03,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.8,
        "benchmarkReturn": 1,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.32,
        "benchmarkReturn": 0.62,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -0.69,
        "benchmarkReturn": -0.39,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.19,
        "benchmarkReturn": 1.39,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.53,
        "benchmarkReturn": 0.83,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 0.95,
        "benchmarkReturn": 1.25,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 1.3,
        "benchmarkReturn": 0.5,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.53,
        "benchmarkReturn": 0.83,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.61,
        "benchmarkReturn": 0.91,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.54,
        "benchmarkReturn": -0.26,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.16,
        "benchmarkReturn": 0.46,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 0.36,
        "benchmarkReturn": 0.66,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.56,
        "benchmarkReturn": 0.76,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.29,
        "benchmarkReturn": 0.59,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Neeraj Kumar",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 5,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "SBI Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "SBI Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing SBI Arbitrage for 5 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "nippon-gold-01",
    "name": "Nippon India ETF Gold BeES",
    "shortName": "Gold BeES (Nippon)",
    "fundHouse": "Nippon India Mutual Fund",
    "category": "Gold / Commodity",
    "broadType": "Commodity",
    "nav": 68.4,
    "aumCr": 14200,
    "expenseRatio": 0.08,
    "inceptionYear": 2007,
    "fundManager": "Vikram Dhawan",
    "fundManagerTenureYears": 7,
    "portfolioTurnover": 0.05,
    "cashHoldingPct": 1.2,
    "benchmark": "Domestic Price of Gold",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 1,
      "commodity": 99
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 13.85,
      "threeYearRollingMin": 1.2,
      "threeYearRollingMax": 24.5,
      "benchmarkRollingAvg": 13.92,
      "percentBeatingBenchmark": 98.5,
      "percentPositiveReturns": 96,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 22,
          "count": 396
        },
        {
          "label": "15% - 20%",
          "percentage": 38,
          "count": 684
        },
        {
          "label": "10% - 15%",
          "percentage": 28,
          "count": 504
        },
        {
          "label": "0% - 10%",
          "percentage": 8,
          "count": 144
        },
        {
          "label": "< 0%",
          "percentage": 4,
          "count": 72
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 11.2,
      "beta": 0.08,
      "sharpeRatio": 0.88,
      "treynorRatio": 32,
      "jensensAlpha": 2.1,
      "sortinoRatio": 1.72,
      "benchmarkSortino": 1.68,
      "informationRatio": 1.45,
      "rSquared": 0.99,
      "upCaptureRatio": 99.4,
      "downCaptureRatio": 18.2
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "The undisputed institutional benchmark for Indian gold investing. Lowest expense ratio (0.08%), tightest tracking error (<0.09%), and immense ₹14,000+ Cr exchange liquidity.",
      "hurdleDeltas": {
        "rollingDelta": -0.07,
        "sortinoDelta": 0.22,
        "alphaDelta": 0.6,
        "upCaptureDelta": 19.4,
        "downCaptureDelta": 56.8
      }
    },
    "topHoldings": [
      {
        "name": "Physical Gold Bullion (99.5% Purity)",
        "ticker": "GOLD-995",
        "marketCapTier": "Commodity",
        "sector": "Physical Precious Metals",
        "weight": 98.8,
        "valuationMetric": "Dividend Yield",
        "metricValue": 0,
        "marketPrice": 74500,
        "rationale": "Audited bank vault physical bullion backing with RBI custodianship"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Physical Gold Bullion",
        "weight": 98.8,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      },
      {
        "sector": "Cash / Margins",
        "weight": 1.2,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.8,
        "comment": "8% to 10% allocation provides crisis hedging without dragging returns.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9.8,
        "comment": "Perfect counter-cyclical stabilizer when equities suffer macro shocks.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 9.6,
        "comment": "Proven negative correlation with equity drawdowns (rose in 2008 & 2020).",
        "stance": "Overweight"
      },
      "macro": {
        "score": 10,
        "comment": "Ultimate geopolitical risk and currency depreciation hedge.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.9,
        "comment": "0.08% expense ratio and daily physical vault inspection certificates.",
        "stance": "Approved"
      }
    },
    "managerProfile": {
      "name": "Vikram Dhawan",
      "age": 48,
      "education": "PGDBM in Finance, B.Com",
      "totalExperienceYears": 20,
      "tenureAtSchemeYears": 7,
      "philosophy": "Ultra-low tracking error passive physical commodity replication with maximum liquidity and zero slippage.",
      "otherFundsManaged": [
        {
          "name": "Nippon India Silver ETF",
          "category": "Commodity",
          "aumCr": 3800,
          "threeYearCagr": 16.5
        },
        {
          "name": "Nippon India ETF Nifty 50 BeES",
          "category": "Large Cap",
          "aumCr": 24500,
          "threeYearCagr": 14.8
        }
      ],
      "careerMilestones": [
        "Scaled Gold BeES to become the largest and most liquid gold ETF in India (>₹14,000 Cr AUM).",
        "Maintains the lowest expense ratio (0.08%) and tightest bid-ask spread on NSE/BSE."
      ]
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 1.99,
        "benchmarkReturn": 1.19,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 1.32,
        "benchmarkReturn": 1.62,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 1.94,
        "benchmarkReturn": 2.24,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.53,
        "benchmarkReturn": -0.27,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.12,
        "benchmarkReturn": 0.18,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -2.22,
        "benchmarkReturn": -1.92,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.67,
        "benchmarkReturn": 1.87,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.87,
        "benchmarkReturn": 1.17,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.03,
        "benchmarkReturn": -0.73,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.41,
        "benchmarkReturn": 2.61,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.25,
        "benchmarkReturn": 1.55,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 2.03,
        "benchmarkReturn": 2.33,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 1.74,
        "benchmarkReturn": 0.94,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.25,
        "benchmarkReturn": 1.55,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 1.39,
        "benchmarkReturn": 1.69,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.32,
        "benchmarkReturn": -0.48,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.57,
        "benchmarkReturn": 0.87,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 0.93,
        "benchmarkReturn": 1.23,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.22,
        "benchmarkReturn": 1.42,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.8,
        "benchmarkReturn": 1.1,
        "alpha": -0.3
      }
    ]
  },
  {
    "id": "icici-gold-02",
    "name": "ICICI Prudential Gold ETF - Direct Growth",
    "shortName": "ICICI Pru Gold ETF",
    "fundHouse": "ICICI Prudential Mutual Fund",
    "category": "Gold / Commodity",
    "broadType": "Commodity",
    "nav": 64.2,
    "aumCr": 6800,
    "expenseRatio": 0.12,
    "inceptionYear": 2010,
    "fundManager": "Gaurav Chikane",
    "fundManagerTenureYears": 5,
    "portfolioTurnover": 0.08,
    "cashHoldingPct": 1.5,
    "benchmark": "Domestic Price of Gold",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 1,
      "commodity": 99
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 13.8,
      "threeYearRollingMin": 1.15,
      "threeYearRollingMax": 24.3,
      "benchmarkRollingAvg": 13.92,
      "percentBeatingBenchmark": 97,
      "percentPositiveReturns": 95.5,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 22,
          "count": 396
        },
        {
          "label": "15% - 20%",
          "percentage": 38,
          "count": 684
        },
        {
          "label": "10% - 15%",
          "percentage": 28,
          "count": 504
        },
        {
          "label": "0% - 10%",
          "percentage": 8,
          "count": 144
        },
        {
          "label": "< 0%",
          "percentage": 4,
          "count": 72
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 11.3,
      "beta": 0.09,
      "sharpeRatio": 0.86,
      "treynorRatio": 30.5,
      "jensensAlpha": 2.05,
      "sortinoRatio": 1.68,
      "benchmarkSortino": 1.68,
      "informationRatio": 1.35,
      "rSquared": 0.99,
      "upCaptureRatio": 99.1,
      "downCaptureRatio": 18.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "QUALIFIED",
      "summary": "High-grade physical gold ETF with tight 0.12% expense ratio and reliable market making liquidity.",
      "hurdleDeltas": {
        "rollingDelta": -0.12,
        "sortinoDelta": 0.18,
        "alphaDelta": 0.55,
        "upCaptureDelta": 19.1,
        "downCaptureDelta": 56.5
      }
    },
    "topHoldings": [
      {
        "name": "Physical Gold Bullion (99.5% Purity)",
        "ticker": "GOLD-995",
        "marketCapTier": "Commodity",
        "sector": "Physical Precious Metals",
        "weight": 98.5,
        "valuationMetric": "Dividend Yield",
        "metricValue": 0,
        "marketPrice": 74500,
        "rationale": "Physical bars in vault"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Physical Gold Bullion",
        "weight": 98.5,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      },
      {
        "sector": "Cash / Margins",
        "weight": 1.5,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 8.5,
        "comment": "Solid commodity diversifier.",
        "stance": "Overweight"
      },
      "moderate": {
        "score": 9.5,
        "comment": "Reliable store of purchasing power.",
        "stance": "Overweight"
      },
      "conservative": {
        "score": 9.4,
        "comment": "Low drawdown risk.",
        "stance": "Overweight"
      },
      "macro": {
        "score": 9.8,
        "comment": "Hedges inflation spikes.",
        "stance": "Overweight"
      },
      "dueDiligence": {
        "score": 9.7,
        "comment": "Low tracking error of 0.12%.",
        "stance": "Approved"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 3.09,
        "benchmarkReturn": 1.29,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 2.46,
        "benchmarkReturn": 1.76,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 3.14,
        "benchmarkReturn": 2.44,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 1.5,
        "benchmarkReturn": -0.3,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": 0.9,
        "benchmarkReturn": 0.2,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -1.39,
        "benchmarkReturn": -2.09,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 3.84,
        "benchmarkReturn": 2.04,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 1.97,
        "benchmarkReturn": 1.27,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -0.1,
        "benchmarkReturn": -0.8,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 4.63,
        "benchmarkReturn": 2.83,
        "alpha": 1.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 2.39,
        "benchmarkReturn": 1.69,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 3.24,
        "benchmarkReturn": 2.54,
        "alpha": 0.7
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 2.82,
        "benchmarkReturn": 1.02,
        "alpha": 1.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 2.39,
        "benchmarkReturn": 1.69,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 2.54,
        "benchmarkReturn": 1.84,
        "alpha": 0.7
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 1.28,
        "benchmarkReturn": -0.52,
        "alpha": 1.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 1.64,
        "benchmarkReturn": 0.94,
        "alpha": 0.7
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 2.04,
        "benchmarkReturn": 1.34,
        "alpha": 0.7
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 3.34,
        "benchmarkReturn": 1.54,
        "alpha": 1.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 1.89,
        "benchmarkReturn": 1.19,
        "alpha": 0.7
      }
    ],
    "managerProfile": {
      "name": "Gaurav Chikane",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 5,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "ICICI Prudential Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "ICICI Prudential Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing ICICI Pru Gold ETF for 5 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "hdfc-gold-03",
    "name": "HDFC Gold ETF - Direct Growth",
    "shortName": "HDFC Gold ETF",
    "fundHouse": "HDFC Mutual Fund",
    "category": "Gold / Commodity",
    "broadType": "Commodity",
    "nav": 66.8,
    "aumCr": 5200,
    "expenseRatio": 0.22,
    "inceptionYear": 2010,
    "fundManager": "Bhagyesh Kagalkar",
    "fundManagerTenureYears": 4,
    "portfolioTurnover": 0.12,
    "cashHoldingPct": 2.1,
    "benchmark": "Domestic Price of Gold",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 2,
      "commodity": 98
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 13.6,
      "threeYearRollingMin": 1.05,
      "threeYearRollingMax": 24,
      "benchmarkRollingAvg": 13.92,
      "percentBeatingBenchmark": 88,
      "percentPositiveReturns": 95,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 20,
          "count": 360
        },
        {
          "label": "15% - 20%",
          "percentage": 38,
          "count": 684
        },
        {
          "label": "10% - 15%",
          "percentage": 30,
          "count": 540
        },
        {
          "label": "0% - 10%",
          "percentage": 8,
          "count": 144
        },
        {
          "label": "< 0%",
          "percentage": 4,
          "count": 72
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 11.4,
      "beta": 0.09,
      "sharpeRatio": 0.82,
      "treynorRatio": 28,
      "jensensAlpha": 1.8,
      "sortinoRatio": 1.58,
      "benchmarkSortino": 1.68,
      "informationRatio": 1.1,
      "rSquared": 0.98,
      "upCaptureRatio": 98.2,
      "downCaptureRatio": 19.8
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": true,
      "alphaPassed": true,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 5,
      "verdict": "WATCHLIST",
      "summary": "Quality physical gold backing, but expense ratio (0.22%) is almost 3x higher than Nippon Gold BeES (0.08%).",
      "hurdleDeltas": {
        "rollingDelta": -0.32,
        "sortinoDelta": 0.08,
        "alphaDelta": 0.3,
        "upCaptureDelta": 18.2,
        "downCaptureDelta": 55.2,
        "primaryFailureHurdle": "Higher Expense Ratio",
        "rejectionReason": "0.22% TER results in higher tracking drag compared to Nippon Gold BeES (0.08%)."
      }
    },
    "topHoldings": [
      {
        "name": "Physical Gold Bullion",
        "ticker": "GOLD-995",
        "marketCapTier": "Commodity",
        "sector": "Physical Precious Metals",
        "weight": 97.9,
        "valuationMetric": "Dividend Yield",
        "metricValue": 0,
        "marketPrice": 74500,
        "rationale": "Vault gold"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Physical Gold Bullion",
        "weight": 97.9,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 7.8,
        "comment": "Nippon Gold BeES has better liquidity and lower TER.",
        "stance": "Neutral"
      },
      "moderate": {
        "score": 8.5,
        "comment": "Good alternative if using HDFC platform.",
        "stance": "Neutral"
      },
      "conservative": {
        "score": 8.8,
        "comment": "Good safety.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 9,
        "comment": "Solid macro hedge.",
        "stance": "Neutral"
      },
      "dueDiligence": {
        "score": 8.2,
        "comment": "0.22% TER creates an avoidable 14 bps annual drag.",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.09,
        "benchmarkReturn": 1.29,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 1.46,
        "benchmarkReturn": 1.76,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.14,
        "benchmarkReturn": 2.44,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.5,
        "benchmarkReturn": -0.3,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.1,
        "benchmarkReturn": 0.2,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -2.39,
        "benchmarkReturn": -2.09,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.84,
        "benchmarkReturn": 2.04,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.97,
        "benchmarkReturn": 1.27,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.1,
        "benchmarkReturn": -0.8,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.63,
        "benchmarkReturn": 2.83,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.39,
        "benchmarkReturn": 1.69,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 2.24,
        "benchmarkReturn": 2.54,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 1.82,
        "benchmarkReturn": 1.02,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.39,
        "benchmarkReturn": 1.69,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 1.54,
        "benchmarkReturn": 1.84,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.28,
        "benchmarkReturn": -0.52,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.64,
        "benchmarkReturn": 0.94,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.04,
        "benchmarkReturn": 1.34,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.34,
        "benchmarkReturn": 1.54,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.89,
        "benchmarkReturn": 1.19,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Bhagyesh Kagalkar",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 15,
      "tenureAtSchemeYears": 4,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "HDFC Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "HDFC Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing HDFC Gold ETF for 4 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "sbi-gold-04",
    "name": "SBI Gold Fund (Fund of Fund) - Direct Growth",
    "shortName": "SBI Gold Fund (FoF)",
    "fundHouse": "SBI Mutual Fund",
    "category": "Gold / Commodity",
    "broadType": "Commodity",
    "nav": 22.4,
    "aumCr": 3100,
    "expenseRatio": 0.32,
    "inceptionYear": 2011,
    "fundManager": "Raviprakash Sharma",
    "fundManagerTenureYears": 9,
    "portfolioTurnover": 0.15,
    "cashHoldingPct": 2.8,
    "benchmark": "Domestic Price of Gold",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 3,
      "commodity": 97
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 13.4,
      "threeYearRollingMin": 0.9,
      "threeYearRollingMax": 23.8,
      "benchmarkRollingAvg": 13.92,
      "percentBeatingBenchmark": 78,
      "percentPositiveReturns": 94,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 18,
          "count": 324
        },
        {
          "label": "15% - 20%",
          "percentage": 36,
          "count": 648
        },
        {
          "label": "10% - 15%",
          "percentage": 32,
          "count": 576
        },
        {
          "label": "0% - 10%",
          "percentage": 10,
          "count": 180
        },
        {
          "label": "< 0%",
          "percentage": 4,
          "count": 72
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 11.5,
      "beta": 0.1,
      "sharpeRatio": 0.76,
      "treynorRatio": 26,
      "jensensAlpha": 1.45,
      "sortinoRatio": 1.48,
      "benchmarkSortino": 1.68,
      "informationRatio": 0.88,
      "rSquared": 0.97,
      "upCaptureRatio": 96.5,
      "downCaptureRatio": 21.5
    },
    "fiveStepFilter": {
      "rollingPassed": true,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 3,
      "verdict": "WATCHLIST",
      "summary": "Good for investors without a demat account, but FoF structure adds double-layer fees (0.32% + ETF expense), pulling Sortino to 1.48 (below 1.50).",
      "hurdleDeltas": {
        "rollingDelta": -0.52,
        "sortinoDelta": -0.02,
        "alphaDelta": -0.05,
        "upCaptureDelta": 16.5,
        "downCaptureDelta": 53.5,
        "primaryFailureHurdle": "Sortino & Alpha Missed Due to FoF Cost",
        "rejectionReason": "FoF expense drag drops Sortino (1.48 < 1.50) and active alpha (1.45% < 1.50%)."
      }
    },
    "topHoldings": [
      {
        "name": "SBI Gold ETF Units",
        "ticker": "SBIGOLD",
        "sector": "Gold ETF",
        "weight": 97.2,
        "valuationMetric": "Dividend Yield",
        "metricValue": 0,
        "marketPrice": 65,
        "rationale": "Underlying gold ETF units"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Gold ETF Units",
        "weight": 97.2,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 7.2,
        "comment": "FoF layer adds friction. Buy Gold BeES ETF directly.",
        "stance": "Neutral"
      },
      "moderate": {
        "score": 7.8,
        "comment": "Acceptable for non-demat SIP accounts only.",
        "stance": "Neutral"
      },
      "conservative": {
        "score": 8.2,
        "comment": "Safety is fine but cost drag exists.",
        "stance": "Neutral"
      },
      "macro": {
        "score": 8.5,
        "comment": "Captures gold price accurately.",
        "stance": "Neutral"
      },
      "dueDiligence": {
        "score": 7.4,
        "comment": "0.32% direct FoF expense on top of underlying ETF.",
        "stance": "Review"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 2.09,
        "benchmarkReturn": 1.29,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 1.46,
        "benchmarkReturn": 1.76,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 2.14,
        "benchmarkReturn": 2.44,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": 0.5,
        "benchmarkReturn": -0.3,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -0.1,
        "benchmarkReturn": 0.2,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -2.39,
        "benchmarkReturn": -2.09,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 2.84,
        "benchmarkReturn": 2.04,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": 0.97,
        "benchmarkReturn": 1.27,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -1.1,
        "benchmarkReturn": -0.8,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 3.63,
        "benchmarkReturn": 2.83,
        "alpha": 0.8
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 1.39,
        "benchmarkReturn": 1.69,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 2.24,
        "benchmarkReturn": 2.54,
        "alpha": -0.3
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 1.82,
        "benchmarkReturn": 1.02,
        "alpha": 0.8
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 1.39,
        "benchmarkReturn": 1.69,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 1.54,
        "benchmarkReturn": 1.84,
        "alpha": -0.3
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": 0.28,
        "benchmarkReturn": -0.52,
        "alpha": 0.8
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": 0.64,
        "benchmarkReturn": 0.94,
        "alpha": -0.3
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": 1.04,
        "benchmarkReturn": 1.34,
        "alpha": -0.3
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 2.34,
        "benchmarkReturn": 1.54,
        "alpha": 0.8
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": 0.89,
        "benchmarkReturn": 1.19,
        "alpha": -0.3
      }
    ],
    "managerProfile": {
      "name": "Raviprakash Sharma",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 17,
      "tenureAtSchemeYears": 9,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "SBI Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "SBI Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing SBI Gold Fund (FoF) for 9 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  },
  {
    "id": "kotak-gold-05",
    "name": "Kotak Gold Fund - Direct Growth",
    "shortName": "Kotak Gold Fund",
    "fundHouse": "Kotak Mahindra Mutual Fund",
    "category": "Gold / Commodity",
    "broadType": "Commodity",
    "nav": 24.1,
    "aumCr": 1850,
    "expenseRatio": 0.45,
    "inceptionYear": 2011,
    "fundManager": "Abhishek Bisen",
    "fundManagerTenureYears": 8,
    "portfolioTurnover": 0.18,
    "cashHoldingPct": 3.5,
    "benchmark": "Domestic Price of Gold",
    "style": "Blend",
    "portfolioPE": 0,
    "portfolioPB": 0,
    "marketCapBreakdown": {
      "largeCap": 0,
      "midCap": 0,
      "smallCap": 0,
      "cashDebt": 4,
      "commodity": 96
    },
    "weightedMultiples": {
      "pe": 0,
      "pb": 0,
      "evEbitda": 0,
      "priceToSales": 0,
      "dividendYield": 0
    },
    "rollingDistribution": {
      "threeYearRollingAvg": 13.05,
      "threeYearRollingMin": 0.6,
      "threeYearRollingMax": 23.1,
      "benchmarkRollingAvg": 13.92,
      "percentBeatingBenchmark": 68,
      "percentPositiveReturns": 93,
      "brackets": [
        {
          "label": "> 20%",
          "percentage": 16,
          "count": 288
        },
        {
          "label": "15% - 20%",
          "percentage": 34,
          "count": 612
        },
        {
          "label": "10% - 15%",
          "percentage": 34,
          "count": 612
        },
        {
          "label": "0% - 10%",
          "percentage": 12,
          "count": 216
        },
        {
          "label": "< 0%",
          "percentage": 4,
          "count": 72
        }
      ]
    },
    "riskMetrics": {
      "standardDeviation": 11.6,
      "beta": 0.11,
      "sharpeRatio": 0.7,
      "treynorRatio": 23.5,
      "jensensAlpha": 1.15,
      "sortinoRatio": 1.38,
      "benchmarkSortino": 1.68,
      "informationRatio": 0.72,
      "rSquared": 0.96,
      "upCaptureRatio": 94,
      "downCaptureRatio": 24
    },
    "fiveStepFilter": {
      "rollingPassed": false,
      "sortinoPassed": false,
      "alphaPassed": false,
      "upCapturePassed": true,
      "downCapturePassed": true,
      "totalScore": 2,
      "verdict": "REJECT",
      "summary": "High 0.45% expense ratio and elevated tracking error (0.48%) causes rolling return to trail benchmark by -0.87% and Sortino to fail (1.38 vs 1.50).",
      "hurdleDeltas": {
        "rollingDelta": -0.87,
        "sortinoDelta": -0.12,
        "alphaDelta": -0.35,
        "upCaptureDelta": 14,
        "downCaptureDelta": 51,
        "primaryFailureHurdle": "Rolling Return & Sortino Failed",
        "rejectionReason": "Failed 3Y rolling returns (-0.87% vs benchmark); Sortino (1.38 < 1.50); excessive 0.45% TER."
      }
    },
    "topHoldings": [
      {
        "name": "Kotak Gold ETF Units",
        "ticker": "KOTAKGOLD",
        "marketCapTier": "Commodity",
        "sector": "Gold ETF",
        "weight": 96.5,
        "valuationMetric": "Dividend Yield",
        "metricValue": 0,
        "marketPrice": 62,
        "rationale": "Underlying ETF units"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Gold ETF Units",
        "weight": 96.5,
        "valuationMetric": "Dividend Yield",
        "macroSensitivity": "Defensive"
      }
    ],
    "agentReviews": {
      "aggressive": {
        "score": 6,
        "comment": "High expense ratio drag.",
        "stance": "Underweight"
      },
      "moderate": {
        "score": 6.5,
        "comment": "Tracking error too wide compared to Nippon Gold BeES.",
        "stance": "Underweight"
      },
      "conservative": {
        "score": 7,
        "comment": "Safe physically, but cost inefficiency.",
        "stance": "Underweight"
      },
      "macro": {
        "score": 7.8,
        "comment": "Lagging benchmark by nearly 90 bps annually.",
        "stance": "Underweight"
      },
      "dueDiligence": {
        "score": 6.2,
        "comment": "0.45% direct TER is unacceptable for passive gold.",
        "stance": "Flagged"
      }
    },
    "quarterlyPerformance": [
      {
        "quarter": "Q1 2021",
        "fundReturn": 0.89,
        "benchmarkReturn": 1.29,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2021",
        "fundReturn": 0.26,
        "benchmarkReturn": 1.76,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2021",
        "fundReturn": 0.94,
        "benchmarkReturn": 2.44,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2021",
        "fundReturn": -0.7,
        "benchmarkReturn": -0.3,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2022",
        "fundReturn": -1.3,
        "benchmarkReturn": 0.2,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2022",
        "fundReturn": -3.59,
        "benchmarkReturn": -2.09,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2022",
        "fundReturn": 1.64,
        "benchmarkReturn": 2.04,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2022",
        "fundReturn": -0.23,
        "benchmarkReturn": 1.27,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2023",
        "fundReturn": -2.3,
        "benchmarkReturn": -0.8,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2023",
        "fundReturn": 2.43,
        "benchmarkReturn": 2.83,
        "alpha": -0.4
      },
      {
        "quarter": "Q3 2023",
        "fundReturn": 0.19,
        "benchmarkReturn": 1.69,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2023",
        "fundReturn": 1.04,
        "benchmarkReturn": 2.54,
        "alpha": -1.5
      },
      {
        "quarter": "Q1 2024",
        "fundReturn": 0.62,
        "benchmarkReturn": 1.02,
        "alpha": -0.4
      },
      {
        "quarter": "Q2 2024",
        "fundReturn": 0.19,
        "benchmarkReturn": 1.69,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2024",
        "fundReturn": 0.34,
        "benchmarkReturn": 1.84,
        "alpha": -1.5
      },
      {
        "quarter": "Q4 2024",
        "fundReturn": -0.92,
        "benchmarkReturn": -0.52,
        "alpha": -0.4
      },
      {
        "quarter": "Q1 2025",
        "fundReturn": -0.56,
        "benchmarkReturn": 0.94,
        "alpha": -1.5
      },
      {
        "quarter": "Q2 2025",
        "fundReturn": -0.16,
        "benchmarkReturn": 1.34,
        "alpha": -1.5
      },
      {
        "quarter": "Q3 2025",
        "fundReturn": 1.14,
        "benchmarkReturn": 1.54,
        "alpha": -0.4
      },
      {
        "quarter": "Q4 2025",
        "fundReturn": -0.31,
        "benchmarkReturn": 1.19,
        "alpha": -1.5
      }
    ],
    "managerProfile": {
      "name": "Abhishek Bisen",
      "age": 47,
      "education": "Master of Business Administration (Finance), CFA Charterholder",
      "totalExperienceYears": 16,
      "tenureAtSchemeYears": 8,
      "philosophy": "Growth oriented compounding, seeking businesses with scalable domestic moats and high return on capital.",
      "otherFundsManaged": [
        {
          "name": "Kotak Mahindra Mutual Fund Large Cap Fund",
          "category": "Large Cap",
          "aumCr": 12500,
          "threeYearCagr": 16.4
        },
        {
          "name": "Kotak Mahindra Mutual Fund Dynamic Fund",
          "category": "Hybrid",
          "aumCr": 6800,
          "threeYearCagr": 13.8
        }
      ],
      "careerMilestones": [
        "Managing Kotak Gold Fund for 8 consecutive years.",
        "Extensive institutional research across Indian capital goods, banking, and consumer sectors."
      ]
    }
  }
];
