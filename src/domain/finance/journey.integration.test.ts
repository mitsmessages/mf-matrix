/**
 * Journey integration / "human agent" simulation.
 *
 * Walks thousands of realistic user combinations (risk profile × model ×
 * perturbed weights × random fund selections × random goals) and asserts the
 * engine never produces NaN, never loses money, always sums to 100, and never
 * contradicts itself across stages.
 */
import { describe, expect, it } from "vitest";
import { ALLOCATION_PRESETS, SLEEVE_KEYS } from "./sleeves";
import type { RiskProfile, AllocationModel, SleeveKey } from "./sleeves";
import type { Selections, SleeveWeights } from "./types";
import { screenedUniverse } from "@/data/funds";
import { runScreener } from "./screener";
import {
  activeSleeveKeys,
  aggregateHoldings,
  deploymentPlan,
  normalisedSleeveWeights,
  resolveHoldings,
  tierBreakdown,
} from "./lookthrough";
import {
  blendedCapture,
  crashStress,
  CRASH_SCENARIOS,
  portfolioVolatility,
  stockOverlap,
  summariseRisk,
  topConcentration,
} from "./portfolio";
import { buildRebalancePlan } from "./rebalance";
import { buildSynthesis } from "./synthesis";
import { solveTvm, type TvmInput } from "./tvm";
import { balanceWeightsTo100 } from "./sleeves";

/* ------------------------------------------------------- seeded PRNG ---- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260912);
const int = (maxExclusive: number) => Math.floor(rand() * maxExclusive);
const pick = <T,>(arr: T[]): T => {
  if (arr.length === 0) throw new Error("pick from empty");
  return arr[int(arr.length)]!;
};

/* ------------------------------------------------------------- helpers -- */

const universe = screenedUniverse();
const bySleeve = new Map<SleeveKey, typeof universe>();
for (const key of SLEEVE_KEYS) bySleeve.set(key, universe.filter((u) => u.fund.sleeve === key));

function randomWeights(): SleeveWeights {
  const out = {} as SleeveWeights;
  for (const k of SLEEVE_KEYS) out[k] = rand() < 0.25 ? 0 : int(80);
  return out;
}

function randomSelections(): Selections {
  const out: Selections = {};
  for (const k of SLEEVE_KEYS) {
    const pool = bySleeve.get(k) ?? [];
    const n = int(4); // 0..3 funds
    const ids = new Set<string>();
    for (let i = 0; i < n && pool.length > 0; i++) ids.add(pick(pool).fund.id);
    if (ids.size > 0) out[k] = [...ids];
  }
  return out;
}

function randomTvm(): TvmInput {
  return {
    goalName: "Sim",
    targetToday: 250_000 + int(40) * 500_000,
    horizonYears: 1 + int(30),
    inflationPct: 0 + (int(48) * 0.25),
    expectedReturnPct: 0 + int(20),
    expenseRatioPct: int(20) * 0.1,
    existingLumpSum: int(50) * 100_000,
    stepUpPct: int(11),
    taxEnabled: rand() < 0.5,
    taxRatePct: rand() < 0.5 ? 12.5 : 30,
  };
}

function expectFinite(value: number, label: string) {
  if (!Number.isFinite(value)) throw new Error(`non-finite ${label}: ${value}`);
}

/* ---------------------------------------------------------------- tests -- */

const PRESETS: [RiskProfile, AllocationModel][] = [
  ["aggressive", "baseline"],
  ["aggressive", "enhanced"],
  ["moderate", "baseline"],
  ["moderate", "enhanced"],
  ["conservative", "baseline"],
  ["conservative", "enhanced"],
];

describe("human-agent simulation: allocation presets", () => {
  it.each(PRESETS)("%s / %s preset produces a sane 100%% portfolio", (profile, model) => {
    const weights = ALLOCATION_PRESETS[profile][model].weights;
    const total = SLEEVE_KEYS.reduce((s, k) => s + weights[k], 0);
    expect(total).toBe(100);
    const risk = summariseRisk(weights);
    expectFinite(risk.expectedCagrPct, "cagr");
    expectFinite(risk.portfolioVolPct, "vol");
    expect(risk.portfolioVolPct).toBeGreaterThan(0);
    expect(risk.expectedCagrPct).toBeGreaterThan(4);
  });
});

