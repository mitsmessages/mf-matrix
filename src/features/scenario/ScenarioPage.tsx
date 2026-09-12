import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ClipboardCopy, Lightbulb, Wand2 } from "lucide-react";
import { funds } from "@/data/funds";
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
import { runScreener } from "@/domain/finance/screener";
import { solveTvm } from "@/domain/finance/tvm";
import { useProfile } from "@/store/profile";
import { formatCompactINR, formatINR, formatPct } from "@/lib/format";
import { Badge, Button, Callout, Card, ProgressBar, SectionTitle, StatCard } from "@/components/ui/primitives";
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
