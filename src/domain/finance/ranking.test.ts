import { describe, expect, it } from "vitest";
import { RANK_WEIGHTS, rankWeightSummary } from "./ranking";

describe("ranking weights", () => {
  it("sum to 100", () => {
    expect(RANK_WEIGHTS.reduce((s, w) => s + w.weightPct, 0)).toBe(100);
  });

  it("builds a readable summary", () => {
    expect(rankWeightSummary()).toContain("Rolling beat rate 30%");
  });
});
