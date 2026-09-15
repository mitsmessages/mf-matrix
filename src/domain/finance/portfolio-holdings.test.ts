import { describe, expect, it } from "vitest";
import { aggregateLots, computeDrift, matchFund, type Lot } from "./portfolio-holdings";
import { makeFund } from "./factories";
import type { SleeveKey } from "./sleeves";

const funds = [
  makeFund({ id: "boi", name: "BANK OF INDIA FLEXI CAP FUND - Direct Plan - Growth", shortName: "BOI Flexi", sleeve: "flexi", nav: 50 }),
  makeFund({ id: "ppfc", name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth", shortName: "PPFAS", sleeve: "flexi", nav: 80 }),
  makeFund({ id: "gold", name: "SBI GOLD FUND - Direct Plan - Growth", shortName: "SBI Gold", sleeve: "gold", nav: 40 }),
];

describe("matchFund", () => {
  it("matches messy names", () => {
    expect(matchFund("BANK OF INDIA FLEXI CAP FUND - Direct Plan - Growth", funds)?.id).toBe("boi");
    expect(matchFund("parag parikh flexi cap", funds)?.id).toBe("ppfc");
    expect(matchFund("Reliance something random", funds)).toBeUndefined();
    // Ambiguous partial names must NOT bind to the wrong fund.
    expect(matchFund("Axis Midcap", funds)).toBeUndefined();
    expect(matchFund("HDFC Balanced Advantage", funds)).toBeUndefined();
  });
});

describe("aggregateLots", () => {
  const lots: Lot[] = [
    { id: "1", schemeName: "BANK OF INDIA FLEXI CAP FUND - Direct Plan - Growth", units: 100, navAtPurchase: 40, date: "2024-01-01" },
    { id: "2", schemeName: "BANK OF INDIA FLEXI CAP FUND - Direct Plan - Growth", units: 100, navAtPurchase: 60, date: "2024-06-01" },
  ];

  it("blends multiple lots of the same scheme into a weighted average cost", () => {
    const [h] = aggregateLots(lots, funds);
    expect(h!.units).toBe(200);
    expect(h!.invested).toBe(10_000); // 100*40 + 100*60
    expect(h!.avgCost).toBe(50);
    expect(h!.currentNav).toBe(50); // live NAV
    expect(h!.currentValue).toBe(10_000);
    expect(h!.pnl).toBe(0);
  });

  it("computes P&L against the live NAV", () => {
    const [h] = aggregateLots([{ id: "1", schemeName: "SBI GOLD FUND", units: 100, navAtPurchase: 20, date: "2024-01-01" }], funds);
    expect(h!.currentNav).toBe(40);
    expect(h!.currentValue).toBe(4_000);
    expect(h!.pnl).toBe(2_000);
    expect(h!.pnlPct).toBe(100);
  });

  it("falls back to last-lot NAV for unmatched schemes", () => {
    const [h] = aggregateLots([{ id: "1", schemeName: "Some Unknown Fund", units: 10, navAtPurchase: 25, date: "2024-01-01" }], funds);
    expect(h!.mapped).toBe(false);
    expect(h!.navSource).toBe("last-lot");
    expect(h!.currentNav).toBe(25);
  });
});

describe("computeDrift", () => {
  const target = { flexi: 60, debt: 20, gold: 20 } as Record<SleeveKey, number> & Record<string, number>;
  const targetTyped = { flexi: 60, large: 0, mid: 0, small: 0, baf: 0, debt: 20, gold: 20 } as Record<SleeveKey, number>;

  it("flags a sleeve that drifted beyond the band", () => {
    const holdings = aggregateLots(
      [
        { id: "1", schemeName: "BANK OF INDIA FLEXI CAP FUND", units: 100, navAtPurchase: 50, date: "2024-01-01" }, // 5000 flexi
        { id: "2", schemeName: "SBI GOLD FUND", units: 25, navAtPurchase: 40, date: "2024-01-01" }, // 1000 gold
      ],
      funds,
    );
    const drift = computeDrift(holdings, targetTyped, 5);
    const flexi = drift.rows.find((r) => r.sleeve === "flexi")!;
    expect(flexi.currentPct).toBeCloseTo((5000 / 6000) * 100, 0);
    expect(flexi.driftPct).toBeCloseTo((5000 / 6000) * 100 - 60, 0);
    expect(drift.triggered).toBe(true);
  });

  it("holds when everything is on target", () => {
    const holdings = [
      { key: "f", schemeName: "F", sleeve: "flexi" as const, mapped: true, units: 1, invested: 6000, avgCost: 6000, currentNav: 6000, navSource: "live" as const, currentValue: 6000, pnl: 0, pnlPct: 0 },
      { key: "d", schemeName: "D", sleeve: "debt" as const, mapped: true, units: 1, invested: 2000, avgCost: 2000, currentNav: 2000, navSource: "live" as const, currentValue: 2000, pnl: 0, pnlPct: 0 },
      { key: "g", schemeName: "G", sleeve: "gold" as const, mapped: true, units: 1, invested: 2000, avgCost: 2000, currentNav: 2000, navSource: "live" as const, currentValue: 2000, pnl: 0, pnlPct: 0 },
    ];
    const drift = computeDrift(holdings, targetTyped, 5);
    expect(drift.triggered).toBe(false);
    void target;
  });
});
