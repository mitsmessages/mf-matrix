import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Printer, Trash2, Wallet } from "lucide-react";
import { funds } from "@/data/funds";
import { SLEEVES, SLEEVE_KEYS } from "@/domain/finance/sleeves";
import type { SleeveKey } from "@/domain/finance/sleeves";
import { aggregateLots, computeDrift, matchFund, type Lot } from "@/domain/finance/portfolio-holdings";
import { useProfile } from "@/store/profile";
import { formatCompactINR, formatINR, formatPct } from "@/lib/format";
import { Badge, Button, Callout, Card, SectionTitle, StatCard } from "@/components/ui/primitives";
import { Term } from "@/components/ui/Term";

const todayISO = () => new Date().toISOString().slice(0, 10);

/** Same key aggregation uses, so removal targets the right lots. */
const keyOfLot = (lot: Lot): string => {
  const fund = lot.schemeId
    ? funds.find((f) => f.id === lot.schemeId)
    : matchFund(lot.schemeName, funds);
  return fund?.id ?? `manual:${lot.schemeName.trim().toLowerCase()}`;
};

export default function PortfolioPage() {
  const lots = useProfile((s) => s.lots);
  const addLot = useProfile((s) => s.addLot);
  const removeLot = useProfile((s) => s.removeLot);
  const clearLots = useProfile((s) => s.clearLots);
  const weights = useProfile((s) => s.weights);
  const bandPct = useProfile((s) => s.bandPct);

  const [schemeName, setSchemeName] = useState("");
  const [units, setUnits] = useState("");
  const [nav, setNav] = useState("");
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);

  const holdings = useMemo(() => aggregateLots(lots, funds), [lots]);

  const totals = useMemo(() => {
    const invested = holdings.reduce((s, h) => s + h.invested, 0);
    const currentValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const pnl = currentValue - invested;
    return {
      invested,
      currentValue,
      pnl,
      pnlPct: invested > 0 ? (pnl / invested) * 100 : 0,
    };
  }, [holdings]);

  const target = useMemo(() => {
    const total = SLEEVE_KEYS.reduce((s, k) => s + (weights[k] ?? 0), 0) || 100;
    const out = {} as Record<SleeveKey, number>;
    for (const k of SLEEVE_KEYS) out[k] = ((weights[k] ?? 0) / total) * 100;
    return out;
  }, [weights]);

  const drift = useMemo(() => computeDrift(holdings, target, bandPct), [holdings, target, bandPct]);

  const submit = () => {
    const u = Number(units);
    const n = Number(nav);
    if (!schemeName.trim() || !u || u <= 0 || !n || n <= 0) {
      setError("Enter a scheme name, units and purchase NAV (both greater than zero).");
      return;
    }
    const lot: Lot = {
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      schemeName: schemeName.trim(),
      units: u,
      navAtPurchase: n,
      date: date || todayISO(),
    };
    addLot(lot);
    setSchemeName("");
    setUnits("");
    setNav("");
    setError(null);
  };

  return (
    <div className="space-y-5">
      <Card className="no-print flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <Badge tone="brand" className="mb-1">
              My portfolio
            </Badge>
            <h1 className="font-serif text-lg font-bold text-white">Holdings, P&amp;L and drift</h1>
            <p className="max-w-2xl text-xs text-stone-400">
              Add your mutual funds (manually, or lots from a CAS statement). Multiple lots of the
              same scheme blend into one average cost, valued at the latest real NAV.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </Button>
          {lots.length > 0 ? (
            <Button variant="ghost" onClick={clearLots}>
              Clear all
            </Button>
          ) : null}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Invested" value={formatCompactINR(totals.invested)} />
        <StatCard label="Current value" value={formatCompactINR(totals.currentValue)} />
        <StatCard
          label="Unrealised P&L"
          value={formatCompactINR(totals.pnl)}
          tone={totals.pnl >= 0 ? "success" : "danger"}
          hint={<Term term="pnl" />}
        />
        <StatCard label="P&L %" value={formatPct(totals.pnlPct, 2)} tone={totals.pnlPct >= 0 ? "success" : "danger"} />
      </div>

      <Card className="no-print p-5">
        <SectionTitle eyebrow="Add holding" title="Add a lot" hint="Paste scheme names from your statement; matching is automatic." />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="text-xs font-medium text-stone-700" htmlFor="scheme">
              Scheme name
            </label>
            <input
              id="scheme"
              list="fund-list"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              placeholder="e.g. Parag Parikh Flexi Cap Fund"
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
            <datalist id="fund-list">
              {funds.map((f) => (
                <option key={f.id} value={f.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700" htmlFor="units">
              Units
            </label>
            <input
              id="units"
              type="number"
              min="0"
              step="0.001"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700" htmlFor="nav">
              Purchase NAV (₹)
            </label>
            <input
              id="nav"
              type="number"
              min="0"
              step="0.0001"
              value={nav}
              onChange={(e) => setNav(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700" htmlFor="date">
              Purchase date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <Button variant="accent" onClick={submit} className="w-full">
              Add lot
            </Button>
          </div>
        </div>
        {error ? (
          <Callout tone="danger" className="mt-3">
            {error}
          </Callout>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-stone-200 p-4">
          <SectionTitle eyebrow="Holdings" title={`${holdings.length} schemes`} hint="Weighted average cost across all lots, valued at the latest real NAV." />
        </div>
        {holdings.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">
            No holdings yet. Add a lot above, or plan a portfolio in{" "}
            <Link className="underline" to="/allocation">
              Stage 1
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
                <tr>
                  <th className="px-3 py-2.5">Scheme</th>
                  <th className="px-3 py-2.5 text-right">Units</th>
                  <th className="px-3 py-2.5 text-right">Avg cost</th>
                  <th className="px-3 py-2.5 text-right">Current NAV</th>
                  <th className="px-3 py-2.5 text-right">Value</th>
                  <th className="px-3 py-2.5 text-right">P&amp;L</th>
                  <th className="px-3 py-2.5 no-print" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {holdings.map((h) => (
                  <tr key={h.key} className="hover:bg-stone-50">
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-stone-900">{h.schemeName}</div>
                      <div className="text-[10px] text-stone-500">
                        {h.mapped ? (
                          <Badge tone="success">{SLEEVES[h.sleeve!].shortLabel}</Badge>
                        ) : (
                          <Badge tone="warning">unmatched</Badge>
                        )}{" "}
                        NAV source: {h.navSource === "live" ? "live" : "last lot"}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono">{h.units}</td>
                    <td className="px-3 py-2.5 text-right font-mono">
                      <Term term="avgCost" /> {h.avgCost.toFixed(4)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono">{h.currentNav.toFixed(4)}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold">{formatINR(h.currentValue)}</td>
                    <td className={`px-3 py-2.5 text-right font-mono font-semibold ${h.pnl >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {formatINR(h.pnl)}
                      <span className="block text-[10px] font-normal">{formatPct(h.pnlPct, 2)}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right no-print">
                      <button
                        type="button"
                        aria-label={`Remove ${h.schemeName}`}
                        onClick={() => lots.filter((l) => keyOfLot(l) === h.key).forEach((l) => removeLot(l.id))}
                        className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-rose-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <SectionTitle
          eyebrow="Drift"
          title={`Rebalancing drift vs target (±${bandPct}% band)`}
          hint="Live allocation by sleeve against your Stage 1 target."
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
              <tr>
                <th className="px-3 py-2">Sleeve</th>
                <th className="px-3 py-2 text-right">Current</th>
                <th className="px-3 py-2 text-right">Target</th>
                <th className="px-3 py-2 text-right">
                  <Term term="drift" /> Drift
                </th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {drift.rows.map((r) => (
                <tr key={r.sleeve} className="hover:bg-stone-50">
                  <td className="px-3 py-2 font-semibold text-stone-900">{SLEEVES[r.sleeve].label}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatPct(r.currentPct, 1)}</td>
                  <td className="px-3 py-2 text-right font-mono text-stone-500">{formatPct(r.targetPct, 1)}</td>
                  <td className={`px-3 py-2 text-right font-mono font-semibold ${Math.abs(r.driftPct) > bandPct ? "text-amber-700" : "text-stone-600"}`}>
                    {r.driftPct > 0 ? "+" : ""}
                    {formatPct(r.driftPct, 1)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Badge tone={r.action === "SELL" ? "danger" : r.action === "BUY" ? "success" : "neutral"}>
                      {r.action}
                    </Badge>
                  </td>
                </tr>
              ))}
              {drift.rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-stone-400">
                    Add holdings to see drift.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <Callout tone={drift.triggered ? "warning" : "success"} className="mt-3">
          {drift.triggered
            ? `Rebalance triggered — max drift ${formatPct(drift.maxDriftPct, 1)} exceeds the ±${bandPct}% band.`
            : "Within the band. Next review: annual."}
          {drift.unmappedValue > 0
            ? ` ${formatCompactINR(drift.unmappedValue)} could not be mapped to a sleeve (excluded from drift).`
            : ""}
        </Callout>
      </Card>

      <p className="text-center text-[10px] text-stone-400">
        Educational tool · P&amp;L uses the latest real NAV from the universe feed · Not investment advice.
      </p>
    </div>
  );
}
