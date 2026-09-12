import { describe, expect, it } from "vitest";
import {
  estimatePortfolioTax,
  estimateTax,
  TAX_RULES,
  taxAssetClass,
} from "./tax";
import { makeFund } from "./factories";

describe("taxAssetClass", () => {
  it("classifies SEBI categories", () => {
    expect(taxAssetClass("Flexi Cap")).toBe("equity");
    expect(taxAssetClass("Arbitrage")).toBe("equity");
    expect(taxAssetClass("Balanced Advantage")).toBe("equity");
    expect(taxAssetClass("Gold / Commodity")).toBe("gold");
  });
});

describe("estimateTax", () => {
  it("equity LTCG applies the ₹1.25L exemption then 12.5%", () => {
    const r = estimateTax({ gain: 325_000, holdingMonths: 24, assetClass: "equity" });
    expect(r.gainType).toBe("LTCG");
    expect(r.exemptionUsed).toBe(TAX_RULES.equityLtcgExemption);
    expect(r.taxableGain).toBe(200_000);
    expect(r.tax).toBeCloseTo(25_000, 6); // 200k * 12.5%
  });

  it("equity STCG is 20%", () => {
    const r = estimateTax({ gain: 100_000, holdingMonths: 6, assetClass: "equity" });
    expect(r.gainType).toBe("STCG");
    expect(r.tax).toBeCloseTo(20_000, 6);
  });

  it("respects an already-used LTCG exemption", () => {
    const r = estimateTax({
      gain: 200_000,
      holdingMonths: 30,
      assetClass: "equity",
      ltcgExemptionUsed: 125_000,
    });
    expect(r.exemptionUsed).toBe(0);
    expect(r.tax).toBeCloseTo(25_000, 6);
  });

  it("gold uses LTCG after 24 months, slab before", () => {
    expect(estimateTax({ gain: 100_000, holdingMonths: 36, assetClass: "gold" }).gainType).toBe(
      "LTCG",
    );
    expect(
      estimateTax({ gain: 100_000, holdingMonths: 12, assetClass: "gold", slabRatePct: 30 }).tax,
    ).toBeCloseTo(30_000, 6);
  });

  it("debt is slab-taxed regardless of holding period", () => {
    const r = estimateTax({ gain: 100_000, holdingMonths: 60, assetClass: "debt", slabRatePct: 30 });
    expect(r.gainType).toBe("SLAB");
    expect(r.tax).toBeCloseTo(30_000, 6);
  });

  it("never taxes a loss", () => {
    const r = estimateTax({ gain: -50_000, holdingMonths: 24, assetClass: "equity" });
    expect(r.tax).toBe(0);
  });
});

describe("estimatePortfolioTax", () => {
  it("splits gain by fund class and totals the tax", () => {
    const equity = makeFund({ id: "e", category: "Flexi Cap" });
    const gold = makeFund({ id: "g", category: "Gold / Commodity", sleeve: "gold" });
    const r = estimatePortfolioTax(
      [
        { fund: equity, weightPct: 80 },
        { fund: gold, weightPct: 20 },
      ],
      1_000_000,
      36,
      { slabRatePct: 30 },
    );
    expect(r.totalGain).toBe(1_000_000);
    // Equity 800k LTCG: (800k - 125k) * 12.5% = 84,375. Gold 200k * 12.5% = 25,000.
    expect(r.totalTax).toBeCloseTo(109_375, 0);
    expect(r.postTaxGain).toBeCloseTo(1_000_000 - 109_375, 0);
  });
});
