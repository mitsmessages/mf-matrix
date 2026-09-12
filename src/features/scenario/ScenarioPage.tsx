import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ClipboardCopy, Lightbulb, Wand2 } from "lucide-react";
import { benchmarksByCategory, funds, fundsBySleeve } from "@/data/funds";
import { SLEEVES, SLEEVE_KEYS } from "@/domain/finance/sleeves";
import { resolveHoldings, tierBreakdown, normalisedSleeveWeights } from "@/domain/finance/lookthrough";
import {
  blendedCapture,
  crashStress,
  CRASH_SCENARIOS,
  stockOverlap,
  summariseRisk,
} from "@/domain/finance/portfolio";
import { buildRecommendations, sleeveCoverage, type RecommendationSeverity } from "@/domain/finance/recommendations";
import { estimatePortfolioTax } from "@/domain/finance/tax";
import {
  backtestLumpSum,
  backtestSip,
  portfolioReturnSeries,
  rollingSipSuccess,
  type PortfolioPart,
} from "@/domain/finance/backtest";
import { runScreener } from "@/domain/finance/screener";
import { solveTvm } from "@/domain/finance/tvm";
import { useProfile } from "@/store/profile";
import { formatCompactINR, formatINR, formatPct } from "@/lib/format";
import {
  Badge,
  Button,
  Callout,
  Card,
  ProgressBar,
  SectionTitle,
  Segmented,
  StatCard,
} from "@/components/ui/primitives";
import { verdictTone } from "@/components/ui/verdict";
import type { BadgeTone } from "@/components/ui/primitives";

const SEVERITY_TONE: Record<RecommendationSeverity, BadgeTone> = {
  important: "danger",
  consider: "warning",
  info: "info",
  good: "success",
};

const SEVERITY_LABEL: Record<RecommendationSeverity, string> = {
  important: "Important",
  consider: "Consider",
  info: "Context",
  good: "Healthy",
};

