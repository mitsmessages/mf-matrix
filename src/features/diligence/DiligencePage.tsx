import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, RefreshCw, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import { funds } from "@/data/funds";
import { SLEEVES } from "@/domain/finance/sleeves";
import type { SleeveKey } from "@/domain/finance/sleeves";
import {
  activeSleeveKeys,
  aggregateHoldings,
  deploymentPlan,
  normalisedSleeveWeights,
  resolveHoldings,
  tierBreakdown,
} from "@/domain/finance/lookthrough";
import {
  blendedCapture,
  crashStress,
  CRASH_SCENARIOS,
  round,
  stockOverlap,
  summariseRisk,
  topConcentration,
} from "@/domain/finance/portfolio";
import { buildRebalancePlan, DEFAULT_REBALANCE_BAND_PCT } from "@/domain/finance/rebalance";
import { runScreener } from "@/domain/finance/screener";
import { buildSynthesis } from "@/domain/finance/synthesis";
import { solveTvm } from "@/domain/finance/tvm";
import { useProfile } from "@/store/profile";
import { formatCompactINR, formatINR, formatPct, formatSignedPct } from "@/lib/format";
import {
  Badge,
  Button,
  Callout,
  Card,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "@/components/ui/primitives";
import { DonutChart } from "./DonutChart";
import { AiBrief } from "./AiBrief";

const TIER_COLORS: Record<string, string> = {
  large: "#2563EB",
  mid: "#D97706",
  small: "#059669",
  cashDebt: "#78716C",
  commodity: "#EAB308",
};

export default function DiligencePage() {
  const weights = useProfile((s) => s.weights);
  const selections = useProfile((s) => s.selections);
  const lumpSum = useProfile((s) => s.lumpSum);
  const setLumpSum = useProfile((s) => s.setLumpSum);
  const bandPct = useProfile((s) => s.bandPct);
  const setBandPct = useProfile((s) => s.setBandPct);
  const tvm = useProfile((s) => s.tvm);

  const [currentPortfolioValue, setCurrentPortfolioValue] = useState<number>(lumpSum);
  const [currentValues, setCurrentValues] = useState<Partial<Record<SleeveKey, number>>>({});
  const [seeded, setSeeded] = useState(false);

  const goal = useMemo(() => solveTvm(tvm), [tvm]);
  const sip = goal.requiredMonthlySip;

  const holdings = useMemo(() => resolveHoldings(weights, selections, funds), [weights, selections]);
  const tier = useMemo(() => tierBreakdown(holdings), [holdings]);
  const capture = useMemo(() => blendedCapture(holdings), [holdings]);
  const overlap = useMemo(() => stockOverlap(holdings), [holdings]);
  const concentration = useMemo(() => topConcentration(holdings), [holdings]);
  const risk = useMemo(() => summariseRisk(weights), [weights]);
  const crashes = useMemo(
    () => CRASH_SCENARIOS.map((s) => crashStress(holdings, s)),
    [holdings],
  );
  const normalised = useMemo(() => normalisedSleeveWeights(weights, selections), [weights, selections]);
  const active = useMemo(() => activeSleeveKeys(weights, selections), [weights, selections]);
  const filled = active.filter((k) => (selections[k]?.length ?? 0) > 0);

  const deployment = useMemo(
    () => deploymentPlan(weights, selections, funds, lumpSum, sip),
    [weights, selections, lumpSum, sip],
  );
  const aggregated = useMemo(
    () => aggregateHoldings(holdings, lumpSum, sip),
    [holdings, lumpSum, sip],
  );

  // Seed current sleeve values from target on first render with data.
  const seededValues = useMemo(() => {
    const out: Partial<Record<SleeveKey, number>> = {};
    for (const k of active) out[k] = Math.round((normalised[k] / 100) * currentPortfolioValue);
    return out;
  }, [active, normalised, currentPortfolioValue]);
  const displayCurrent = seeded ? currentValues : seededValues;

  const rebalance = useMemo(
    () => buildRebalancePlan(displayCurrent, normalised, currentPortfolioValue, bandPct),
    [displayCurrent, normalised, currentPortfolioValue, bandPct],
  );

  const synthesis = useMemo(
    () =>
      buildSynthesis({
        parts: holdings.map((h) => ({ weightPct: h.weightPct, result: runScreener(h.fund) })),
        capture,
        overlap,
        crash: crashes,
        risk,
        rebalance,
        activeSleeves: active.length,
        filledSleeves: filled.length,
      }),
    [holdings, capture, overlap, crashes, risk, rebalance, active.length, filled.length],
  );

  const blendedMultiples = useMemo(() => {
    const equity = holdings.filter(
      (h) =>
        ["Equity", "Hybrid"].includes(SLEEVES[h.fund.sleeve].broadType) &&
        Boolean(h.fund.weightedMultiples),
    );
    const total = equity.reduce((s, h) => s + h.weightPct, 0) || 1;
    const acc = { pe: 0, pb: 0, evEbitda: 0, ps: 0, divYield: 0 };
    for (const { fund, weightPct } of equity) {
      const wm = fund.weightedMultiples;
      if (!wm) continue;
      const w = weightPct / total;
      acc.pe += w * wm.pe;
      acc.pb += w * wm.pb;
      acc.evEbitda += w * wm.evEbitda;
      acc.ps += w * wm.priceToSales;
      acc.divYield += w * wm.dividendYieldPct;
    }
    return {
      pe: round(acc.pe, 1),
      pb: round(acc.pb, 2),
      evEbitda: round(acc.evEbitda, 1),
      ps: round(acc.ps, 1),
      divYield: round(acc.divYield, 2),
      available: equity.length > 0,
    };
  }, [holdings]);

  const buildPrompt = () => {
    const lines = [
      "You are the chair of an institutional mutual fund investment committee.",
      "Review the portfolio telemetry below and produce a concise, structured verdict.",
      "",
      `Stage 1 allocation (${active.length} active sleeves): ${active
        .map((k) => `${SLEEVES[k].shortLabel} ${normalised[k].toFixed(1)}%`)
        .join(", ")}`,
      `Expected CAGR ${risk.expectedCagrPct.toFixed(1)}%, covariance volatility ${risk.portfolioVolPct.toFixed(1)}% (vs ${risk.naiveVolPct.toFixed(1)}% naive).`,
      `Stage 2 goal: ${tvm.goalName}, target ${formatINR(goal.futureCostTarget)} in ${tvm.horizonYears}y, SIP ${formatINR(sip)}/month, net return ${goal.netReturnPct.toFixed(2)}%.`,
      `Stage 3 selections: ${holdings.map((h) => `${h.fund.shortName} (${h.fund.category}, ${h.weightPct.toFixed(1)}%)`).join("; ")}.`,
      `Derived synthesis score: ${synthesis.score}/100 (${synthesis.verdict}).`,
      `Blended capture: up ${capture.upCapturePct}%, down ${capture.downCapturePct}%, spread ${capture.spreadPts} pts.`,
      `Stock overlap ${overlap.overlapPct}% (${overlap.status}); top-10 concentration ${concentration}%.`,
      `Crash tests: ${crashes.map((c) => `${c.scenario.label} ${c.portfolioPct}% vs ${c.benchmarkPct}% (protected ${c.protectedPct} pts)`).join("; ")}.`,
      `Method 2 blended multiples: P/B ${blendedMultiples.pb}x, P/E ${blendedMultiples.pe}x, EV/EBITDA ${blendedMultiples.evEbitda}x, div yield ${blendedMultiples.divYield}%.`,
      `Rebalance: ${rebalance.triggered ? `triggered, max drift ${rebalance.maxDriftPct} pts at ±${rebalance.bandPct}% band` : "within band"}.`,
      "",
      "Respond with markdown headings: 1) Verdict & confidence, 2) Strengths, 3) Risks, 4) Execution actions (SIP cadence, staggered entry, rebalance trigger).",
    ];
    return lines.join("\n");
  };

  if (holdings.length === 0) {
    return (
      <Card className="p-10 text-center">
        <h2 className="font-serif text-xl font-bold text-stone-900">No funds selected</h2>
        <p className="mt-1 text-sm text-stone-500">
          Complete Stage 1 and select at least one fund in Stage 3 to run diligence.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link to="/allocation">
            <Button variant="outline">Stage 1</Button>
          </Link>
          <Link to="/screener">
            <Button variant="accent">Stage 3 · Screen</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const donutSlices = [
    { key: "large", label: "Large Cap", value: tier.largeCap, color: TIER_COLORS.large! },
    { key: "mid", label: "Mid Cap", value: tier.midCap, color: TIER_COLORS.mid! },
    { key: "small", label: "Small Cap", value: tier.smallCap, color: TIER_COLORS.small! },
    { key: "cashDebt", label: "Debt/Cash", value: tier.cashDebt, color: TIER_COLORS.cashDebt! },
    { key: "commodity", label: "Commodity", value: tier.commodity, color: TIER_COLORS.commodity! },
  ].filter((s) => s.value > 0.05);

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <Badge tone="brand" className="mb-1">
                Stage 4 · Lessons 10 &amp; 11
              </Badge>
              <h1 className="font-serif text-lg font-bold text-white">
                Portfolio due diligence &amp; synthesis
              </h1>
              <p className="max-w-2xl text-xs text-stone-400">
                Covariance risk, crash stress, overlap, look-through, rebalancing and a derived
                committee score — no hardcoded verdicts.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-700 bg-stone-800/70 px-4 py-3 text-right">
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
              Derived score
            </div>
            <div className="font-serif text-3xl font-bold text-amber-300">{synthesis.score}</div>
            <div className="text-[11px] font-semibold text-stone-300">{synthesis.verdict}</div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="p-5 lg:col-span-5">
          <SectionTitle eyebrow="Synthesis" title="Committee scorecard" hint="Every pillar is computed from your data." />
          <div className="mt-4 space-y-3">
            {synthesis.pillars.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700">{p.label}</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {p.score.toFixed(1)}/{p.max}
                  </span>
                </div>
                <ProgressBar value={(p.score / p.max) * 100} tone={p.score / p.max > 0.7 ? "success" : p.score / p.max > 0.4 ? "brand" : "danger"} className="mt-1" />
                <p className="mt-0.5 text-[11px] text-stone-500">{p.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Expected CAGR" value={formatPct(risk.expectedCagrPct, 1)} tone="success" />
            <StatCard label="Portfolio vol" value={formatPct(risk.portfolioVolPct, 1)} hint={`Naive ${risk.naiveVolPct.toFixed(1)}%`} />
            <StatCard label="Down-capture" value={formatPct(capture.downCapturePct, 1)} tone={capture.downCapturePct < 75 ? "success" : "danger"} hint="Target < 75%" />
            <StatCard label="Capture spread" value={formatSignedPct(capture.spreadPts, 1)} tone="brand" hint="Target > +15 pts" />
          </div>
          <AiBrief buildPrompt={buildPrompt} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="p-5 lg:col-span-5">
          <SectionTitle eyebrow="Look-through" title="True economic exposure" hint="Resolves the allocation illusion." />
          <DonutChart slices={donutSlices} centerLabel="Look-through" />
          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {donutSlices.map((s) => (
              <div key={s.key} className="flex items-center justify-between rounded-lg border border-stone-200 px-2.5 py-1.5">
                <dt className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </dt>
                <dd className="font-mono font-semibold text-stone-900">{formatPct(s.value, 1)}</dd>
              </div>
            ))}
          </dl>
          <Callout tone="info" className="mt-3">
            Top-10 concentration is {formatPct(concentration, 1)} across {overlap.uniqueStocks} tracked
            securities.
          </Callout>
        </Card>

        <Card className="p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle eyebrow="Method 2" title="Blended sector-native multiples" hint="Equity and hybrid sleeves only." />
            <Badge tone="info">Normalized to holdings</Badge>
          </div>
          {blendedMultiples.available ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <StatCard label="Banks P/B" value={`${blendedMultiples.pb}x`} hint="5Y median ≈ 2.6x" />
              <StatCard label="IT/FMCG P/E" value={`${blendedMultiples.pe}x`} hint="Median ≈ 30x" />
              <StatCard label="Infra EV/EBITDA" value={`${blendedMultiples.evEbitda}x`} hint="Median ≈ 12.5x" />
              <StatCard label="Cyclicals P/S" value={`${blendedMultiples.ps}x`} />
              <StatCard label="PSU div yield" value={formatPct(blendedMultiples.divYield, 2)} />
            </div>
          ) : (
            <Callout tone="info" className="mt-4">
              Method 2 needs holdings-level disclosure. None of the selected schemes provide it, so
              sector multiples are not shown.
            </Callout>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            {crashes.map((c) => (
              <div key={c.scenario.id} className="rounded-xl border border-stone-200 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">{c.scenario.label}</span>
                  <Badge tone={c.protectedPct > 0 ? "success" : "neutral"}>
                    +{c.protectedPct} pts protected
                  </Badge>
                </div>
                <div className="mt-2 flex items-end gap-4">
                  <div>
                    <div className="text-[10px] uppercase text-stone-500">Portfolio</div>
                    <div className="font-mono text-lg font-bold text-emerald-700">
                      {formatSignedPct(c.portfolioPct, 1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-stone-500">Benchmark</div>
                    <div className="font-mono text-lg font-bold text-rose-700">
                      {formatSignedPct(c.benchmarkPct, 1)}
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-stone-500">{c.scenario.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            eyebrow="Capital deployment"
            title="Cheque plan"
            hint="Exact rupee allocation per scheme, from Stage 1 weights and Stage 2 SIP."
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-stone-600" htmlFor="lump">
              Lump sum
            </label>
            <input
              id="lump"
              type="number"
              min={0}
              step={100_000}
              value={lumpSum}
              onChange={(e) => setLumpSum(Number(e.target.value))}
              className="w-40 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-right font-mono text-xs focus:border-stone-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
              <tr>
                <th className="px-3 py-2.5">Sleeve</th>
                <th className="px-3 py-2.5">Scheme</th>
                <th className="px-3 py-2.5 text-right">Effective %</th>
                <th className="px-3 py-2.5 text-right">Lump sum</th>
                <th className="px-3 py-2.5 text-right">Monthly SIP</th>
                <th className="px-3 py-2.5">Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {deployment.map((row) => (
                <tr key={`${row.sleeve}-${row.fund.id}`} className="hover:bg-stone-50">
                  <td className="px-3 py-2.5 font-semibold text-stone-900">{row.sleeveLabel}</td>
                  <td className="px-3 py-2.5">
                    {row.fund.shortName}
                    {row.splitNote ? (
                      <span className="ml-1 text-[10px] text-amber-700">({row.splitNote})</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono">{formatPct(row.effectivePct, 2)}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-900">
                    {formatINR(row.lumpSum)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-stone-900">
                    {formatINR(row.monthlySip)}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-stone-600">{row.note}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-900 font-mono text-xs text-stone-100">
              <tr>
                <td className="px-3 py-2.5 uppercase" colSpan={2}>
                  Totals
                </td>
                <td className="px-3 py-2.5 text-right text-amber-300">100.0%</td>
                <td className="px-3 py-2.5 text-right">{formatINR(lumpSum)}</td>
                <td className="px-3 py-2.5 text-right">{formatINR(sip)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle
            eyebrow="Redundancy"
            title="Cross-fund overlap"
            hint="Are you paying active fees for a closet index?"
            action={<Badge tone={overlap.status === "EXCELLENT" ? "success" : overlap.status === "MODERATE" ? "warning" : "danger"}>{overlap.overlapPct}% · {overlap.status}</Badge>}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
                <tr>
                  <th className="px-3 py-2">Shared stock</th>
                  <th className="px-3 py-2">Sector</th>
                  <th className="px-3 py-2 text-right">Weight</th>
                  <th className="px-3 py-2">Funds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {overlap.items
                  .filter((i) => i.funds.length > 1)
                  .slice(0, 6)
                  .map((item) => (
                    <tr key={item.ticker}>
                      <td className="px-3 py-2 font-semibold text-stone-900">{item.name}</td>
                      <td className="px-3 py-2 text-stone-600">{item.sector}</td>
                      <td className="px-3 py-2 text-right font-mono">{formatPct(item.combinedWeightPct, 2)}</td>
                      <td className="px-3 py-2 text-[10px] text-stone-500">{item.funds.join(", ")}</td>
                    </tr>
                  ))}
                {overlap.items.filter((i) => i.funds.length > 1).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-stone-400">
                      No overlapping holdings detected.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle
              eyebrow="Discipline"
              title="Rebalance plan"
              hint="Trim winners, top up laggards when drift exceeds the band."
            />
            <div className="flex items-center gap-2">
              <label className="text-xs text-stone-600" htmlFor="band">
                Band ±
              </label>
              <input
                id="band"
                type="number"
                min={1}
                max={20}
                value={bandPct}
                onChange={(e) => setBandPct(Number(e.target.value))}
                className="w-16 rounded-lg border border-stone-300 bg-white px-2 py-1 text-right font-mono text-xs focus:border-stone-500 focus:outline-none"
              />
              <span className="text-xs text-stone-500">%</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="text-xs text-stone-600" htmlFor="pvalue">
              Current portfolio value
            </label>
            <input
              id="pvalue"
              type="number"
              min={0}
              step={100_000}
              value={currentPortfolioValue}
              onChange={(e) => setCurrentPortfolioValue(Number(e.target.value) || 0)}
              className="w-40 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-right font-mono text-xs focus:border-stone-500 focus:outline-none"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentValues(seededValues);
                setSeeded(true);
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Seed from target
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            {active.map((k) => {
              const value = displayCurrent[k] ?? 0;
              const action = rebalance.actions.find((a) => a.sleeve === k);
              return (
                <div key={k} className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-200 p-2">
                  <span className="w-16 text-xs font-semibold text-stone-800">{SLEEVES[k].shortLabel}</span>
                  <input
                    type="number"
                    min={0}
                    step={10_000}
                    value={value}
                    aria-label={`${SLEEVES[k].label} current value`}
                    onChange={(e) => {
                      setSeeded(true);
                      setCurrentValues({ ...displayCurrent, [k]: Number(e.target.value) || 0 });
                    }}
                    className="w-32 rounded-md border border-stone-300 bg-white px-2 py-1 text-right font-mono text-xs focus:border-stone-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-500">
                    target {formatPct(action?.targetPct ?? 0, 1)}
                  </span>
                  <Badge
                    tone={action?.action === "SELL" ? "danger" : action?.action === "BUY" ? "success" : "neutral"}
                    className="ml-auto"
                  >
                    {action?.action ?? "HOLD"} {action && action.action !== "HOLD" ? formatCompactINR(Math.abs(action.amountRupees)) : ""}
                  </Badge>
                </div>
              );
            })}
          </div>

          <Callout tone={rebalance.triggered ? "warning" : "success"} className="mt-3">
            {rebalance.triggered
              ? `Rebalance triggered — max drift ${formatPct(rebalance.maxDriftPct, 1)} exceeds the ±${bandPct}% band.`
              : `Within the ±${bandPct}% band. Next scheduled review: annual.`}
            {" "}Default band is ±{DEFAULT_REBALANCE_BAND_PCT}%.
          </Callout>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle
          eyebrow="Underlying securities"
          title="Aggregated look-through holdings"
          hint={`Top ${Math.min(aggregated.length, 12)} of ${aggregated.length} securities with rupee allocations.`}
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
              <tr>
                <th className="px-3 py-2">Security</th>
                <th className="px-3 py-2">Tier</th>
                <th className="px-3 py-2 text-right">Weight</th>
                <th className="px-3 py-2 text-right">Lump sum</th>
                <th className="px-3 py-2 text-right">Monthly</th>
                <th className="px-3 py-2">Sources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {aggregated.slice(0, 12).map((h) => (
                <tr key={h.ticker} className="hover:bg-stone-50">
                  <td className="px-3 py-2">
                    <div className="font-semibold text-stone-900">{h.name}</div>
                    <div className="text-[10px] text-stone-500">{h.sector} · {h.ticker}</div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone="neutral">{h.tier}</Badge>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold">{formatPct(h.weightPct, 2)}</td>
                  <td className="px-3 py-2 text-right font-mono text-amber-900">{formatINR(h.lumpSum)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatINR(h.monthlySip)}</td>
                  <td className="px-3 py-2 text-[10px] text-stone-500">
                    {h.sources.map((s) => `${s.fund} ${s.contributionPct.toFixed(1)}%`).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Sparkles className="h-4 w-4 text-amber-600" />
          Portfolio reviewed. Revisit annually or when drift exceeds ±{bandPct}%.
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/screener">
            <Button variant="ghost">
              <TrendingDown className="h-3.5 w-3.5" /> Back to screener
            </Button>
          </Link>
          <Link to="/allocation">
            <Button variant="outline">
              <Building2 className="h-3.5 w-3.5" /> Review Stage 1 allocation
            </Button>
          </Link>
          <Link to="/scenario">
            <Button variant="accent">
              Proceed to Stage 5 · Synthesis <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
