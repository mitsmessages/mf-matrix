import { useState } from "react";
import { ShieldCheck, TrendingUp, PieChart, Award } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge, Callout, StatCard } from "@/components/ui/primitives";
import { verdictTone } from "@/components/ui/verdict";
import { runScreener } from "@/domain/finance/screener";
import { PROFILES } from "@/domain/finance/thresholds";
import type { Fund } from "@/domain/finance/types";
import { SLEEVES } from "@/domain/finance/sleeves";
import { formatINR, formatPct } from "@/lib/format";
import { cn } from "@/lib/cn";

type Tab = "overview" | "rolling" | "risk" | "valuation" | "council";

export function FactsheetModal({
  fund,
  onClose,
}: {
  fund: Fund | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  if (!fund) return null;

  const result = runScreener(fund);
  const sleeve = SLEEVES[fund.sleeve];
  const hurdleById = (id: string) => result.results.find((r) => r.id === id);
  const profileLabel = PROFILES[result.profile].label;

  const tabs: { id: Tab; label: string; icon: typeof ShieldCheck }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "rolling", label: "Rolling returns", icon: PieChart },
    { id: "risk", label: "Risk & capture", icon: ShieldCheck },
    { id: "valuation", label: "Method 2", icon: PieChart },
    { id: "council", label: "Council", icon: Award },
  ];

  return (
    <Modal
      open={Boolean(fund)}
      onClose={onClose}
      size="xl"
      title={fund.name}
      subtitle={`${fund.fundHouse} · ${fund.category} · Benchmark ${fund.benchmark}`}
      footer={
        <>
          <span>{result.summary}</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
          >
            Close
          </button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{fund.category}</Badge>
        <Badge tone="info">Sleeve: {sleeve.shortLabel}</Badge>
        <Badge tone="neutral">{fund.style} style</Badge>
        <Badge tone={verdictTone(result.verdict)}>
          {result.score}/5 {result.verdict}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-1 border-b border-stone-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors",
              tab === t.id
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800",
            )}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "overview" ? (
          <div className="space-y-4">
            {fund.dataQuality === "metrics-only" ? (
              <Callout tone="info">
                Metrics-only universe entry: returns and risk are computed from real NAV history.
                Holdings, TER, AUM and manager data come from AMFI / SEBI disclosures and are not
                included here.
              </Callout>
            ) : null}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="NAV"
                value={fund.nav > 0 ? formatINR(fund.nav) : "—"}
                hint="Direct plan"
              />
              <StatCard
                label="AUM"
                value={fund.aumCr > 0 ? `₹${fund.aumCr.toLocaleString("en-IN")} Cr` : "—"}
              />
              <StatCard
                label="Expense ratio"
                value={fund.expenseRatioPct > 0 ? formatPct(fund.expenseRatioPct, 2) : "—"}
                tone="success"
              />
              <StatCard
                label="Turnover"
                value={fund.portfolioTurnoverPct > 0 ? formatPct(fund.portfolioTurnoverPct, 0) : "—"}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Fund manager
                </h4>
                <div className="mt-1 text-sm font-semibold text-stone-900">{fund.fundManager}</div>
                <div className="text-xs text-stone-500">
                  {fund.fundManagerTenureYears} years at this scheme
                </div>
                {fund.managerProfile ? (
                  <p className="mt-2 text-xs italic text-stone-600">
                    “{fund.managerProfile.philosophy}”
                  </p>
                ) : null}
              </div>
              <div className="rounded-xl border border-stone-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {profileLabel} gatekeeper
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {result.results.map((h) => (
                    <li key={h.id} className="flex items-center justify-between text-xs">
                      <span className="text-stone-600">
                        {h.step}. {h.label}
                      </span>
                      <Badge tone={h.passed ? "success" : "danger"}>
                        {h.value.toFixed(h.unit === "%" ? 1 : 2)}
                        {h.unit} {h.passed ? "pass" : "fail"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "rolling" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="Avg 3Y rolling"
                value={formatPct(fund.rolling.avgPct, 2)}
                hint={`Bench ${formatPct(fund.rolling.benchmarkAvgPct, 2)}`}
                tone="success"
              />
              <StatCard
                label="Min rolling"
                value={formatPct(fund.rolling.minPct, 2)}
                tone={fund.rolling.minPct >= 0 ? "success" : "danger"}
              />
              <StatCard label="Max rolling" value={formatPct(fund.rolling.maxPct, 2)} />
              <StatCard
                label="Beat benchmark"
                value={formatPct(fund.rolling.beatBenchmarkPct, 0)}
                tone={hurdleById("rolling")?.passed ? "success" : "danger"}
                hint={hurdleById("rolling")?.rule ?? "Not screened for this profile"}
              />
            </div>
            <div className="space-y-2">
              {fund.rolling.brackets.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[11px] text-stone-600">
                    <span>{b.label}</span>
                    <span>
                      {b.pct}% ({b.count} windows)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        b.label.includes("< 0%")
                          ? "bg-rose-500"
                          : b.label.includes("> 20%")
                            ? "bg-emerald-600"
                            : "bg-brand-amber",
                      )}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "risk" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Std deviation" value={formatPct(fund.risk.stdDevPct, 1)} />
              <StatCard label="Beta" value={fund.risk.beta.toFixed(2)} />
              <StatCard label="Sharpe" value={fund.risk.sharpe.toFixed(2)} />
              <StatCard
                label="Sortino"
                value={fund.risk.sortino.toFixed(2)}
                tone={hurdleById("sortino")?.passed ? "success" : "danger"}
                hint={hurdleById("sortino")?.rule ?? "Not a hurdle for this profile"}
              />
              <StatCard
                label="Jensen's alpha"
                value={`${fund.risk.alphaPct > 0 ? "+" : ""}${fund.risk.alphaPct.toFixed(2)}%`}
                tone={hurdleById("alpha")?.passed ? "success" : "danger"}
                hint={hurdleById("alpha")?.rule ?? "Not a hurdle for this profile"}
              />
              <StatCard label="R-squared" value={fund.risk.rSquared.toFixed(2)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <CaptureBar
                label="Up-capture"
                value={fund.risk.upCapturePct}
                good={hurdleById("upCapture")?.passed}
              />
              <CaptureBar
                label="Down-capture"
                value={fund.risk.downCapturePct}
                good={(hurdleById("downCapture") ?? hurdleById("drawdown"))?.passed}
                invert
              />
            </div>
            <Callout tone="info">
              Capture spread: {(fund.risk.upCapturePct - fund.risk.downCapturePct).toFixed(1)} points.
              Positive spread is the asymmetric shield.
            </Callout>
          </div>
        ) : null}

        {tab === "valuation" ? (
          <div className="space-y-4">
            {fund.weightedMultiples ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <StatCard label="IT / FMCG P/E" value={`${fund.weightedMultiples.pe}x`} />
                <StatCard label="Banks P/B" value={`${fund.weightedMultiples.pb}x`} />
                <StatCard label="Infra EV/EBITDA" value={`${fund.weightedMultiples.evEbitda}x`} />
                <StatCard label="Cyclicals P/S" value={`${fund.weightedMultiples.priceToSales}x`} />
                <StatCard label="PSU div yield" value={formatPct(fund.weightedMultiples.dividendYieldPct, 2)} />
              </div>
            ) : (
              <Callout tone="info">
                Method 2 valuation needs holdings-level disclosure. This scheme is in the
                metrics-only universe; sector multiples are not available.
              </Callout>
            )}
              {fund.topHoldings.length === 0 ? (
                <Callout tone="info">
                  Holdings are disclosed monthly via SEBI filings and are not in the NAV feed.
                </Callout>
              ) : null}
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
                    <tr>
                      <th className="px-3 py-2">Holding</th>
                    <th className="px-3 py-2">Sector</th>
                    <th className="px-3 py-2">Tier</th>
                    <th className="px-3 py-2 text-right">Weight</th>
                    <th className="px-3 py-2">Metric</th>
                    <th className="px-3 py-2">Thesis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {fund.topHoldings.map((h) => (
                    <tr key={h.ticker} className="hover:bg-stone-50">
                      <td className="px-3 py-2 font-semibold text-stone-900">{h.name}</td>
                      <td className="px-3 py-2 text-stone-600">{h.sector}</td>
                      <td className="px-3 py-2">
                        <Badge tone="neutral">{h.marketCapTier}</Badge>
                      </td>
                      <td className="px-3 py-2 text-right font-mono">{formatPct(h.weightPct, 1)}</td>
                      <td className="px-3 py-2 font-mono">
                        {h.valuationMetric} {h.metricValue}
                      </td>
                      <td className="max-w-xs px-3 py-2 text-[11px] text-stone-600">{h.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "council" ? (
          <div className="space-y-3">
            {!fund.agentReviews ? (
              <Callout tone="info">
                Committee reviews are curated for the featured universe. This metrics-only scheme
                has not been reviewed yet.
              </Callout>
            ) : null}
            {(
              [
                ["aggressive", "Aarav Chen", "Aggressive"],
                ["moderate", "Elena Rostova", "Moderate"],
                ["conservative", "Marcus Vance", "Conservative"],
                ["macro", "Dr. Kabir Sen", "Macro"],
                ["dueDiligence", "Sarah Montgomery, CFA", "Due diligence"],
              ] as const
            ).map(([key, name, role]) => {
              const review = fund.agentReviews?.[key];
              if (!review) return null;
              return (
                <div key={key} className="rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-stone-900">{name}</span>
                      <Badge tone="neutral">{role}</Badge>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      {review.score}/10 · {review.stance}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600">{review.comment}</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function CaptureBar({
  label,
  value,
  good,
  invert = false,
}: {
  label: string;
  value: number;
  /** undefined = not a hurdle for this profile, so render neutrally. */
  good?: boolean | undefined;
  invert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-stone-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          {label}
        </span>
        <span
          className={cn(
            "text-sm font-bold",
            good === undefined ? "text-stone-600" : good ? "text-emerald-700" : "text-amber-700",
          )}
        >
          {formatPct(value, 1)}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className={cn("h-full rounded-full", invert ? "bg-emerald-600" : "bg-blue-600")}
          style={{ width: `${Math.min(100, (value / 130) * 100)}%` }}
        />
      </div>
    </div>
  );
}
