import { describe, expect, it } from "vitest";
import { buildRecommendations, type RecommendationInput } from "./recommendations";
import { makeFund } from "./factories";
import { resolveHoldings, tierBreakdown } from "./lookthrough";
import {
  blendedCapture,
  crashStress,
  CRASH_SCENARIOS,
  stockOverlap,
  summariseRisk,
} from "./portfolio";
import type { Selections, SleeveWeights } from "./types";

const W = (p: Partial<SleeveWeights>): SleeveWeights => ({
  flexi: 0,
  large: 0,
  mid: 0,
  small: 0,
  baf: 0,
  debt: 0,
  gold: 0,
  ...p,
});

function scenario(
  funds: ReturnType<typeof makeFund>[],
  weights: SleeveWeights,
  horizonYears = 10,
): RecommendationInput {
  const selections: Selections = {};
  for (const f of funds) selections[f.sleeve] = [...(selections[f.sleeve] ?? []), f.id];
  const holdings = resolveHoldings(weights, selections, funds);
  return {
    weights,
    selections,
    holdings,
    tier: tierBreakdown(holdings),
    capture: blendedCapture(holdings),
    overlap: stockOverlap(holdings),
    risk: summariseRisk(weights),
    crashes: CRASH_SCENARIOS.map((s) => crashStress(holdings, s)),
    horizonYears,
    lumpSum: 1_000_000,
    monthlySip: 50_000,
  };
}

const ids = (input: RecommendationInput) => buildRecommendations(input).map((r) => r.id);

describe("buildRecommendations", () => {
  it("flags an empty portfolio with one important action", () => {
    const recs = buildRecommendations({
      weights: W({ flexi: 100 }),
      selections: {},
      holdings: [],
      tier: { largeCap: 0, midCap: 0, smallCap: 0, cashDebt: 0, commodity: 0 },
      capture: blendedCapture([]),
      overlap: stockOverlap([]),
      risk: summariseRisk(W({ flexi: 100 })),
      crashes: [],
      horizonYears: 10,
      lumpSum: 0,
      monthlySip: 0,
    });
    expect(recs).toHaveLength(1);
    expect(recs[0]!.id).toBe("empty");
    expect(recs[0]!.severity).toBe("important");
  });

  it("suggestions are derived from the scenario, not static", () => {
    const active = makeFund({ id: "a", name: "Parag Parikh Flexi Cap - Direct", category: "Flexi Cap" });
    const recs = buildRecommendations(scenario([active], W({ flexi: 100 })));
    const got = recs.map((r) => r.id);
    expect(got).toContain("index-core");
    expect(got).toContain("global");
    // single sleeve -> breadth
    expect(got).toContain("breadth");
  });

  it("does not suggest an index core when one is present", () => {
    const index = makeFund({ id: "idx", name: "Nifty 500 Index Fund - Direct", category: "Large Cap", sleeve: "large" });
    const active = makeFund({ id: "a", name: "Parag Parikh Flexi Cap", category: "Flexi Cap" });
    const got = ids(scenario([index, active], W({ flexi: 50, large: 50 })));
    expect(got).not.toContain("index-core");
  });

  it("flags a short horizon with high equity as important", () => {
    const active = makeFund({ id: "a", category: "Flexi Cap" });
    const recs = buildRecommendations(scenario([active], W({ flexi: 90, debt: 10 }), 2));
    const horizon = recs.find((r) => r.id === "horizon");
    expect(horizon?.severity).toBe("important");
  });

  it("recommends duration when debt is all arbitrage and horizon is long", () => {
    const arb = makeFund({ id: "arb", category: "Arbitrage", sleeve: "debt" });
    const active = makeFund({ id: "a", category: "Flexi Cap" });
    const got = ids(scenario([active, arb], W({ flexi: 70, debt: 30 }), 12));
    expect(got).toContain("duration");
  });

  it("every recommendation cites a lecture", () => {
    const active = makeFund({ id: "a", category: "Flexi Cap" });
    for (const rec of buildRecommendations(scenario([active], W({ flexi: 100 })))) {
      expect(rec.citation.lectureId).toMatch(/^L\d/);
    }
  });
});
