import type { SleeveWeights } from "@/domain/finance/types";

export type AgentVariant = "Aggressive" | "Moderate" | "Conservative" | "Macro" | "DueDiligence";

export interface Agent {
  id: string;
  name: string;
  title: string;
  variant: AgentVariant;
  tagline: string;
  mandate: string;
  allocation: SleeveWeights;
  philosophy: string;
  screeningCriteria: string[];
  avoidances: string[];
  keyQuote: string;
}

const w = (p: Partial<SleeveWeights>): SleeveWeights => ({
  flexi: 0,
  large: 0,
  mid: 0,
  small: 0,
  baf: 0,
  debt: 0,
  gold: 0,
  ...p,
});

export const agents: Agent[] = [
  {
    id: "agent-aggressive",
    name: "Aarav Chen",
    title: "Chief Alpha Strategist",
    variant: "Aggressive",
    tagline: "Long-horizon compounding maximiser",
    mandate:
      "Maximise equity compounding over horizons beyond seven years, favouring high-alpha flexi, mid and small sleeves. Tolerates volatility for category expansion.",
    allocation: w({ flexi: 40, mid: 25, large: 15, debt: 12, gold: 8 }),
    philosophy:
      "Compounding demands volatility tolerance. Point-to-point trailing returns mislead; wealth comes from holding high-alpha compounders through cycles.",
    screeningCriteria: [
      "Rolling beat rate above 80% over a 10-year cycle",
      "Jensen's alpha above +3% (skill, not borrowed beta)",
      "Up-capture above 100%",
      "No cash drag above 15% in a secular bull market",
    ],
    avoidances: [
      "Stagnant large-cap funds that cannot beat the index",
      "Dividend-yield or PSU strategies with low reinvestment ROE",
    ],
    keyQuote:
      "Risk is not volatility; risk is the permanent loss of purchasing power from missing compounding cycles.",
  },
  {
    id: "agent-moderate",
    name: "Elena Rostova",
    title: "Head of Multi-Asset & Dynamic Allocation",
    variant: "Moderate",
    tagline: "Balanced risk-adjusted compounding",
    mandate:
      "Deliver strong risk-adjusted returns through a disciplined equity/debt blend, a Balanced Advantage sleeve and gold, protecting capital in drawdowns.",
    allocation: w({ flexi: 30, mid: 15, baf: 20, debt: 25, gold: 10 }),
    philosophy:
      "Winners rotate. Chasing last year's winner underperformed multi-asset rebalancing with roughly twice the downside.",
    screeningCriteria: [
      "Down-capture below 85% (non-negotiable buffer)",
      "Sortino above 1.2",
      "At least four of the five hurdles cleared",
      "Counter-cyclical BAF models that trim equity when valuations stretch",
    ],
    avoidances: [
      "100% equity for horizons under five years",
      "Pro-cyclical hybrid funds that buy high and sell low",
    ],
    keyQuote:
      "The secret is not the highest peak; it is refusing the drawdown that takes years to recover.",
  },
  {
    id: "agent-conservative",
    name: "Marcus Vance",
    title: "Director of Capital Preservation",
    variant: "Conservative",
    tagline: "Downside guardian, real-return protector",
    mandate:
      "Protect principal, avoid negative rolling windows and reliably beat long-run CPI using high-grade debt and a measured equity sleeve.",
    allocation: w({ large: 20, debt: 70, gold: 10 }),
    philosophy:
      "100% debt fails after tax against inflation. A measured equity sleeve keeps the portfolio ahead of CPI while debt coupons absorb equity shocks.",
    screeningCriteria: [
      "Down-capture below 70%",
      "Sortino above 1.5 with standard deviation under 10%",
      "Arbitrage funds for liquidity with equity taxation",
      "No meaningful negative rolling windows over ten years",
    ],
    avoidances: [
      "Small-cap or sectoral funds under any circumstances",
      "Unhedged equity above 25% of the portfolio",
    ],
    keyQuote:
      "Rule one: never lose capital. Rule two: never forget rule one. Beating inflation is meaningless if the principal is gone.",
  },
  {
    id: "agent-macro",
    name: "Dr. Kabir Sen",
    title: "Chief Macro Transmission Strategist",
    variant: "Macro",
    tagline: "Rates, currency and sector rotation",
    mandate:
      "Reduce macro noise to inflation and the RBI repo path, then map sector winners and losers across tightening and easing regimes.",
    allocation: w({ flexi: 35, large: 15, mid: 10, debt: 30, gold: 10 }),
    philosophy:
      "Everything transmits through inflation and interest rates. Hike cycles favour exporters and defensives; cut cycles favour domestic cyclicals.",
    screeningCriteria: [
      "Top three sectors aligned with the current rate stance",
      "Export orientation when the rupee weakens",
      "Domestic capex orientation during credit expansion",
    ],
    avoidances: [
      "Rate-sensitive, debt-heavy sectors during aggressive hikes",
      "Ignoring currency depreciation on imported commodities",
    ],
    keyQuote:
      "When rates pivot down, EMIs fall and a wave of domestic demand follows.",
  },
  {
    id: "agent-dd",
    name: "Sarah Montgomery, CFA",
    title: "Head of Valuation Forensics & Due Diligence",
    variant: "DueDiligence",
    tagline: "Method 2 decomposition and forensic audit",
    mandate:
      "Audit portfolios with sector-native multiples, then judge manager tenure, cash drag, concentration and style consistency.",
    allocation: w({ flexi: 40, large: 20, mid: 20, debt: 20 }),
    philosophy:
      "Trailing returns deceive; portfolios tell the truth. A fund is a collection of businesses priced at today's multiples.",
    screeningCriteria: [
      "Manager tenure above five years with consistent category alpha",
      "Portfolio turnover below 60%",
      "Top-ten concentration below 55%",
      "Style consistency across the valuation cycle",
    ],
    avoidances: [
      "Valuing banks on P/E instead of P/B",
      "Valuing utilities without EV/EBITDA",
      "Closet indexers charging active fees",
    ],
    keyQuote:
      "Never buy a fund on yesterday's factsheet without understanding today's businesses and the price paid for them.",
  },
];