describe("human-agent simulation: 1200 random portfolios", () => {
  it("keeps every derived quantity finite and internally consistent", () => {
    for (let iter = 0; iter < 1200; iter++) {
      const weights = randomWeights();
      const selections = randomSelections();
      const lumpSum = int(60) * 100_000;
      const sip = 5_000 + int(30) * 5_000;

      const active = activeSleeveKeys(weights, selections);
      const normalised = normalisedSleeveWeights(weights, selections);
      const normTotal = SLEEVE_KEYS.reduce((s, k) => s + normalised[k], 0);

      if (active.length > 0) {
        expect(normTotal).toBeCloseTo(100, 6);
      } else {
        expect(normTotal).toBe(0);
      }

      const holdings = resolveHoldings(weights, selections, universe.map((u) => u.fund));
      const holdingTotal = holdings.reduce((s, h) => s + h.weightPct, 0);
      if (holdings.length > 0) expect(holdingTotal).toBeCloseTo(100, 6);

      const tier = tierBreakdown(holdings);
      const tierTotal = tier.largeCap + tier.midCap + tier.smallCap + tier.cashDebt + tier.commodity;
      if (holdings.length > 0) {
        expectFinite(tierTotal, `tier total iter ${iter}`);
        expect(Math.abs(tierTotal - 100)).toBeLessThanOrEqual(0.6);
      }

      const deployment = deploymentPlan(weights, selections, universe.map((u) => u.fund), lumpSum, sip);
      const depSum = deployment.reduce((s, r) => s + r.lumpSum, 0);
      const sipSum = deployment.reduce((s, r) => s + r.monthlySip, 0);
      if (deployment.length > 0) {
        expect(Math.abs(depSum - lumpSum)).toBeLessThanOrEqual(deployment.length);
        expect(Math.abs(sipSum - sip)).toBeLessThanOrEqual(deployment.length);
      }

      const agg = aggregateHoldings(holdings, lumpSum, sip);
      if (agg.length > 0) {
        // Look-through covers only the disclosed top holdings, so it is a
        // subset of the portfolio: positive, and never above the total.
        const aggSum = agg.reduce((s, h) => s + h.weightPct, 0);
        expect(aggSum).toBeGreaterThan(0);
        expect(aggSum).toBeLessThanOrEqual(holdingTotal + 0.5);
        for (const h of agg) {
          expectFinite(h.monthlySip, "agg sip");
          expectFinite(h.lumpSum, "agg lump");
        }
      }

      const capture = blendedCapture(holdings);
      expectFinite(capture.downCapturePct, "down capture");
      const overlap = stockOverlap(holdings);
      expectFinite(overlap.overlapPct, "overlap");
      expectFinite(topConcentration(holdings), "concentration");

      const crashes = CRASH_SCENARIOS.map((s) => crashStress(holdings, s));
      for (const c of crashes) {
        expectFinite(c.portfolioPct, "crash portfolio");
        expectFinite(c.protectedPct, "crash protected");
      }

      const risk = summariseRisk(weights);
      expectFinite(portfolioVolatility(weights), "portfolio vol");

      const target = normalised;
      const rebalance = buildRebalancePlan(
        Object.fromEntries(active.map((k) => [k, (normalised[k] / 100) * lumpSum])),
        target,
        lumpSum,
        5,
      );
      expect(rebalance.actions.length).toBe(active.length);
      for (const a of rebalance.actions) {
        expectFinite(a.amountRupees, `rebalance ${a.sleeve}`);
        expectFinite(a.driftPct, `drift ${a.sleeve}`);
      }

      const synthesis = buildSynthesis({
        parts: holdings.map((h) => ({ weightPct: h.weightPct, result: runScreener(h.fund) })),
        capture,
        overlap,
        crash: crashes,
        risk,
        rebalance,
        activeSleeves: active.length,
        filledSleeves: active.filter((k) => (selections[k]?.length ?? 0) > 0).length,
      });
      expectFinite(synthesis.score, "synthesis score");
      expect(synthesis.score).toBeGreaterThanOrEqual(0);
      expect(synthesis.score).toBeLessThanOrEqual(100);
      for (const p of synthesis.pillars) {
        expectFinite(p.score, `pillar ${p.id}`);
        expect(p.score).toBeGreaterThanOrEqual(-0.001);
        expect(p.score).toBeLessThanOrEqual(p.max + 0.001);
      }
    }
  });

  it("never throws with empty selections", () => {
    const weights = ALLOCATION_PRESETS.moderate.enhanced.weights;
    const holdings = resolveHoldings(weights, {}, universe.map((u) => u.fund));
    expect(holdings).toHaveLength(0);
    const synth = buildSynthesis({
      parts: [],
      capture: blendedCapture([]),
      overlap: stockOverlap([]),
      crash: CRASH_SCENARIOS.map((s) => crashStress([], s)),
      risk: summariseRisk(weights),
      rebalance: buildRebalancePlan({}, weights, 0),
      activeSleeves: 0,
      filledSleeves: 0,
    });
    expectFinite(synth.score, "empty synth");
    // Score must be 0 when nothing is selected — never a phantom pass.
    expect(synth.score).toBe(0);
    expect(synth.verdict).toBe("NOT_READY");
  });
});

