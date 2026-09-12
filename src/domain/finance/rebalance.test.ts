import { describe, expect, it } from "vitest";
import { applyRebalance, buildRebalancePlan } from "./rebalance";
import type { SleeveWeights } from "./types";

const target: SleeveWeights = {
  flexi: 40,
  large: 0,
  mid: 25,
  small: 0,
  baf: 0,
  debt: 15,
  gold: 20,
};

describe("buildRebalancePlan", () => {
  it("does not trigger when everything is inside the band", () => {
    const current = { flexi: 400_000, mid: 250_000, debt: 150_000, gold: 200_000 };
    const plan = buildRebalancePlan(current, target, 1_000_000);
    expect(plan.triggered).toBe(false);
    expect(plan.actions.every((a) => a.action === "HOLD")).toBe(true);
  });

  it("trims a sleeve that drifted above the band and tops up one below", () => {
    const current = { flexi: 600_000, mid: 250_000, debt: 100_000, gold: 50_000 };
    const plan = buildRebalancePlan(current, target, 1_000_000);
    expect(plan.triggered).toBe(true);
    expect(plan.actions.find((a) => a.sleeve === "flexi")?.action).toBe("SELL");
    expect(plan.actions.find((a) => a.sleeve === "gold")?.action).toBe("BUY");
    expect(plan.maxDriftPct).toBeGreaterThan(5);
  });

  it("respects a custom band", () => {
    const current = { flexi: 460_000, mid: 250_000, debt: 150_000, gold: 140_000 };
    const tight = buildRebalancePlan(current, target, 1_000_000, 1);
    const loose = buildRebalancePlan(current, target, 1_000_000, 10);
    expect(tight.triggered).toBe(true);
    expect(loose.triggered).toBe(false);
  });

  it("applyRebalance moves flagged sleeves toward target", () => {
    const current = { flexi: 600_000, mid: 250_000, debt: 100_000, gold: 50_000 };
    const plan = buildRebalancePlan(current, target, 1_000_000);
    const after = applyRebalance(current, plan);
    expect(after.flexi).toBeLessThan(600_000);
    expect(after.gold).toBeGreaterThan(50_000);
  });
});
