import { describe, expect, it } from "vitest";
import {
  activeSleeveKeys,
  aggregateHoldings,
  deploymentPlan,
  normalisedSleeveWeights,
  resolveHoldings,
  tierBreakdown,
} from "./lookthrough";
import { makeFund } from "./factories";
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

const funds = [
  makeFund({ id: "f1", shortName: "F1", category: "Flexi Cap" }),
  makeFund({ id: "f2", shortName: "F2", category: "Flexi Cap" }),
  makeFund({ id: "d1", shortName: "D1", category: "Arbitrage", sleeve: "debt" }),
];

describe("normalisedSleeveWeights", () => {
  it("re-normalises only active sleeves to 100", () => {
    const weights = W({ flexi: 40, mid: 25, large: 15, debt: 12, gold: 8 });
    const selections: Selections = { flexi: ["f1"], debt: ["d1"] };
    const n = normalisedSleeveWeights(weights, selections);
    expect(n.flexi + n.debt).toBeCloseTo(100, 6);
    expect(n.flexi).toBeCloseTo((40 / 52) * 100, 6);
    expect(n.mid).toBe(0);
  });

  it("returns zero when nothing is selected", () => {
    const n = normalisedSleeveWeights(W({ flexi: 100 }), {});
    expect(Object.values(n).every((v) => v === 0)).toBe(true);
  });

  it("lists active sleeves only", () => {
    const weights = W({ flexi: 40, debt: 12 });
    expect(activeSleeveKeys(weights, { flexi: ["f1"], debt: ["d1"] })).toEqual(["flexi", "debt"]);
    expect(activeSleeveKeys(weights, { flexi: ["f1"] })).toEqual(["flexi"]);
  });
});

describe("resolveHoldings", () => {
  it("splits a sleeve equally across its selected funds", () => {
    const weights = W({ flexi: 100 });
    const h = resolveHoldings(weights, { flexi: ["f1", "f2"] }, funds);
    expect(h).toHaveLength(2);
    expect(h[0]?.weightPct).toBeCloseTo(50, 6);
    expect(h[1]?.weightPct).toBeCloseTo(50, 6);
  });
});

describe("tierBreakdown", () => {
  it("blends fund market-cap mixes to 100", () => {
    const h = resolveHoldings(W({ flexi: 100 }), { flexi: ["f1"] }, funds);
    const t = tierBreakdown(h);
    const total = t.largeCap + t.midCap + t.smallCap + t.cashDebt + t.commodity;
    expect(total).toBeCloseTo(100, 1);
  });
});

describe("deploymentPlan", () => {
  it("allocates lump sum and SIP proportionally with no void", () => {
    const weights = W({ flexi: 40, debt: 12, mid: 48 });
    const selections: Selections = { flexi: ["f1", "f2"], debt: ["d1"] };
    const plan = deploymentPlan(weights, selections, funds, 1_000_000, 84_407);
    const lumpTotal = plan.reduce((s, r) => s + r.lumpSum, 0);
    const sipTotal = plan.reduce((s, r) => s + r.monthlySip, 0);
    expect(Math.abs(lumpTotal - 1_000_000)).toBeLessThanOrEqual(plan.length);
    expect(Math.abs(sipTotal - 84_407)).toBeLessThanOrEqual(plan.length);
    const f1 = plan.find((r) => r.fund.id === "f1")!;
    expect(f1.splitNote).toContain("split");
  });
});

describe("aggregateHoldings", () => {
  it("converts a stock's fund weight into rupee allocations", () => {
    const f = makeFund({
      id: "solo",
      topHoldings: [
        {
          name: "HDFC Bank",
          ticker: "HDFCBANK",
          sector: "Financials",
          weightPct: 10,
          valuationMetric: "PB",
          metricValue: 2.7,
          marketPrice: 1680,
          marketCapTier: "Large Cap",
          rationale: "",
        },
      ],
    });
    const agg = aggregateHoldings([{ fund: f, weightPct: 100 }], 100_000, 10_000);
    expect(agg[0]?.weightPct).toBeCloseTo(10, 6);
    expect(agg[0]?.monthlySip).toBe(1000);
    expect(agg[0]?.lumpSum).toBe(10000);
  });
});
