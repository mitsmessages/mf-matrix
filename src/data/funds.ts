import generatedDataset from "./universe.generated.json";
import changelogRaw from "./universe_changelog.json";
import { assertNoDerivedFields, datasetSchema } from "./schema";
import type { Fund, FundCategory } from "@/domain/finance/types";
import { runScreener } from "@/domain/finance/screener";

/**
 * The app runs on the real, NAV-derived universe only. The former curated
 * synthetic dataset is intentionally NOT merged here (see README "Data &
 * sources"): mixing fabricated and real metrics in one journey was the biggest
 * credibility risk.
 */
assertNoDerivedFields(generatedDataset);
const generated = datasetSchema.parse(generatedDataset);

export const universeMeta = {
  asOf: generated.asOf,
  provenance: generated.provenance,
  note: generated.note,
} as const;

/** Per-category benchmark monthly returns (index-fund proxy or consensus). */
export const benchmarksByCategory: Record<
  string,
  { label: string; monthlyReturnsPct: Record<string, number> }
> = generated.benchmarks ?? {};

export const funds: Fund[] = generated.funds;

/** All funds are metrics-only (no holdings/TER/AUM/manager in the feeds). */
export const metricsOnlyCount = funds.filter((f) => f.dataQuality === "metrics-only").length;

export interface UniverseChangelogEntry {
  code: number;
  name?: string;
  rank?: number;
}
export interface UniverseChangelog {
  asOf: string;
  categories: Record<
    string,
    {
      retained: UniverseChangelogEntry[];
      newEntries: UniverseChangelogEntry[];
      dropped: { code: number }[];
    }
  >;
}

export const universeChangelog = changelogRaw as UniverseChangelog;

const index = new Map(funds.map((f) => [f.id, f]));

export const fundById = (id: string): Fund | undefined => index.get(id);

export const fundsBySleeve = (sleeve: Fund["sleeve"]): Fund[] =>
  funds.filter((f) => f.sleeve === sleeve);

export const CATALOG_CATEGORIES: FundCategory[] = [
  "Flexi Cap",
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "Balanced Advantage",
  "Arbitrage",
  "Gold / Commodity",
];

export interface ScreenedFund {
  fund: Fund;
  result: ReturnType<typeof runScreener>;
}

let screenedCache: ScreenedFund[] | null = null;

/** The whole universe with derived verdicts. Cached: derivation is pure. */
export function screenedUniverse(): ScreenedFund[] {
  if (!screenedCache) {
    screenedCache = funds.map((fund) => ({ fund, result: runScreener(fund) }));
  }
  return screenedCache;
}
