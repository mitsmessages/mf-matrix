import { Database, ExternalLink, ShieldCheck } from "lucide-react";
import {
  CATALOG_CATEGORIES,
  benchmarksByCategory,
  funds,
  universeChangelog,
  universeMeta,
} from "@/data/funds";
import type { FundCategory } from "@/domain/finance/types";
import { Badge, Callout, Card, SectionTitle, StatCard } from "@/components/ui/primitives";
import { SLEEVES } from "@/domain/finance/sleeves";
import { rankWeightSummary } from "@/domain/finance/ranking";

const categoryCounts = CATALOG_CATEGORIES.map((category: FundCategory) => ({
  category,
  count: funds.filter((f) => f.category === category).length,
}));

const newEntries = Object.entries(universeChangelog.categories).flatMap(([category, c]) =>
  c.newEntries.map((e) => ({ category, name: e.name ?? `#${e.code}` })),
);

export default function DataPage() {
  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <Badge tone="brand" className="mb-1">
              Data &amp; sources
            </Badge>
            <h1 className="font-serif text-lg font-bold text-white">What is real, and what is assumed</h1>
            <p className="max-w-2xl text-xs text-stone-400">
              The engine runs entirely on real NAV-derived data. This page states the sources, the
              freshness, and exactly which numbers are assumptions.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-stone-700 bg-stone-800/70 px-3 py-2 text-right text-xs text-stone-300">
          <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
            Universe as of
          </div>
          <div className="font-serif text-lg font-bold text-amber-300">{universeMeta.asOf}</div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Funds in universe" value={funds.length} hint="Real direct-growth schemes" />
        <StatCard label="Categories" value={categoryCounts.length} hint="12 per category" />
        <StatCard
          label="New this refresh"
          value={newEntries.length}
          tone={newEntries.length > 0 ? "brand" : "neutral"}
          hint="Entered the top 12"
        />
        <StatCard label="Benchmarks" value={Object.keys(benchmarksByCategory).length} hint="Index proxy or consensus" />
      </div>

      <Card className="p-5">
        <SectionTitle
          eyebrow="Sources"
          title="Where the data comes from"
          hint="Fetched by the weekly refresh job; committed to the repo, not called from the browser."
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
              <tr>
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Cadence</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                ["Scheme list + latest NAV", "AMFI NAVAll.txt", "Daily", "real"],
                ["NAV history + SEBI category", "api.mfapi.in", "Daily", "real"],
                ["Rolling / risk / capture / alpha", "Computed from NAV history", "Weekly", "derived"],
                ["Benchmarks (Large/Mid)", "Nifty 50 / Midcap 150 index-fund NAV", "Weekly", "real"],
                ["Benchmarks (others)", "Category consensus (average)", "Weekly", "derived"],
                ["Holdings / sector / cap mix", "AMFI → per-AMC portfolio filings", "Monthly", "pending"],
                ["TER / AUM / fund manager", "Not in the NAV feeds", "—", "unavailable"],
              ].map(([data, source, cadence, status]) => (
                <tr key={data} className="hover:bg-stone-50">
                  <td className="px-3 py-2 font-semibold text-stone-900">{data}</td>
                  <td className="px-3 py-2 text-stone-600">{source}</td>
                  <td className="px-3 py-2 text-stone-600">{cadence}</td>
                  <td className="px-3 py-2">
                    <Badge
                      tone={
                        status === "real" ? "success" : status === "derived" ? "info" : status === "pending" ? "warning" : "neutral"
                      }
                    >
                      {status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle eyebrow="Coverage" title="Funds per category" />
          <div className="mt-3 space-y-2">
            {categoryCounts.map(({ category, count }) => (
              <div key={category} className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2 text-xs">
                <span className="text-stone-700">{category}</span>
                <span className="font-mono font-semibold text-stone-900">{count}</span>
              </div>
            ))}
          </div>
          <Callout tone="info" className="mt-3">
            Each category is capped at the top 12 by a composite peer rank (Beat, Sortino, Alpha,
            capture spread, down-capture).
          </Callout>
        </Card>

        <Card className="p-5">
          <SectionTitle eyebrow="Honesty" title="Real vs assumed" />
          <div className="mt-3 space-y-2 text-xs">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="font-bold text-emerald-900">Real (from data)</div>
              <p className="mt-0.5 text-emerald-800">
                NAV, returns, rolling beat rate, volatility, beta, alpha, up/down capture, drawdown,
                and the historical backtest.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="font-bold text-amber-900">Assumptions (labelled)</div>
              <p className="mt-0.5 text-amber-800">
                Sleeve expected CAGR, volatility and correlation matrix; tax rates (FY 2025-26);
                gold/arbitrage crisis returns; sleeve fallback market-cap mix when holdings are
                unavailable.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="font-bold text-stone-800">Not available</div>
              <p className="mt-0.5 text-stone-600">
                Holdings, TER, AUM, fund-manager bios and Method 2 multiples for generated funds.
                These are shown as “—” and never fabricated.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <SectionTitle eyebrow="Methods" title="How the numbers are built" />
        </div>
        <ul className="mt-3 grid gap-2 text-xs text-stone-700 sm:grid-cols-2">
          <li className="rounded-lg border border-stone-200 p-2.5">
            <strong>Rolling returns:</strong> 3-year rolling CAGR over the available history, judged
            by the share of windows beating the benchmark.
          </li>
          <li className="rounded-lg border border-stone-200 p-2.5">
            <strong>Verdicts:</strong> one threshold source, sleeve-aware (equity / hybrid / debt /
            commodity), derived at runtime — never stored.
          </li>
          <li className="rounded-lg border border-stone-200 p-2.5">
            <strong>Peer rank:</strong> weighted composite — {rankWeightSummary()}. Verdicts count
            hurdles equally; the rank orders the top-12.
          </li>
          <li className="rounded-lg border border-stone-200 p-2.5">
            <strong>Benchmark:</strong> a real index-fund NAV where available (Large/Mid), else the
            category average.
          </li>
          <li className="rounded-lg border border-stone-200 p-2.5">
            <strong>Backtest:</strong> monthly NAV returns, annuity-due SIP, XIRR, NAV-path
            drawdown, and rolling 3-year success vs the benchmark.
          </li>
          <li className="rounded-lg border border-stone-200 p-2.5">
            <strong>Tax:</strong> equity LTCG 12.5% above ₹1.25L / STCG 20%; gold LTCG after 24m;
            debt at slab.
          </li>
          <li className="rounded-lg border border-stone-200 p-2.5">
            <strong>Sleeves:</strong>{" "}
            {Object.values(SLEEVES)
              .map((s) => s.shortLabel)
              .join(", ")}
            .
          </li>
        </ul>
      </Card>

      {newEntries.length > 0 ? (
        <Card className="p-5">
          <SectionTitle eyebrow="Changelog" title="New entries this refresh" />
          <div className="mt-3 flex flex-wrap gap-2">
            {newEntries.map((e) => (
              <Badge key={`${e.category}-${e.name}`} tone="success">
                {e.category}: {e.name}
              </Badge>
            ))}
          </div>
        </Card>
      ) : null}

      <Callout tone="info">
        Educational tool. Data is fetched from public AMFI/mfapi sources and refreshed weekly.
        Past performance does not guarantee future results. Not investment advice.{" "}
        <a
          className="inline-flex items-center gap-1 underline"
          href="https://www.amfiindia.com/spages/NAVAll.txt"
          target="_blank"
          rel="noopener noreferrer"
        >
          AMFI NAVAll <ExternalLink className="h-3 w-3" />
        </a>
      </Callout>
    </div>
  );
}
