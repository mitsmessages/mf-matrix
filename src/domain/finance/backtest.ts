/**
 * Phase 5b — historical SIP / lump-sum backtest over real monthly NAV returns.
 *
 * Pure and framework-free. Works on the compact `monthlyReturnsPct` series the
 * universe pipeline emits (month key "YYYY-MM" -> return %).
 */
import { round } from "./portfolio";
import type { Fund } from "./types";

export type MonthlyReturnMap = Record<string, number>;

export interface ReturnSeries {
  months: string[];
  returnsPct: number[];
}

/** Extract a fund's monthly return series, or null if it has none. */
export function fundReturnSeries(fund: Fund): ReturnSeries | null {
  const map = fund.monthlyReturnsPct;
  if (!map) return null;
  const months = Object.keys(map).sort();
  if (months.length < 12) return null;
  return { months, returnsPct: months.map((m) => map[m] ?? 0) };
}

export interface PortfolioPart {
  fund: Fund;
  weightPct: number;
  /** True when this fund was substituted because the original had no history. */
  proxy?: boolean;
}

export interface PortfolioSeriesResult {
  months: string[];
  returnsPct: number[];
  proxies: string[];
}

/**
 * Weighted monthly return series across funds, aligned on the months they all
 * share. Funds without history are skipped (the caller substitutes proxies).
 */
export function portfolioReturnSeries(parts: PortfolioPart[]): PortfolioSeriesResult | null {
  const series = parts
    .map((p) => ({ part: p, s: fundReturnSeries(p.fund) }))
    .filter((x): x is { part: PortfolioPart; s: ReturnSeries } => x.s !== null);
  if (series.length === 0) return null;

  const lookups = series.map((x) => ({
    part: x.part,
    returns: new Map(x.s.months.map((m, i) => [m, x.s.returnsPct[i] ?? 0])),
  }));

  let common = new Set(series[0]!.s.months);
  for (const x of series) {
    common = new Set([...common].filter((m) => x.s.months.includes(m)));
  }
  const months = [...common].sort();
  if (months.length < 12) return null;

  const total = series.reduce((s, x) => s + x.part.weightPct, 0) || 1;
  const returnsPct = months.map((m) => {
    let r = 0;
    for (const l of lookups) r += (l.part.weightPct / total) * (l.returns.get(m) ?? 0);
    return r;
  });

  return {
    months,
    returnsPct,
    proxies: parts.filter((p) => p.proxy).map((p) => p.fund.shortName),
  };
}

export interface SipBacktestResult {
  months: number;
  invested: number;
  finalValue: number;
  gain: number;
  multiple: number;
  /** Annualised money-weighted return (%). */
  xirrPct: number;
  /** Max drawdown of the underlying NAV path (%). */
  navMaxDrawdownPct: number;
  valueSeries: number[];
  monthLabels: string[];
}

/**
 * Monthly SIP, deposits at the start of each month (annuity-due), with optional
 * annual step-up. Returns XIRR and the NAV-path drawdown.
 */
export function backtestSip(
  monthLabels: string[],
  returnsPct: number[],
  monthlySip: number,
  stepUpPct = 0,
): SipBacktestResult {
  let value = 0;
  let invested = 0;
  let nav = 100;
  let peak = 100;
  let maxDd = 0;
  const valueSeries: number[] = [];
  const cashflows: { t: number; amount: number }[] = [];

  for (let i = 0; i < returnsPct.length; i++) {
    const year = Math.floor(i / 12);
    const sip = monthlySip * Math.pow(1 + stepUpPct / 100, year);
    value = (value + sip) * (1 + (returnsPct[i] ?? 0) / 100);
    invested += sip;
    cashflows.push({ t: i, amount: -sip });
    nav *= 1 + (returnsPct[i] ?? 0) / 100;
    peak = Math.max(peak, nav);
    maxDd = Math.min(maxDd, nav / peak - 1);
    valueSeries.push(value);
  }

  cashflows.push({ t: returnsPct.length, amount: value });
  const xirrPct = xirr(cashflows);

  return {
    months: returnsPct.length,
    invested: round(invested, 0),
    finalValue: round(value, 0),
    gain: round(value - invested, 0),
    multiple: invested > 0 ? round(value / invested, 2) : 0,
    xirrPct: round(xirrPct * 100, 2),
    navMaxDrawdownPct: round(maxDd * 100, 1),
    valueSeries,
    monthLabels,
  };
}

