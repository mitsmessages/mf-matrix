/**
 * User's own portfolio: manual / CAS-style lots blended into average cost,
 * P&L against the latest real NAV, and drift versus the Stage 1 target.
 *
 * Pure and framework-free. NAV comes from the live universe where a scheme
 * matches; otherwise the most recent lot's purchase NAV is used.
 */
import type { Fund } from "./types";
import type { SleeveKey } from "./sleeves";
import { round } from "./portfolio";

export interface Lot {
  id: string;
  schemeName: string;
  /** Matched universe fund id, if found. */
  schemeId?: string;
  units: number;
  navAtPurchase: number;
  date: string;
}

export interface AggregatedHolding {
  key: string;
  schemeName: string;
  schemeId?: string;
  sleeve?: SleeveKey;
  mapped: boolean;
  units: number;
  invested: number;
  avgCost: number;
  currentNav: number;
  navSource: "live" | "last-lot";
  currentValue: number;
  pnl: number;
  pnlPct: number;
}

const NOISE = new Set([
  "direct", "plan", "growth", "option", "regular", "fund", "scheme", "the", "and", "of", "idcw",
]);

const tokens = (name: string): Set<string> =>
  new Set(
    name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((t) => t && !NOISE.has(t)),
  );

/**
 * Match a user-typed scheme name to a universe fund. Deliberately strict:
 * it returns the fund only when the match is unambiguous (>=75% of the user's
 * distinctive tokens and at least two shared). Otherwise it returns undefined,
 * so the holding is treated as manual rather than bound to the WRONG fund
 * (which would corrupt P&L and drift).
 */
export function matchFund(name: string, funds: Fund[]): Fund | undefined {
  const a = tokens(name);
  if (a.size === 0) return undefined;
  let best: { fund: Fund; score: number; shared: number } | undefined;
  for (const fund of funds) {
    const b = tokens(`${fund.name} ${fund.shortName}`);
    let shared = 0;
    for (const t of a) if (b.has(t)) shared++;
    const score = shared / Math.max(a.size, 1);
    if (
      !best ||
      score > best.score ||
      (score === best.score && shared > best.shared)
    ) {
      best = { fund, score, shared };
    }
  }
  return best && best.score >= 0.75 && best.shared >= 2 ? best.fund : undefined;
}

export function aggregateLots(lots: Lot[], funds: Fund[]): AggregatedHolding[] {
  const groups = new Map<string, Lot[]>();
  for (const lot of lots) {
    const fund = lot.schemeId
      ? funds.find((f) => f.id === lot.schemeId)
      : matchFund(lot.schemeName, funds);
    const key = fund?.id ?? `manual:${lot.schemeName.trim().toLowerCase()}`;
    const list = groups.get(key) ?? [];
    list.push({ ...lot, ...(fund ? { schemeId: fund.id } : {}) });
    groups.set(key, list);
  }

  const out: AggregatedHolding[] = [];
  for (const [key, group] of groups) {
    const units = group.reduce((s, l) => s + l.units, 0);
    const invested = group.reduce((s, l) => s + l.units * l.navAtPurchase, 0);
    const fund = funds.find((f) => f.id === key);
    const lastLot = group.slice().sort((x, y) => (x.date < y.date ? 1 : -1))[0]!;
    const liveNav = fund && fund.nav > 0 ? fund.nav : null;
    const currentNav = liveNav ?? lastLot.navAtPurchase;
    const currentValue = units * currentNav;
    const pnl = currentValue - invested;
    out.push({
      key,
      schemeName: fund?.name ?? group[0]!.schemeName,
      ...(fund ? { schemeId: fund.id } : {}),
      ...(fund ? { sleeve: fund.sleeve } : {}),
      mapped: Boolean(fund),
      units: round(units, 3),
      invested: round(invested, 0),
      avgCost: units > 0 ? round(invested / units, 4) : 0,
      currentNav: round(currentNav, 4),
      navSource: liveNav !== null ? "live" : "last-lot",
      currentValue: round(currentValue, 0),
      pnl: round(pnl, 0),
      pnlPct: invested > 0 ? round((pnl / invested) * 100, 2) : 0,
    });
  }
  return out.sort((a, b) => b.currentValue - a.currentValue);
}

export interface DriftRow {
  sleeve: SleeveKey;
  currentPct: number;
  targetPct: number;
  driftPct: number;
  action: "BUY" | "SELL" | "HOLD";
}

export interface DriftResult {
  rows: DriftRow[];
  totalMapped: number;
  unmappedValue: number;
  maxDriftPct: number;
  triggered: boolean;
  bandPct: number;
}

export function computeDrift(
  holdings: AggregatedHolding[],
  target: Record<SleeveKey, number>,
  bandPct: number,
): DriftResult {
  const bySleeve = new Map<SleeveKey, number>();
  let unmappedValue = 0;
  for (const h of holdings) {
    if (!h.sleeve) {
      unmappedValue += h.currentValue;
      continue;
    }
    bySleeve.set(h.sleeve, (bySleeve.get(h.sleeve) ?? 0) + h.currentValue);
  }
  const totalMapped = [...bySleeve.values()].reduce((s, v) => s + v, 0);
  const targetTotal = Object.values(target).reduce((s, v) => s + v, 0) || 100;

  const sleeves = Object.keys(target) as SleeveKey[];
  const active = sleeves.filter((k) => (target[k] ?? 0) > 0 || (bySleeve.get(k) ?? 0) > 0);
  const rows: DriftRow[] = active.map((sleeve) => {
    const currentPct = totalMapped > 0 ? ((bySleeve.get(sleeve) ?? 0) / totalMapped) * 100 : 0;
    const targetPct = ((target[sleeve] ?? 0) / targetTotal) * 100;
    const driftPct = currentPct - targetPct;
    const action: DriftRow["action"] =
      driftPct > bandPct ? "SELL" : driftPct < -bandPct ? "BUY" : "HOLD";
    return {
      sleeve,
      currentPct: round(currentPct, 1),
      targetPct: round(targetPct, 1),
      driftPct: round(driftPct, 1),
      action,
    };
  });
  const maxDriftPct = rows.reduce((m, r) => Math.max(m, Math.abs(r.driftPct)), 0);
  return {
    rows,
    totalMapped: round(totalMapped, 0),
    unmappedValue: round(unmappedValue, 0),
    maxDriftPct: round(maxDriftPct, 1),
    triggered: rows.some((r) => r.action !== "HOLD"),
    bandPct,
  };
}
