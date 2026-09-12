import { describe, expect, it } from "vitest";
import { DEFAULT_TVM, solveTvm } from "./tvm";
import type { TvmInput } from "./tvm";

const base: TvmInput = {
  goalName: "Test",
  targetToday: 1_000_000,
  horizonYears: 10,
  inflationPct: 0,
  expectedReturnPct: 12,
  expenseRatioPct: 0,
  existingLumpSum: 0,
  stepUpPct: 0,
  taxEnabled: false,
  taxRatePct: 12.5,
};

describe("solveTvm", () => {
  it("compounds the goal at inflation", () => {
    const r = solveTvm({ ...DEFAULT_TVM, targetToday: 10_000_000, inflationPct: 6.65, horizonYears: 10 });
    expect(r.futureCostTarget).toBeGreaterThan(19_000_000);
    expect(r.futureCostTarget).toBeLessThan(19_100_000);
  });

  it("computes net return as expected minus TER", () => {
    const r = solveTvm({ ...base, expectedReturnPct: 12, expenseRatioPct: 0.8 });
    expect(r.netReturnPct).toBeCloseTo(11.2, 5);
  });

  it("computes the real return using the Fisher relation", () => {
    const r = solveTvm({ ...base, inflationPct: 6.65, expectedReturnPct: 12, expenseRatioPct: 0.8 });
    const expected = ((1 + 0.112) / (1 + 0.0665) - 1) * 100;
    expect(r.realReturnPct).toBeCloseTo(expected, 6);
  });

  it("solves a SIP that actually reaches the target", () => {
    const r = solveTvm(base);
    expect(r.finalValue).toBeGreaterThanOrEqual(r.futureCostTarget * 0.999);
    expect(r.finalValue).toBeLessThan(r.futureCostTarget * 1.02);
  });

  it("does not penalise capital with a lower gross return than TER", () => {
    const r = solveTvm({ ...base, expectedReturnPct: 1, expenseRatioPct: 2 });
    expect(r.netReturnPct).toBe(0);
    expect(r.requiredMonthlySip).toBeGreaterThan(0);
  });

  it("needs a smaller initial SIP when a step-up is applied", () => {
    const flat = solveTvm(base);
    const stepped = solveTvm({ ...base, stepUpPct: 10 });
    expect(stepped.requiredMonthlySip).toBeLessThan(flat.requiredMonthlySip);
  });

  it("requires a larger SIP to beat tax on gains", () => {
    const noTax = solveTvm(base);
    const taxed = solveTvm({ ...base, taxEnabled: true, taxRatePct: 12.5 });
    expect(taxed.requiredMonthlySip).toBeGreaterThan(noTax.requiredMonthlySip);
    expect(taxed.postTaxValue).toBeGreaterThanOrEqual(taxed.futureCostTarget * 0.999);
  });

  it("returns zero SIP when existing corpus already covers the goal", () => {
    const r = solveTvm({ ...base, existingLumpSum: 5_000_000 });
    expect(r.requiredMonthlySip).toBe(0);
  });

  it("builds a schedule of one row per year", () => {
    const r = solveTvm({ ...base, horizonYears: 7 });
    expect(r.schedule).toHaveLength(7);
    expect(r.schedule[6]?.year).toBe(7);
    expect(r.schedule[6]?.nominalValue).toBeGreaterThan(r.schedule[0]!.nominalValue);
  });
});