describe("human-agent simulation: balanceWeightsTo100", () => {
  it("always yields exactly 100 for arbitrary weights", () => {
    for (let i = 0; i < 500; i++) {
      const w = randomWeights();
      const balanced = balanceWeightsTo100(w);
      const total = SLEEVE_KEYS.reduce((s, k) => s + balanced[k], 0);
      expect(total).toBe(100);
      for (const k of SLEEVE_KEYS) expect(balanced[k]).toBeGreaterThanOrEqual(0);
    }
  });

  it("handles the all-zero case without producing a void", () => {
    const zero = {} as SleeveWeights;
    for (const k of SLEEVE_KEYS) zero[k] = 0;
    const balanced = balanceWeightsTo100(zero);
    expect(SLEEVE_KEYS.reduce((s, k) => s + balanced[k], 0)).toBe(100);
  });
});

describe("human-agent simulation: 600 random TVM goals", () => {
  it("solves finite, monotonic plans that meet the goal", () => {
    for (let iter = 0; iter < 600; iter++) {
      const input = randomTvm();
      const r = solveTvm(input);
      expectFinite(r.requiredMonthlySip, "sip");
      expectFinite(r.futureCostTarget, "future cost");
      expectFinite(r.postTaxValue, "post tax");
      expect(r.requiredMonthlySip).toBeGreaterThanOrEqual(0);
      expect(r.futureCostTarget).toBeGreaterThanOrEqual(input.targetToday - 0.01);
      expect(r.netReturnPct).toBeGreaterThanOrEqual(0);
      expect(r.schedule).toHaveLength(input.horizonYears);
      if (r.schedule.length > 1) {
        const first = r.schedule[0]!;
        const last = r.schedule[r.schedule.length - 1]!;
        expect(last.nominalValue).toBeGreaterThanOrEqual(first.nominalValue - 0.01);
        for (const row of r.schedule) {
          expectFinite(row.nominalValue, "schedule value");
          expectFinite(row.realValue, "schedule real");
        }
      }
      // If a SIP is required and the solver ran, the plan should reach the goal.
      if (r.requiredMonthlySip > 0) {
        const target = input.taxEnabled
          ? r.postTaxValue
          : r.finalValue;
        expect(target).toBeGreaterThanOrEqual(r.futureCostTarget * 0.999);
      }
    }
  });

  it("edge: zero horizon and zero target", () => {
    const r = solveTvm({
      goalName: "edge",
      targetToday: 0,
      horizonYears: 0,
      inflationPct: 0,
      expectedReturnPct: 0,
      expenseRatioPct: 5,
      existingLumpSum: 0,
      stepUpPct: 0,
      taxEnabled: false,
      taxRatePct: 0,
    });
    expectFinite(r.requiredMonthlySip, "zero sip");
    expect(r.schedule).toHaveLength(0);
  });
});

describe("human-agent simulation: cross-stage consistency", () => {
  it("every preset sleeve with weight > 0 has at least one selectable fund", () => {
    for (const [profile, model] of PRESETS) {
      const weights = ALLOCATION_PRESETS[profile][model].weights;
      for (const k of SLEEVE_KEYS) {
        if (weights[k] > 0) {
          const selectable = (bySleeve.get(k) ?? []).filter((u) => u.result.verdict !== "REJECT");
          expect(selectable.length, `${profile}/${model} sleeve ${k}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("selecting only REJECT funds yields a low, non-contradictory score", () => {
    const rejected = universe.filter((u) => u.result.verdict === "REJECT");
    if (rejected.length === 0) return;
    const selections: Selections = {};
    for (const u of rejected) {
      selections[u.fund.sleeve] = [...(selections[u.fund.sleeve] ?? []), u.fund.id];
    }
    const weights = ALLOCATION_PRESETS.aggressive.enhanced.weights;
    const holdings = resolveHoldings(weights, selections, universe.map((u) => u.fund));
    const risk = summariseRisk(weights);
    const rebalance = buildRebalancePlan({}, weights, 0);
    const synth = buildSynthesis({
      parts: holdings.map((h) => ({ weightPct: h.weightPct, result: runScreener(h.fund) })),
      capture: blendedCapture(holdings),
      overlap: stockOverlap(holdings),
      crash: CRASH_SCENARIOS.map((s) => crashStress(holdings, s)),
      risk,
      rebalance,
      activeSleeves: activeSleeveKeys(weights, selections).length,
      filledSleeves: Object.values(selections).filter((v) => (v?.length ?? 0) > 0).length,
    });
    expect(synth.verdict).not.toBe("READY");
    expect(synth.score).toBeLessThan(80);
  });
});
