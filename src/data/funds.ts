import rawDataset from "./funds.json";
import generatedDataset from "./universe.generated.json";
import changelogRaw from "./universe_changelog.json";
import { assertNoDerivedFields, datasetSchema } from "./schema";
import type { Fund, FundCategory } from "@/domain/finance/types";
import { runScreener } from "@/domain/finance/screener";

assertNoDerivedFields(rawDataset);
assertNoDerivedFields(generatedDataset);
const parsed = datasetSchema.parse(rawDataset);
const generated = datasetSchema.parse(generatedDataset);

/** Featured, hand-curated funds with full forensic data (holdings, managers). */
export const curatedFunds: Fund[] = parsed.funds;

export const datasetMeta = {
  asOf: parsed.asOf,
  provenance: parsed.provenance,
  note: parsed.note,
} as const;

export const universeMeta = {
  asOf: generated.asOf,
  provenance: generated.provenance,
  note: generated.note,
} as const;

/** Curated first, then the generated metrics-only universe (deduped by id). */
const seen = new Set(curatedFunds.map((f) => f.id));
export const funds: Fund[] = [
  ...curatedFunds,
  ...generated.funds.filter((f) => !seen.has(f.id)),
];

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
    { retained: UniverseChangelogEntry[]; newEntries: UniverseChangelogEntry[]; dropped: { code: number }[] }
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
