import { describe, expect, it } from "vitest";
import { evaluateScreening, runScreener, verdictFor } from "./screener";
import type { ScreeningMetrics } from "./screener";
import { makeFund } from "./factories";

const passing: ScreeningMetrics = {
  beatBenchmarkPct: 88,
  positivePct: 100,
  sortino: 1.94,
  alphaPct: 4.82,
  upCapturePct: 88.5,
  downCapturePct: 54.2,
  stdDevPct: 12,
};

describe("evaluateScreening", () => {
  it("rates an all-pass fund QUALIFIED 5/5", () => {
    const r = evaluateScreening(passing);
    expect(r.verdict).toBe("QUALIFIED");
    expect(r.score).toBe(5);
    expect(r.failed).toHaveLength(0);
    expect(r.primaryFailure).toBeUndefined();
  });

  it("fails Step 1 using the rolling beat rate, not the mean CAGR", () => {
    const r = evaluateScreening({ ...passing, beatBenchmarkPct: 60, positivePct: 100 });
    expect(r.verdict).toBe("WATCHLIST");
    expect(r.score).toBe(4);
    expect(r.primaryFailure?.id).toBe("rolling");
  });

  it("fails Step 1 when any rolling window was negative", () => {
    const r = evaluateScreening({ ...passing, beatBenchmarkPct: 90, positivePct: 40 });
    expect(r.score).toBe(4);
    expect(r.primaryFailure?.id).toBe("rolling");
  });

  it("fails the down-capture ceiling when above 75", () => {
    const r = evaluateScreening({ ...passing, downCapturePct: 82 });
    expect(r.score).toBe(4);
    expect(r.results.find((x) => x.id === "downCapture")?.passed).toBe(false);
  });

  it("rejects a fund failing three or more hurdles", () => {
    const r = evaluateScreening({
      ...passing,
      beatBenchmarkPct: 40,
      sortino: 0.8,
      alphaPct: -1,
    });
    expect(r.verdict).toBe("REJECT");
    expect(r.score).toBe(2);
  });

  it("boundary: sortino exactly at threshold fails (strictly greater)", () => {
    const r = evaluateScreening({ ...passing, sortino: 1.5 });
    expect(r.results.find((x) => x.id === "sortino")?.passed).toBe(false);
  });

  it("boundary: down-capture exactly 75 fails (must be strictly less)", () => {
    const r = evaluateScreening({ ...passing, downCapturePct: 75 });
    expect(r.results.find((x) => x.id === "downCapture")?.passed).toBe(false);
  });
});

describe("sleeve-aware screening profiles", () => {
  it("judges debt on stability, not equity capture", () => {
    const debt = makeFund({
      id: "arb",
      category: "Arbitrage",
      sleeve: "debt",
      rolling: { ...makeFund().rolling, beatBenchmarkPct: 96, positivePct: 100 },
      risk: {
        ...makeFund().risk,
        sortino: 3.4,
        alphaPct: 0.2,
        upCapturePct: 98,
        downCapturePct: 1.2,
        stdDevPct: 0.8,
      },
    });
    const result = runScreener(debt);
    expect(result.profile).toBe("debt");
    // Equity rules would not apply here (alpha 0.2 < 1.5, up 98 > 80 etc.).
    expect(result.verdict).toBe("QUALIFIED");
  });

  it("judges gold on crisis defence", () => {
    const gold = makeFund({
      id: "gold",
      category: "Gold / Commodity",
      sleeve: "gold",
      rolling: { ...makeFund().rolling, beatBenchmarkPct: 98, positivePct: 100 },
      risk: { ...makeFund().risk, sortino: 1.7, downCapturePct: 18, upCapturePct: 99, alphaPct: 2.1 },
    });
    const result = runScreener(gold);
    expect(result.profile).toBe("commodity");
    expect(result.verdict).toBe("QUALIFIED");
  });

  it("still rejects a weak small cap under equity rules", () => {
    const small = makeFund({
      id: "small",
      category: "Small Cap",
      sleeve: "small",
      rolling: { ...makeFund().rolling, beatBenchmarkPct: 71, positivePct: 92 },
      risk: { ...makeFund().risk, sortino: 1.38, alphaPct: 5.6, upCapturePct: 108, downCapturePct: 84 },
    });
    const result = runScreener(small);
    expect(result.profile).toBe("equity");
    expect(result.verdict).toBe("REJECT");
  });

  it("relaxes the down-capture ceiling for hybrids (BAF)", () => {
    const baf = makeFund({
      id: "baf",
      category: "Balanced Advantage",
      sleeve: "baf",
      rolling: { ...makeFund().rolling, beatBenchmarkPct: 78, positivePct: 100 },
      risk: { ...makeFund().risk, sortino: 1.6, alphaPct: 2.4, upCapturePct: 82, downCapturePct: 48 },
    });
    const result = runScreener(baf);
    expect(result.profile).toBe("hybrid");
    expect(result.verdict).toBe("QUALIFIED");
  });
});

describe("verdictFor", () => {
  it.each([
    [5, "QUALIFIED"],
    [4, "WATCHLIST"],
    [3, "WATCHLIST"],
    [2, "REJECT"],
    [0, "REJECT"],
  ] as const)("scores %i -> %s", (score, verdict) => {
    expect(verdictFor(score)).toBe(verdict);
  });
});
