import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import {
  CATALOG_CATEGORIES,
  screenedUniverse,
  universeMeta,
  universeChangelog,
  metricsOnlyCount,
  funds,
} from "@/data/funds";
import { PROFILES, PROFILE_ORDER } from "@/domain/finance/thresholds";
import { metricValue, type ScreenerSortField } from "@/domain/finance/screener";
import type { Fund, HurdleResult } from "@/domain/finance/types";
import { useProfile } from "@/store/profile";
import { FactsheetModal } from "./FactsheetModal";
import { Badge, Button, Callout, Card, SectionTitle, Segmented } from "@/components/ui/primitives";
import { verdictTone } from "@/components/ui/verdict";
import { cn } from "@/lib/cn";

type StatusFilter = "ALL" | "QUALIFIED" | "WATCHLIST" | "REJECT";
type SortField = ScreenerSortField;

export default function ScreenerPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sortField, setSortField] = useState<SortField>("rolling");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [openFund, setOpenFund] = useState<Fund | null>(null);

  const selections = useProfile((s) => s.selections);
  const toggleFund = useProfile((s) => s.toggleFund);

  const rows = useMemo(() => {
    const universe = screenedUniverse();
    const filtered = universe.filter(({ fund, result }) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        fund.name.toLowerCase().includes(q) ||
        fund.shortName.toLowerCase().includes(q) ||
        fund.fundManager.toLowerCase().includes(q) ||
        fund.fundHouse.toLowerCase().includes(q);
      const matchesCategory = category === "All" || fund.category === category;
      const matchesStatus = status === "ALL" || result.verdict === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
    return filtered.sort((a, b) => {
      const av = metricValue(a.fund, sortField);
      const bv = metricValue(b.fund, sortField);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [query, category, status, sortField, sortDir]);

  const selectedCount = Object.values(selections).reduce((s, ids) => s + (ids?.length ?? 0), 0);

  const newEntries = useMemo(
    () =>
      Object.values(universeChangelog.categories).reduce((s, c) => s + c.newEntries.length, 0),
    [],
  );

  const onSort = (field: SortField) => {
    if (field === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <Badge tone="brand" className="mb-1">
              Stage 3 · Lessons 06–10
            </Badge>
            <h1 className="font-serif text-lg font-bold text-white">Five-hurdle fund screener</h1>
            <p className="max-w-2xl text-xs text-stone-400">
              Verdicts are derived live from raw metrics using one threshold source — the same rule
              everywhere in the app.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-stone-700 bg-stone-800/70 px-3 py-2 text-xs text-stone-300">
          <span className="font-bold text-white">{funds.length}</span> funds in universe ·{" "}
          <span className="font-bold text-white">{selectedCount}</span> selected
          <div className="mt-0.5 text-[10px] text-stone-400">
            Real NAV data as of {universeMeta.asOf} · {metricsOnlyCount} metrics-only
            {newEntries > 0 ? ` · ${newEntries} new this week` : ""}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROFILE_ORDER.map((profile) => (
          <Card key={profile} className="p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
              Screening profile
            </div>
            <div className="text-xs font-bold text-stone-900">{PROFILES[profile].label}</div>
            <div className="mt-0.5 text-[11px] text-stone-500">{PROFILES[profile].description}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fund, house or manager…"
              aria-label="Search funds"
              className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-xs focus:border-stone-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {(["All", ...CATALOG_CATEGORIES] as string[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  category === c
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-600 hover:border-stone-400",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <Segmented
            ariaLabel="Verdict filter"
            options={[
              { value: "ALL", label: "All" },
              { value: "QUALIFIED", label: "Qualified" },
              { value: "WATCHLIST", label: "Watchlist" },
              { value: "REJECT", label: "Reject" },
            ]}
            value={status}
            onChange={setStatus}
          />
        </div>
      </Card>

      <Callout tone="info">
        Tap any column header to sort. Select funds per sleeve to build the portfolio used by Stage
        4. The gatekeeper is sleeve-aware: equity, hybrid, debt and commodity are judged by
        different rules, so a good debt or gold fund is no longer failed on equity metrics.
      </Callout>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <SectionTitle
            eyebrow="Universe"
            title={`${rows.length} funds`}
            hint="Sorted by the active column."
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
              <tr>
                <th className="px-3 py-2.5">Include</th>
                <th className="px-3 py-2.5">Fund</th>
                <th className="px-3 py-2.5">Verdict</th>
                <th className="cursor-pointer px-3 py-2.5" onClick={() => onSort("rolling")}>
                  Beat BM %
                </th>
                <th className="cursor-pointer px-3 py-2.5" onClick={() => onSort("sortino")}>
                  Sortino
                </th>
                <th className="cursor-pointer px-3 py-2.5" onClick={() => onSort("alpha")}>
                  Alpha
                </th>
                <th className="cursor-pointer px-3 py-2.5" onClick={() => onSort("downCapture")}>
                  Down-cap
                </th>
                <th className="cursor-pointer px-3 py-2.5" onClick={() => onSort("aum")}>
                  AUM
                </th>
                <th className="px-3 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map(({ fund, result }) => {
                const selected = (selections[fund.sleeve] ?? []).includes(fund.id);
                return (
                  <tr key={fund.id} className={cn("transition-colors", selected ? "bg-amber-50/40" : "hover:bg-stone-50")}>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        aria-label={`${selected ? "Remove" : "Include"} ${fund.name}`}
                        aria-pressed={selected}
                        onClick={() => toggleFund(fund.sleeve, fund.id)}
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                          selected
                            ? "border-amber-500 bg-amber-500 text-white"
                            : "border-stone-300 bg-white text-transparent hover:border-stone-500",
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {fund.rankInCategory ? (
                          <span className="rounded bg-stone-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                            #{fund.rankInCategory}
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setOpenFund(fund)}
                          className="text-left font-semibold text-stone-900 hover:text-amber-800"
                        >
                          {fund.shortName}
                        </button>
                        {fund.isNewEntry ? <Badge tone="success">New</Badge> : null}
                        {fund.dataQuality === "metrics-only" ? (
                          <Badge tone="neutral">metrics-only</Badge>
                        ) : null}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {fund.category}
                        {fund.dataQuality === "metrics-only"
                          ? ` · ${fund.historyYears ?? "—"}y history`
                          : ` · ${fund.fundManager} (${fund.fundManagerTenureYears}y) · TER ${fund.expenseRatioPct}%`}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={verdictTone(result.verdict)}>
                        {result.score}/5 {result.verdict}
                      </Badge>
                      <div className="mt-1 text-[10px] font-medium text-stone-500">
                        {PROFILES[result.profile].label}
                      </div>
                    </td>
                    <HurdleCell
                      value={findHurdle(result.results, "rolling")?.value ?? fund.rolling.beatBenchmarkPct}
                      hurdle={findHurdle(result.results, "rolling")}
                      unit="%"
                    />
                    <HurdleCell
                      value={fund.risk.sortino}
                      hurdle={findHurdle(result.results, "sortino")}
                      dp={2}
                    />
                    <HurdleCell
                      value={fund.risk.alphaPct}
                      hurdle={findHurdle(result.results, "alpha")}
                      unit="%"
                      signed
                    />
                    <HurdleCell
                      value={fund.risk.downCapturePct}
                      hurdle={findHurdle(result.results, "downCapture", "drawdown")}
                      unit="%"
                    />
                    <td className="px-3 py-3 font-mono text-stone-600">
                      {fund.aumCr > 0 ? `₹${(fund.aumCr / 1000).toFixed(1)}k Cr` : "—"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => setOpenFund(fund)}>
                        Factsheet
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <SlidersHorizontal className="h-4 w-4 text-stone-500" />
          Selection flows straight into Stage 4 diligence and look-through.
        </div>
        <Link to="/diligence">
          <Button variant="accent">
            Stage 4 · Diligence <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </Card>

      <FactsheetModal fund={openFund} onClose={() => setOpenFund(null)} />
    </div>
  );
}

const findHurdle = (results: HurdleResult[], ...ids: string[]): HurdleResult | undefined =>
  results.find((r) => ids.includes(r.id));

function HurdleCell({
  value,
  hurdle,
  unit = "",
  dp = 1,
  signed = false,
}: {
  value: number;
  hurdle?: HurdleResult | undefined;
  unit?: string;
  dp?: number;
  signed?: boolean;
}) {
  return (
    <td className="px-3 py-3">
      <div className="font-mono font-semibold text-stone-900">
        {signed && value > 0 ? "+" : ""}
        {value.toFixed(dp)}
        {unit}
      </div>
      {hurdle ? (
        <span
          className={cn(
            "text-[10px] font-semibold",
            hurdle.passed ? "text-emerald-700" : "text-rose-700",
          )}
        >
          {hurdle.delta >= 0 ? "+" : ""}
          {hurdle.delta.toFixed(dp)} vs hurdle
        </span>
      ) : (
        <span className="text-[10px] text-stone-400">not screened</span>
      )}
    </td>
  );
}
