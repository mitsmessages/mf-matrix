import { describe, expect, it } from "vitest";
import { funds, fundById, screenedUniverse, metricsOnlyCount, universeMeta } from "./funds";

import { courseModules } from "./curriculum";
import { agents } from "./agents";
import { CATEGORY_TO_SLEEVE, SLEEVE_KEYS } from "@/domain/finance/sleeves";

describe("fund dataset", () => {
  it("runs on the real, NAV-derived universe only", () => {
    expect(universeMeta.provenance).toMatch(/AMFI/i);
    expect(funds.length).toBeGreaterThanOrEqual(50);
    // No synthetic/curated metrics are mixed in.
    expect(metricsOnlyCount).toBe(funds.length);
  });

  it("has unique ids and a resolvable lookup", () => {
    const ids = new Set(funds.map((f) => f.id));
    expect(ids.size).toBe(funds.length);
    expect(fundById(funds[0]!.id)?.id).toBe(funds[0]!.id);
    expect(fundById("does-not-exist")).toBeUndefined();
  });

  it("maps every fund to the canonical sleeve for its SEBI category", () => {
    for (const f of funds) {
      expect(f.sleeve).toBe(CATEGORY_TO_SLEEVE[f.category]);
    }
  });

  it("keeps costs/turnover in a sane range and all funds metrics-only", () => {
    for (const f of funds) {
      expect(f.portfolioTurnoverPct).toBeGreaterThanOrEqual(0);
      expect(f.portfolioTurnoverPct).toBeLessThanOrEqual(1000);
      expect(f.dataQuality).toBe("metrics-only");
    }
  });

  it("derives a verdict for every fund (no stored verdicts)", () => {
    const universe = screenedUniverse();
    expect(universe).toHaveLength(funds.length);
    for (const { result } of universe) {
      expect(["QUALIFIED", "WATCHLIST", "REJECT"]).toContain(result.verdict);
      expect(result.results).toHaveLength(5);
    }
  });

  it("has at least one selectable fund in every preset sleeve", () => {
    const selectableSleeves = new Set(
      screenedUniverse()
        .filter((u) => u.result.verdict !== "REJECT")
        .map((u) => u.fund.sleeve),
    );
    for (const sleeve of ["flexi", "large", "mid", "baf", "debt", "gold"] as const) {
      expect(selectableSleeves.has(sleeve), `no selectable fund in sleeve ${sleeve}`).toBe(true);
    }
  });
});

describe("curriculum", () => {
  it("has twelve modules in order", () => {
    expect(courseModules).toHaveLength(12);
    courseModules.forEach((m, i) => expect(m.order).toBe(i + 1));
  });

  it("cites source lectures on every module", () => {
    for (const m of courseModules) {
      expect(m.citations.length).toBeGreaterThan(0);
      for (const c of m.citations) {
        expect(c.lectureId).toMatch(/^L\d/);
        expect(c.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("points every module at a real lab or none", () => {
    const labs = new Set(["allocation", "tvm", "screener", "diligence", "none"]);
    for (const m of courseModules) {
      expect(labs.has(m.lab)).toBe(true);
      expect(m.formulas.length).toBeGreaterThan(0);
    }
  });
});

describe("generated universe", () => {
  it("contains ranked, metrics-only funds from the live pipeline", () => {
    expect(metricsOnlyCount).toBeGreaterThan(0);
    expect(universeMeta.asOf).toMatch(/\d{4}-\d{2}-\d{2}/);
    const generated = funds.filter((f) => f.dataQuality === "metrics-only");
    for (const f of generated) {
      expect(f.rankInCategory).toBeGreaterThanOrEqual(1);
      expect(f.rankInCategory).toBeLessThanOrEqual(12);
      expect(f.rolling.beatBenchmarkPct).toBeGreaterThanOrEqual(0);
      expect(f.rolling.beatBenchmarkPct).toBeLessThanOrEqual(100);
      expect(f.risk.stdDevPct).toBeGreaterThanOrEqual(0);
    }
  });

  it("covers the major categories with a real peer group", () => {
    for (const category of [
      "Flexi Cap",
      "Large Cap",
      "Mid Cap",
      "Small Cap",
      "Balanced Advantage",
      "Arbitrage",
    ]) {
      const count = funds.filter((f) => f.category === category).length;
      expect(count, `${category} count`).toBeGreaterThanOrEqual(12);
    }
  });
});

describe("agents", () => {
  it("has five agents with allocations summing to 100", () => {
    expect(agents).toHaveLength(5);
    for (const a of agents) {
      const total = SLEEVE_KEYS.reduce((s, k) => s + a.allocation[k], 0);
      expect(total).toBe(100);
    }
  });
});
