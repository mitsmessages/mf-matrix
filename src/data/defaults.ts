import { screenedUniverse } from "./funds";
import { SLEEVE_KEYS } from "@/domain/finance/sleeves";
import type { SleeveKey } from "@/domain/finance/sleeves";
import type { Selections } from "@/domain/finance/types";
import { ALLOCATION_PRESETS } from "@/domain/finance/sleeves";
import { DEFAULT_TVM } from "@/domain/finance/tvm";
import type { TvmInput } from "@/domain/finance/tvm";

/** Preferred first pick per sleeve, overridden if it is not deployable. */
const PREFERRED: Partial<Record<SleeveKey, string>> = {
  flexi: "ppfc-01",
  mid: "motilal-mc-01",
  debt: "kotak-arb-01",
  gold: "nippon-gold-01",
  baf: "hdfc-baf-01",
};

function bestFundIdForSleeve(sleeve: SleeveKey): string | undefined {
  const pool = screenedUniverse().filter((u) => u.fund.sleeve === sleeve);
  if (pool.length === 0) return undefined;
  const preferred = PREFERRED[sleeve];
  const preferredEntry = pool.find((u) => u.fund.id === preferred);
  if (preferredEntry && preferredEntry.result.verdict !== "REJECT") return preferredEntry.fund.id;
  const qualified = pool.find((u) => u.result.verdict === "QUALIFIED");
  if (qualified) return qualified.fund.id;
  const selectable = pool.find((u) => u.result.verdict === "WATCHLIST");
  return (selectable ?? pool[0])!.fund.id;
}

export function defaultSelections(): Selections {
  const out: Selections = {};
  for (const sleeve of SLEEVE_KEYS) {
    const id = bestFundIdForSleeve(sleeve);
    if (id) out[sleeve] = [id];
  }
  return out;
}

export const DEFAULT_LUMP_SUM = 1_000_000;
export const DEFAULT_BAND_PCT = 5;

export const defaultTvmInput = (): TvmInput => ({ ...DEFAULT_TVM });

export const defaultWeights = () => ({ ...ALLOCATION_PRESETS.aggressive.enhanced.weights });