export default function ScenarioPage() {
  const profile = useProfile((s) => s.profile);
  const model = useProfile((s) => s.model);
  const weights = useProfile((s) => s.weights);
  const selections = useProfile((s) => s.selections);
  const lumpSum = useProfile((s) => s.lumpSum);
  const tvm = useProfile((s) => s.tvm);
  const [copied, setCopied] = useState(false);

  const goal = useMemo(() => solveTvm(tvm), [tvm]);
  const holdings = useMemo(() => resolveHoldings(weights, selections, funds), [weights, selections]);
  const normalised = useMemo(() => normalisedSleeveWeights(weights, selections), [weights, selections]);
  const tier = useMemo(() => tierBreakdown(holdings), [holdings]);
  const capture = useMemo(() => blendedCapture(holdings), [holdings]);
  const overlap = useMemo(() => stockOverlap(holdings), [holdings]);
  const risk = useMemo(() => summariseRisk(weights), [weights]);
  const crashes = useMemo(() => CRASH_SCENARIOS.map((s) => crashStress(holdings, s)), [holdings]);

  const tax = useMemo(
    () =>
      estimatePortfolioTax(holdings, goal.gains, tvm.horizonYears * 12, { slabRatePct: 30 }),
    [holdings, goal.gains, tvm.horizonYears],
  );

  const [backtestMode, setBacktestMode] = useState<"sip" | "lump">("sip");

  const backtestParts = useMemo(() => {
    const parts: PortfolioPart[] = [];
    for (const h of holdings) {
      if (h.fund.monthlyReturnsPct) {
        parts.push({ fund: h.fund, weightPct: h.weightPct });
        continue;
      }
      // Substituted proxy: top-ranked real fund in the same sleeve with history.
      const proxy = fundsBySleeve(h.fund.sleeve)
        .filter((f) => f.dataQuality === "metrics-only" && f.monthlyReturnsPct)
        .sort((a, b) => (a.rankInCategory ?? 99) - (b.rankInCategory ?? 99))[0];
      if (proxy) parts.push({ fund: proxy, weightPct: h.weightPct, proxy: true });
    }
    return parts;
  }, [holdings]);

  const portfolioSeries = useMemo(() => portfolioReturnSeries(backtestParts), [backtestParts]);

  // Benchmark monthly series over the same months, weighted by the same sleeves.
  const benchmarkSeries = useMemo(() => {
    if (!portfolioSeries) return null;
    const cats = [...new Set(backtestParts.map((p) => p.fund.category))];
    if (cats.length === 0 || cats.some((c) => !benchmarksByCategory[c])) return null;
    const months = portfolioSeries.months.filter((m) =>
      cats.every((c) => m in benchmarksByCategory[c]!.monthlyReturnsPct),
    );
    if (months.length < 12) return null;
    const total = backtestParts.reduce((s, p) => s + p.weightPct, 0) || 1;
    const returnsPct = months.map((m) =>
      backtestParts.reduce(
        (s, p) => s + (p.weightPct / total) * (benchmarksByCategory[p.fund.category]?.monthlyReturnsPct[m] ?? 0),
        0,
      ),
    );
    const labels = new Set(backtestParts.map((p) => benchmarksByCategory[p.fund.category]?.label));
    return { months, returnsPct, label: labels.size === 1 ? [...labels][0]! : "Category benchmarks" };
  }, [portfolioSeries, backtestParts]);

  const backtest = useMemo(() => {
    if (!portfolioSeries) return null;
    const sip = goal.requiredMonthlySip > 0 ? goal.requiredMonthlySip : 10_000;
    const sipResult = backtestSip(portfolioSeries.months, portfolioSeries.returnsPct, sip, tvm.stepUpPct);
    const lumpAmount = lumpSum > 0 ? lumpSum : 100_000;
    const lumpResult = backtestLumpSum(portfolioSeries.returnsPct, lumpAmount);
    const benchSip = benchmarkSeries
      ? backtestSip(benchmarkSeries.months, benchmarkSeries.returnsPct, sip, tvm.stepUpPct)
      : null;
    const benchLump = benchmarkSeries ? backtestLumpSum(benchmarkSeries.returnsPct, lumpAmount) : null;
    const rolling = rollingSipSuccess(portfolioSeries.returnsPct, 36, sip, benchmarkSeries?.returnsPct);
    return {
      sipResult,
      lumpResult,
      benchSip,
      benchLump,
      rolling,
      benchLabel: benchmarkSeries?.label ?? null,
      proxies: portfolioSeries.proxies,
      usedFallbackSip: goal.requiredMonthlySip <= 0,
    };
  }, [portfolioSeries, benchmarkSeries, goal.requiredMonthlySip, tvm.stepUpPct, lumpSum]);

  const recommendations = useMemo(
    () =>
      buildRecommendations({
        weights,
        selections,
        holdings,
        tier,
        capture,
        overlap,
        risk,
        crashes,
        horizonYears: tvm.horizonYears,
        lumpSum,
        monthlySip: goal.requiredMonthlySip,
      }),
    [weights, selections, holdings, tier, capture, overlap, risk, crashes, tvm.horizonYears, lumpSum, goal.requiredMonthlySip],
  );

  const rows = useMemo(
    () =>
      holdings.map((h) => ({
        fund: h.fund,
        weightPct: h.weightPct,
        result: runScreener(h.fund),
        lump: Math.round((lumpSum * h.weightPct) / 100),
        sip: Math.round((goal.requiredMonthlySip * h.weightPct) / 100),
      })),
    [holdings, lumpSum, goal.requiredMonthlySip],
  );

  const allocationLines = SLEEVE_KEYS.filter((k) => normalised[k] > 0);

  const buildMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# Scenario — ${profile} / ${model}`);
    lines.push("");
    lines.push(`Goal: **${tvm.goalName}** in ${tvm.horizonYears} years`);
    lines.push(
      `Target: **${formatINR(goal.futureCostTarget)}** · Required SIP: **${formatINR(goal.requiredMonthlySip)}/mo** over ${goal.months} months`,
    );
    lines.push(
      `Lump sum: **${formatINR(lumpSum)}** · Expected CAGR ${formatPct(risk.expectedCagrPct, 1)} · Volatility ${formatPct(risk.portfolioVolPct, 1)}`,
    );
    lines.push("");
    lines.push("## Allocation");
    for (const k of allocationLines) {
      lines.push(`- ${SLEEVES[k].label}: ${normalised[k].toFixed(1)}%`);
    }
    lines.push("");
    lines.push("## Funds");
    lines.push("| Sleeve | Fund | Weight | Verdict | TER | Lump sum | SIP |");
    lines.push("| --- | --- | ---: | --- | ---: | ---: | ---: |");
    for (const r of rows) {
      lines.push(
        `| ${SLEEVES[r.fund.sleeve].shortLabel} | ${r.fund.shortName} | ${r.weightPct.toFixed(1)}% | ${r.result.score}/5 ${r.result.verdict} | ${r.fund.expenseRatioPct > 0 ? `${r.fund.expenseRatioPct}%` : "—"} | ${formatINR(r.lump)} | ${formatINR(r.sip)} |`,
      );
    }
    if (backtest) {
      const s = backtest.sipResult;
      lines.push("");
      lines.push("## Backtest (real monthly NAVs)");
      lines.push(
        `- SIP: ${s.months} months · invested ${formatINR(s.invested)} · final ${formatINR(s.finalValue)} · XIRR ${formatPct(s.xirrPct, 1)} · max drawdown ${formatPct(s.navMaxDrawdownPct, 1)}`,
      );
      if (backtest.benchSip) {
        lines.push(`- Benchmark SIP final ${formatINR(backtest.benchSip.finalValue)} (${backtest.benchLabel}).`);
      }
      lines.push(
        `- Rolling ${Math.round(backtest.rolling.horizonMonths / 12)}y: ${formatPct(backtest.rolling.positivePct, 0)} positive, ${
          backtest.rolling.beatBenchmarkPct !== null ? formatPct(backtest.rolling.beatBenchmarkPct, 0) : "n/a"
        } beat benchmark across ${backtest.rolling.windows} starts.`,
      );
      lines.push(`- Lump sum: invested ${formatINR(backtest.lumpResult.invested)} · final ${formatINR(backtest.lumpResult.finalValue)} · CAGR ${formatPct(backtest.lumpResult.cagrPct, 1)}.`);
      if (backtest.proxies.length > 0) {
        lines.push(`- Proxied from top real fund for: ${backtest.proxies.join(", ")}`);
      }
    }
    lines.push("");
    lines.push("## Recommendations");
    for (const rec of recommendations) {
      lines.push(`- **${SEVERITY_LABEL[rec.severity]}: ${rec.title}** — ${rec.detail} _(${rec.citation.lectureId})_`);
    }
    return lines.join("\n");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (holdings.length === 0) {
    return (
      <Card className="p-10 text-center">
        <h2 className="font-serif text-xl font-bold text-stone-900">No scenario yet</h2>
        <p className="mt-1 text-sm text-stone-500">
          Set an allocation and select funds to build a scenario summary with recommendations.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link to="/allocation">
            <Button variant="outline">Stage 1 · Allocate</Button>
          </Link>
          <Link to="/screener">
            <Button variant="accent">Stage 3 · Screen</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <Badge tone="brand" className="mb-1">
              Stage 5 · Synthesis · {profile} / {model}
            </Badge>
            <h1 className="font-serif text-lg font-bold text-white">
              {tvm.goalName} · {tvm.horizonYears} years
            </h1>
            <p className="max-w-2xl text-xs text-stone-400">
              The selected scenario end to end, plus what else could add value. All points are
              derived from the current portfolio and cite their lecture.
            </p>
          </div>
        </div>
        <Button variant="accent" onClick={() => void copy()}>
          {copied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy summary (Markdown)"}
        </Button>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Target corpus" value={formatCompactINR(goal.futureCostTarget)} />
        <StatCard label="Required SIP" value={`${formatINR(goal.requiredMonthlySip)}/mo`} tone="brand" />
        <StatCard label="Expected CAGR" value={formatPct(risk.expectedCagrPct, 1)} tone="success" />
        <StatCard
          label="Down-capture"
          value={formatPct(capture.downCapturePct, 1)}
          tone={capture.downCapturePct < 75 ? "success" : "danger"}
          hint={`Spread ${capture.spreadPts} pts`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <Card className="p-5">
            <SectionTitle eyebrow="Allocation" title="Sleeve targets" hint={`${sleeveCoverage(weights, selections)} active sleeves · re-normalised to 100%.`} />
            <div className="mt-4 space-y-3">
              {allocationLines.map((k) => (
                <div key={k}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700">
                      {SLEEVES[k].label}
                      <span className="ml-1 text-stone-400">· {SLEEVES[k].role}</span>
                    </span>
                    <span className="font-mono font-semibold">{formatPct(normalised[k], 1)}</span>
                  </div>
                  <ProgressBar
                    value={normalised[k]}
                    tone={SLEEVES[k].broadType === "Equity" ? "brand" : SLEEVES[k].broadType === "Commodity" ? "warning" : "success"}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-stone-200 p-4">
              <SectionTitle eyebrow="Funds" title={`${rows.length} schemes`} hint="Effective weight, derived verdict and rupee allocation." />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
                  <tr>
                    <th className="px-3 py-2.5">Sleeve</th>
                    <th className="px-3 py-2.5">Fund</th>
                    <th className="px-3 py-2.5 text-right">Weight</th>
                    <th className="px-3 py-2.5">Verdict</th>
                    <th className="px-3 py-2.5 text-right">TER</th>
                    <th className="px-3 py-2.5 text-right">Lump sum</th>
                    <th className="px-3 py-2.5 text-right">SIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rows.map((r) => (
                    <tr key={r.fund.id} className="hover:bg-stone-50">
                      <td className="px-3 py-2.5 font-semibold text-stone-800">{SLEEVES[r.fund.sleeve].shortLabel}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-stone-900">{r.fund.shortName}</div>
                        <div className="text-[10px] text-stone-500">{r.fund.category}</div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold">{formatPct(r.weightPct, 1)}</td>
                      <td className="px-3 py-2.5">
                        <Badge tone={verdictTone(r.result.verdict)}>
                          {r.result.score}/5 {r.result.verdict}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono">
                        {r.fund.expenseRatioPct > 0 ? formatPct(r.fund.expenseRatioPct, 2) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-amber-900">{formatINR(r.lump)}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{formatINR(r.sip)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-900 font-mono text-xs text-stone-100">
                  <tr>
                    <td className="px-3 py-2.5 uppercase" colSpan={2}>
                      Totals
                    </td>
                    <td className="px-3 py-2.5 text-right text-amber-300">100.0%</td>
                    <td />
                    <td />
                    <td className="px-3 py-2.5 text-right">{formatINR(lumpSum)}</td>
                    <td className="px-3 py-2.5 text-right">{formatINR(goal.requiredMonthlySip)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <SectionTitle eyebrow="Advisory" title="What else could add value" />
            </div>
            <div className="mt-4 space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="rounded-xl border border-stone-200 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-stone-900">{rec.title}</span>
                    <Badge tone={SEVERITY_TONE[rec.severity]}>{SEVERITY_LABEL[rec.severity]}</Badge>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-stone-600">{rec.detail}</p>
                  <div className="mt-1.5 text-[10px] font-mono text-stone-400">
                    Source: {rec.citation.lectureId} · {rec.citation.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle eyebrow="Look-through" title="True exposure" />
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {[
                ["Large Cap", tier.largeCap],
                ["Mid Cap", tier.midCap],
                ["Small Cap", tier.smallCap],
                ["Debt/Cash", tier.cashDebt],
                ["Commodity", tier.commodity],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between rounded-lg border border-stone-200 px-2.5 py-1.5">
                  <dt className="text-stone-600">{label}</dt>
                  <dd className="font-mono font-semibold text-stone-900">{formatPct(value as number, 1)}</dd>
                </div>
              ))}
            </dl>
            <Callout tone="info" className="mt-3">
              Overlap {formatPct(overlap.overlapPct, 1)} ({overlap.status}). First crash test:{" "}
              {formatPct(crashes[0]?.portfolioPct ?? 0, 1)} vs benchmark {formatPct(crashes[0]?.benchmarkPct ?? 0, 1)}.
            </Callout>
          </Card>

          <Card className="p-5">
            <SectionTitle
              eyebrow="Tax (estimate)"
              title="Capital-gains impact"
              hint="FY 2025-26: equity LTCG 12.5% above ₹1.25L, gold 12.5% after 24m, debt at slab."
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <StatCard label="Projected gain" value={formatCompactINR(tax.totalGain)} />
              <StatCard label="Estimated tax" value={formatCompactINR(tax.totalTax)} tone="danger" />
              <StatCard label="Post-tax gain" value={formatCompactINR(tax.postTaxGain)} tone="success" />
              <StatCard label="Effective rate" value={formatPct(tax.effectiveRatePct, 1)} />
            </div>
            <div className="mt-3 space-y-1.5">
              {tax.lines.map((line) => (
                <div
                  key={line.assetClass}
                  className="flex items-center justify-between rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs"
                >
                  <span className="capitalize text-stone-600">
                    {line.assetClass} · {formatPct(line.weightPct, 0)} of gain
                  </span>
                  <span className="font-mono font-semibold text-stone-900">{formatINR(line.tax)}</span>
                </div>
              ))}
            </div>
            <Callout tone="info" className="mt-3">
              Illustrative only, not tax advice. The holding period is assumed to be the full goal
              horizon ({tvm.horizonYears} years).
            </Callout>
          </Card>

          {backtest ? (
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SectionTitle
                  eyebrow="Backtest"
                  title="Historical outcome"
                  hint={`Real monthly NAVs · ${backtest.sipResult.months} months to ${backtest.sipResult.monthLabels.at(-1) ?? ""}.`}
                />
                <Segmented
                  ariaLabel="Backtest mode"
                  options={[
                    { value: "sip", label: "SIP" },
                    { value: "lump", label: "Lump sum" },
                  ]}
                  value={backtestMode}
                  onChange={setBacktestMode}
                />
              </div>

              {backtestMode === "sip" ? (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <StatCard label="Invested" value={formatCompactINR(backtest.sipResult.invested)} />
                    <StatCard label="Final value" value={formatCompactINR(backtest.sipResult.finalValue)} tone="success" />
                    <StatCard
                      label="XIRR"
                      value={formatPct(backtest.sipResult.xirrPct, 1)}
                      tone={backtest.sipResult.xirrPct >= 0 ? "success" : "danger"}
                    />
                    <StatCard
                      label="Max drawdown"
                      value={formatPct(backtest.sipResult.navMaxDrawdownPct, 1)}
                      tone="danger"
                      hint="Underlying NAV path"
                    />
                  </div>
                  {backtest.benchSip ? (
                    <p className="mt-2 text-[11px] text-stone-600">
                      Same SIP on the benchmark finished at{" "}
                      <strong>{formatCompactINR(backtest.benchSip.finalValue)}</strong> (
                      {backtest.sipResult.finalValue >= backtest.benchSip.finalValue ? "ahead" : "behind"} by{" "}
                      {formatCompactINR(Math.abs(backtest.sipResult.finalValue - backtest.benchSip.finalValue))}).
                    </p>
                  ) : null}
                  <Sparkline values={backtest.sipResult.valueSeries} />
                </>
              ) : (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <StatCard label="Invested" value={formatCompactINR(backtest.lumpResult.invested)} />
                    <StatCard label="Final value" value={formatCompactINR(backtest.lumpResult.finalValue)} tone="success" />
                    <StatCard
                      label="CAGR"
                      value={formatPct(backtest.lumpResult.cagrPct, 1)}
                      tone={backtest.lumpResult.cagrPct >= 0 ? "success" : "danger"}
                    />
                    <StatCard
                      label="Max drawdown"
                      value={formatPct(backtest.lumpResult.navMaxDrawdownPct, 1)}
                      tone="danger"
                      hint="Underlying NAV path"
                    />
                  </div>
                  {backtest.benchLump ? (
                    <p className="mt-2 text-[11px] text-stone-600">
                      Benchmark lump sum: <strong>{formatCompactINR(backtest.benchLump.finalValue)}</strong> (
                      {formatPct(backtest.benchLump.cagrPct, 1)} CAGR).
                    </p>
                  ) : null}
                </>
              )}

              {backtest.rolling.windows > 0 ? (
                <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-3 text-[11px] text-stone-600">
                  Rolling {Math.round(backtest.rolling.horizonMonths / 12)}-year windows (
                  {backtest.rolling.windows} starts):{" "}
                  <strong>{formatPct(backtest.rolling.positivePct, 0)}</strong> finished positive
                  {backtest.rolling.beatBenchmarkPct !== null
                    ? `, and ${formatPct(backtest.rolling.beatBenchmarkPct, 0)} beat the benchmark`
                    : ""}
                  {backtest.benchLabel ? ` (${backtest.benchLabel})` : ""}. Median XIRR{" "}
                  {formatPct(backtest.rolling.medianXirrPct, 1)}.
                </div>
              ) : null}

              <Callout tone="info" className="mt-3">
                {backtest.usedFallbackSip
                  ? "No SIP is required for the current goal — ₹10,000/month is used for illustration. "
                  : ""}
                {backtest.proxies.length > 0
                  ? `History proxied from the top real fund for: ${backtest.proxies.join(", ")}. `
                  : ""}
                Past performance does not guarantee future results.
              </Callout>
            </Card>
          ) : null}

          <Card className="flex items-center justify-between p-4">
            <div className="text-xs text-stone-600">Full forensic breakdown lives in Stage 4.</div>
            <Link to="/diligence">
              <Button variant="outline">Open Diligence</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * 100).toFixed(2)},${(40 - ((v - min) / range) * 36).toFixed(2)}`,
    )
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="mt-3 h-16 w-full"
      role="img"
      aria-label="Portfolio value over time"
    >
      <polyline points={points} fill="none" stroke="#15803D" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
