import { describe, expect, it } from "vitest";
import { buildSynthesis } from "./synthesis";
import type { SynthesisInput } from "./synthesis";
import { makeFund } from "./factories";
import { blendedCapture, crashStress, CRASH_SCENARIOS, stockOverlap, summariseRisk } from "./portfolio";
import { buildRebalancePlan } from "./rebalance";
import { runScreener } from "./screener";
import type { SleeveWeights } from "./types";

const W: SleeveWeights = { flexi: 40, large: 0, mid: 25, small: 0, baf: 0, debt: 15, gold: 20 };

function build(overrides: Partial<SynthesisInput> = {}): SynthesisInput {
  const funds = [makeFund({ id: "a" }), makeFund({ id: "b" })];
  const holdings = funds.map((fund, i) => ({ fund, weightPct: i === 0 ? 50 : 50 }));
  const risk = summariseRisk(W);
  return {
    parts: holdings.map((h) => ({ weightPct: h.weightPct, result: runScreener(h.fund) })),
    capture: blendedCapture(holdings),
    overlap: stockOverlap(holdings),
    crash: CRASH_SCENARIOS.map((s) => crashStress(holdings, s)),
    risk,
    rebalance: buildRebalancePlan({ flexi: 400_000, mid: 250_000, debt: 150_000, gold: 200_000 }, W, 1_000_000),
    activeSleeves: 4,
    filledSleeves: 4,
    ...overrides,
  };
}

describe("buildSynthesis", () => {
  it("produces a 0-100 score from visible pillars", () => {
    const s = buildSynthesis(build());
    const sum = s.pillars.reduce((acc, p) => acc + p.score, 0);
    expect(s.score).toBeCloseTo(sum, 0);
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(100);
  });

  it("never returns a fixed score when inputs change", () => {
    const strong = buildSynthesis(build());
    const weak = buildSynthesis(
      build({
        overlap: {
          items: [],
          overlapPct: 60,
          uniqueStocks: 40,
          status: "ELEVATED",
        },
        activeSleeves: 4,
        filledSleeves: 2,
      }),
    );
    expect(weak.score).toBeLessThan(strong.score);
  });

  it("maps score bands to a verdict", () => {
    const s = buildSynthesis(build());
    expect(["READY", "CONDITIONAL", "NOT_READY"]).toContain(s.verdict);
    if (s.score >= 80) expect(s.verdict).toBe("READY");
  });
});
