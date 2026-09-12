import { describe, expect, it } from "vitest";
import {
  backtestLumpSum,
  backtestSip,
  fundReturnSeries,
  portfolioReturnSeries,
  rollingSipSuccess,
  xirr,
} from "./backtest";
import { makeFund } from "./factories";

const labels = (n: number) =>
  Array.from({ length: n }, (_, i) => `2020-${String((i % 12) + 1).padStart(2, "0")}`);

describe("backtestSip", () => {
  it("flat returns: no gain, no drawdown, zero XIRR", () => {
    const r = backtestSip(labels(12), Array.from({ length: 12 }, () => 0), 1000);
    expect(r.invested).toBe(12_000);
    expect(r.finalValue).toBe(12_000);
    expect(r.gain).toBe(0);
    expect(r.navMaxDrawdownPct).toBe(0);
    expect(Math.abs(r.xirrPct)).toBeLessThan(0.5);
  });

  it("1% a month compounds to ~₹12,809 on a ₹1,000 SIP (annuity-due)", () => {
    const r = backtestSip(labels(12), Array.from({ length: 12 }, () => 1), 1000);
    // 1000 * ((1.01^12 - 1)/0.01) * 1.01
    expect(r.finalValue).toBeGreaterThan(12_800);
    expect(r.finalValue).toBeLessThan(12_820);
    expect(r.xirrPct).toBeGreaterThan(12);
    expect(r.xirrPct).toBeLessThan(13.5);
  });

  it("computes NAV-path max drawdown", () => {
    const r = backtestSip(labels(2), [-10, 10], 1000);
    expect(r.navMaxDrawdownPct).toBeCloseTo(-10, 1);
  });

  it("step-up reduces early contributions and still compounds", () => {
    const flat = backtestSip(labels(24), Array.from({ length: 24 }, () => 1), 1000, 0);
    const stepped = backtestSip(labels(24), Array.from({ length: 24 }, () => 1), 1000, 10);
    expect(stepped.invested).toBeGreaterThan(flat.invested);
    expect(stepped.finalValue).toBeGreaterThan(flat.finalValue);
  });
});

describe("backtestLumpSum", () => {
  it("reports CAGR and multiple", () => {
    const r = backtestLumpSum(Array.from({ length: 12 }, () => 1), 100_000);
    expect(r.multiple).toBeGreaterThan(1.12);
    expect(r.cagrPct).toBeGreaterThan(12);
    expect(r.cagrPct).toBeLessThan(13);
  });
});

describe("series plumbing", () => {
  it("fundReturnSeries needs at least 12 months", () => {
    expect(fundReturnSeries(makeFund({ monthlyReturnsPct: { "2020-01": 1 } }))).toBeNull();
  });

  it("aligns a portfolio on common months", () => {
    const a = makeFund({
      id: "a",
      monthlyReturnsPct: { "2020-01": 1, "2020-02": 2, "2020-03": 3 },
      shortName: "A",
    });
    const b = makeFund({
      id: "b",
      monthlyReturnsPct: { "2020-02": 4, "2020-03": 6, "2020-04": 8 },
      shortName: "B",
    });
    const s = portfolioReturnSeries([
      { fund: a, weightPct: 50 },
      { fund: b, weightPct: 50 },
    ]);
    // Only 2020-02 and 2020-03 are common -> <12 months -> null.
    expect(s).toBeNull();
  });

  it("weights funds equally across a long enough window", () => {
    const mk = (id: string, r: number) =>
      makeFund({
        id,
        shortName: id,
        monthlyReturnsPct: Object.fromEntries(labels(12).map((m) => [m, r])),
      });
    const s = portfolioReturnSeries([
      { fund: mk("a", 1), weightPct: 50 },
      { fund: mk("b", 3), weightPct: 50 },
    ]);
    expect(s).not.toBeNull();
    expect(s!.returnsPct[0]).toBeCloseTo(2, 6); // (1+3)/2
  });
});

describe("rollingSipSuccess", () => {
  it("all-positive market -> 100% positive windows", () => {
    const r = rollingSipSuccess(Array.from({ length: 24 }, () => 1), 12, 1000);
    expect(r.windows).toBe(13);
    expect(r.horizonMonths).toBe(12);
    expect(r.positivePct).toBe(100);
    expect(r.beatBenchmarkPct).toBeNull();
  });

  it("beats a weaker benchmark in every window", () => {
    const fund = Array.from({ length: 24 }, () => 1);
    const bench = Array.from({ length: 24 }, () => 0.5);
    const r = rollingSipSuccess(fund, 12, 1000, bench);
    expect(r.beatBenchmarkPct).toBe(100);
  });

  it("shorter history than the horizon collapses to a single window", () => {
    const r = rollingSipSuccess(Array.from({ length: 10 }, () => 1), 24, 1000);
    expect(r.windows).toBe(1);
    expect(r.horizonMonths).toBe(10);
  });
});

describe("xirr", () => {
  it("is ~12.68% for a 1%-monthly annuity", () => {
    const cashflows = Array.from({ length: 12 }, (_, i) => ({ t: i, amount: -1000 }));
    cashflows.push({ t: 12, amount: 12_809.3 });
    expect(xirr(cashflows) * 100).toBeGreaterThan(12);
    expect(xirr(cashflows) * 100).toBeLessThan(13.5);
  });
});
