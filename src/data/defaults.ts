import { screenedUniverse } from "./funds";
import { SLEEVE_KEYS } from "@/domain/finance/sleeves";
import type { SleeveKey } from "@/domain/finance/sleeves";
import type { Selections } from "@/domain/finance/types";
import { ALLOCATION_PRESETS } from "@/domain/finance/sleeves";
import { DEFAULT_TVM } from "@/domain/finance/tvm";
import type { TvmInput } from "@/domain/finance/tvm";

/**
 * Default pick per sleeve: the highest-ranked QUALIFIED fund, else the highest
 * WATCHLIST, else the top-ranked fund. Real data only.
 */
/**
 * Soft downside preference: ranks are upside-heavy, so for a DEFAULT pick we
 * prefer a fund whose down-capture is at or near the limit (allowing a small
 * breach), rather than one that materially amplifies falls. Safety leads the
 * default; the ranked list still shows the upside leaders.
 */
const SOFT_DOWN_CAPTURE_LIMIT = 90;

function bestFundIdForSleeve(sleeve: SleeveKey): string | undefined {
  const pool = screenedUniverse()
    .filter((u) => u.fund.sleeve === sleeve)
    .sort((a, b) => (a.fund.rankInCategory ?? 99) - (b.fund.rankInCategory ?? 99));
  if (pool.length === 0) return undefined;

  const qualified = pool.filter((u) => u.result.verdict === "QUALIFIED");
  const candidates = qualified.length > 0 ? qualified : pool.filter((u) => u.result.verdict === "WATCHLIST");
  if (candidates.length === 0) return pool[0]!.fund.id;

  const safe = candidates.find((u) => u.fund.risk.downCapturePct <= SOFT_DOWN_CAPTURE_LIMIT);
  return (safe ?? candidates[0]!).fund.id;
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