export interface LumpSumBacktestResult {
  months: number;
  invested: number;
  finalValue: number;
  multiple: number;
  cagrPct: number;
  navMaxDrawdownPct: number;
}

export function backtestLumpSum(
  returnsPct: number[],
  amount: number,
): LumpSumBacktestResult {
  let value = amount;
  let nav = 100;
  let peak = 100;
  let maxDd = 0;
  for (const r of returnsPct) {
    value *= 1 + r / 100;
    nav *= 1 + r / 100;
    peak = Math.max(peak, nav);
    maxDd = Math.min(maxDd, nav / peak - 1);
  }
  const years = returnsPct.length / 12;
  const cagr = years > 0 && amount > 0 ? (value / amount) ** (1 / years) - 1 : 0;
  return {
    months: returnsPct.length,
    invested: amount,
    finalValue: round(value, 0),
    multiple: amount > 0 ? round(value / amount, 2) : 0,
    cagrPct: round(cagr * 100, 2),
    navMaxDrawdownPct: round(maxDd * 100, 1),
  };
}

export interface RollingSipOutcome {
  windows: number;
  horizonMonths: number;
  /** Share of windows that finished above the money invested. */
  positivePct: number;
  /** Share of windows that beat the benchmark on final value (null if no benchmark). */
  beatBenchmarkPct: number | null;
  medianXirrPct: number;
}

/**
 * Rolling SIP windows of a fixed horizon: how often did a SIP started in each
 * month end positive, and how often did it beat the benchmark.
 */
export function rollingSipSuccess(
  returnsPct: number[],
  horizonMonths: number,
  monthlySip: number,
  benchmarkReturnsPct?: number[],
): RollingSipOutcome {
  const n = returnsPct.length;
  const horizon = Math.max(1, Math.min(horizonMonths, n));
  let windows = 0;
  let positive = 0;
  let beatCount = 0;
  let beat = 0;
  const xirrs: number[] = [];

  for (let i = 0; i + horizon <= n; i++) {
    const slice = returnsPct.slice(i, i + horizon);
    const r = backtestSip([], slice, monthlySip);
    windows++;
    if (r.finalValue >= r.invested) positive++;
    xirrs.push(r.xirrPct);
    if (benchmarkReturnsPct && benchmarkReturnsPct.length >= i + horizon) {
      const bslice = benchmarkReturnsPct.slice(i, i + horizon);
      const b = backtestSip([], bslice, monthlySip);
      beatCount++;
      if (r.finalValue > b.finalValue) beat++;
    }
  }

  xirrs.sort((a, b) => a - b);
  const median = xirrs.length > 0 ? xirrs[Math.floor(xirrs.length / 2)]! : 0;
  return {
    windows,
    horizonMonths: horizon,
    positivePct: windows > 0 ? round((positive / windows) * 100, 1) : 0,
    beatBenchmarkPct: beatCount > 0 ? round((beat / beatCount) * 100, 1) : null,
    medianXirrPct: round(median, 2),
  };
}

/** Money-weighted annual return via bisection. `t` is months from start. */
export function xirr(cashflows: { t: number; amount: number }[]): number {
  const f = (rate: number): number =>
    cashflows.reduce((s, c) => s + c.amount / Math.pow(1 + rate, c.t / 12), 0);

  let lo = -0.9999;
  let hi = 10;
  if (f(lo) * f(hi) > 0) return 0;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
