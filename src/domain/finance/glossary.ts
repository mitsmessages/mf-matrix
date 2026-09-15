/** Plain-language definitions, shown on hover across the app. */
export const GLOSSARY = {
  rolling: {
    name: "Rolling return",
    plain:
      "Instead of one start-to-end return, we measure every 3-year window over the history. It shows how consistent a fund was, not just one lucky period.",
  },
  sortino: {
    name: "Sortino",
    plain:
      "Return earned per unit of DOWNSIDE risk only. Higher is better. Above ~1.5 is strong. Unlike Sharpe, it does not punish good upside.",
  },
  alpha: {
    name: "Jensen's alpha",
    plain:
      "Extra return beyond what the fund's market risk (beta) alone would predict. Positive = genuine skill; negative = just borrowed risk.",
  },
  sharpe: {
    name: "Sharpe",
    plain: "Extra return per unit of TOTAL risk (up and down). Useful, but it penalises upside volatility too.",
  },
  beta: {
    name: "Beta",
    plain: "Sensitivity to the market. 1.0 = moves with the index; 1.3 = 30% more swing; 0.7 = calmer.",
  },
  stdDev: {
    name: "Standard deviation",
    plain: "How much returns bounce around, either way. A simple measure of total volatility.",
  },
  treynor: {
    name: "Treynor",
    plain: "Extra return per unit of market risk (beta). Useful when comparing funds holding diversified portfolios.",
  },
  rSquared: {
    name: "R-squared",
    plain: "How much of the fund's movement is explained by the index. Near 1.0 = it mostly tracks the index.",
  },
  informationRatio: {
    name: "Information ratio",
    plain: "Active return divided by how consistently it beats the benchmark. Higher = more reliable outperformance.",
  },
  upCapture: {
    name: "Up-capture",
    plain: "How much of the market's rise the fund captures. 90% means it gains ₹90 when the market gains ₹100. Higher is better.",
  },
  downCapture: {
    name: "Down-capture",
    plain:
      "How much of the market's fall the fund takes. 75% means it loses ₹75 when the market loses ₹100. LOWER is better; under 75 is strong protection.",
  },
  beatBenchmark: {
    name: "Rolling beat rate",
    plain: "Share of 3-year windows in which the fund beat its benchmark. 75%+ is consistent.",
  },
  drawdown: {
    name: "Max drawdown",
    plain: "The worst peak-to-trough fall. A 50% fall needs a 100% gain just to break even.",
  },
  ter: {
    name: "TER (expense ratio)",
    plain: "The annual fee the fund charges, taken from your returns. Lower is better; it compounds against you.",
  },
  aum: {
    name: "AUM",
    plain: "Assets the fund manages. Very large AUM in mid/small caps can make a fund slow and dilute its edge.",
  },
  cagr: {
    name: "CAGR",
    plain: "The steady yearly growth rate that would produce the same end result. Ignores the bumpy path.",
  },
  xirr: {
    name: "XIRR",
    plain: "Your money-weighted yearly return, given when you invested. The right number for SIPs.",
  },
  benchmark: {
    name: "Benchmark",
    plain: "The yardstick the fund is compared against — ideally the index for its category.",
  },
  overlap: {
    name: "Stock overlap",
    plain: "How much the funds in your portfolio own the same stocks. High overlap means paying fees twice for the same exposure.",
  },
  rebalance: {
    name: "Rebalancing",
    plain: "Trimming what ran up and topping up what lagged, back to your target. Forces sell-high, buy-low discipline.",
  },
  captureSpread: {
    name: "Capture spread",
    plain: "Up-capture minus down-capture. Positive means it wins more on the way up than it loses on the way down. Aim above +15.",
  },
  pnl: {
    name: "P&L",
    plain: "Profit or loss = current value minus what you invested.",
  },
  avgCost: {
    name: "Average cost",
    plain: "Total invested divided by total units. Buying in lots blends into one average.",
  },
  drift: {
    name: "Drift",
    plain: "The gap between your current allocation and your target. A large drift means it is time to rebalance.",
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;
