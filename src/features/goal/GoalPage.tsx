import { Link } from "react-router-dom";
import { ArrowRight, Calculator, CheckCircle2, Target } from "lucide-react";
import { solveTvm } from "@/domain/finance/tvm";
import { summariseRisk } from "@/domain/finance/portfolio";
import { useProfile } from "@/store/profile";
import { formatCompactINR, formatINR, formatPct } from "@/lib/format";
import {
  Badge,
  Button,
  Callout,
  Card,
  SectionTitle,
  Slider,
  StatCard,
} from "@/components/ui/primitives";

const PRESETS = {
  retirement: { label: "Retirement (20y)", patch: { goalName: "Retirement Corpus", targetToday: 10_000_000, horizonYears: 20, inflationPct: 6.65 } },
  education: { label: "Education (12y)", patch: { goalName: "Child Higher Education", targetToday: 3_500_000, horizonYears: 12, inflationPct: 9 } },
  wealth: { label: "Wealth (10y)", patch: { goalName: "Wealth Accumulation", targetToday: 5_000_000, horizonYears: 10, inflationPct: 6 } },
} as const;

export default function GoalPage() {
  const tvm = useProfile((s) => s.tvm);
  const setTvm = useProfile((s) => s.setTvm);
  const weights = useProfile((s) => s.weights);

  const result = solveTvm(tvm);
  const allocationReturn = summariseRisk(weights).expectedCagrPct;

  const investedPct = result.finalValue > 0 ? (result.totalInvested / result.finalValue) * 100 : 0;

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <Badge tone="brand" className="mb-1">
              Stage 2 · Lesson 03
            </Badge>
            <h1 className="font-serif text-lg font-bold text-white">Goal &amp; SIP solver</h1>
            <p className="max-w-2xl text-xs text-stone-400">
              Inflate the goal, subtract existing corpus growth, solve the monthly SIP — net of
              fees, with optional step-up and capital-gains tax.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant={tvm.goalName === preset.patch.goalName ? "accent" : "outline"}
              size="sm"
              onClick={() => setTvm(preset.patch)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="space-y-4 p-5 lg:col-span-5">
          <SectionTitle eyebrow="Inputs" title="Goal parameters" />
          <div>
            <label className="text-xs font-medium text-stone-700" htmlFor="goal-name">
              Goal name
            </label>
            <input
              id="goal-name"
              value={tvm.goalName}
              onChange={(e) => setTvm({ goalName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>

          <Slider
            label="Target value in today's money"
            value={tvm.targetToday}
            min={500_000}
            max={50_000_000}
            step={250_000}
            onChange={(v) => setTvm({ targetToday: v })}
            formatValue={formatCompactINR}
          />
          <Slider
            label="Horizon (years)"
            value={tvm.horizonYears}
            min={3}
            max={35}
            onChange={(v) => setTvm({ horizonYears: v })}
            formatValue={(v) => `${v} yrs`}
          />
          <Slider
            label="Inflation"
            value={tvm.inflationPct}
            min={4}
            max={12}
            step={0.25}
            accent="amber"
            onChange={(v) => setTvm({ inflationPct: v })}
            formatValue={(v) => formatPct(v, 2)}
            hint="Long-run India CPI ≈ 6.65%. Education inflation ≈ 9–10%."
          />
          <Slider
            label="Gross expected return"
            value={tvm.expectedReturnPct}
            min={6}
            max={18}
            step={0.5}
            onChange={(v) => setTvm({ expectedReturnPct: v })}
            formatValue={(v) => formatPct(v, 1)}
            hint={`Your Stage 1 allocation implies ≈ ${allocationReturn.toFixed(1)}%.`}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTvm({ expectedReturnPct: Number(allocationReturn.toFixed(1)) })}
          >
            Use allocation return ({allocationReturn.toFixed(1)}%)
          </Button>
          <Slider
            label="Expense ratio (TER)"
            value={tvm.expenseRatioPct}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => setTvm({ expenseRatioPct: v })}
            formatValue={(v) => formatPct(v, 2)}
            hint="Deducted from gross return before every projection."
          />
          <Slider
            label="Annual SIP step-up"
            value={tvm.stepUpPct}
            min={0}
            max={20}
            accent="emerald"
            onChange={(v) => setTvm({ stepUpPct: v })}
            formatValue={(v) => `${v}%`}
            hint="Increases the instalment each year with income growth."
          />
          <Slider
            label="Existing corpus"
            value={tvm.existingLumpSum}
            min={0}
            max={10_000_000}
            step={100_000}
            onChange={(v) => setTvm({ existingLumpSum: v })}
            formatValue={formatCompactINR}
          />

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={tvm.taxEnabled}
                onChange={(e) => setTvm({ taxEnabled: e.target.checked })}
                className="h-4 w-4 accent-stone-900"
              />
              Apply capital-gains tax at maturity
            </label>
            {tvm.taxEnabled ? (
              <div className="mt-2">
                <Slider
                  label="Effective tax rate"
                  value={tvm.taxRatePct}
                  min={0}
                  max={30}
                  step={0.5}
                  onChange={(v) => setTvm({ taxRatePct: v })}
                  formatValue={(v) => formatPct(v, 1)}
                />
              </div>
            ) : null}
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-7">
          <Card className="bg-gradient-to-br from-white to-ivory-100/60 p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Required monthly SIP
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
                {formatINR(result.requiredMonthlySip)}
              </span>
              <span className="text-sm text-stone-500">/ month</span>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              {result.months} instalments {tvm.stepUpPct > 0 ? `with ${tvm.stepUpPct}% annual step-up ` : ""}
              to reach {formatINR(result.futureCostTarget)}.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Future cost" value={formatCompactINR(result.futureCostTarget)} />
              <StatCard label="Net return" value={formatPct(result.netReturnPct, 2)} tone="success" hint={`After ${formatPct(tvm.expenseRatioPct, 2)} TER`} />
              <StatCard label="Real return" value={formatPct(result.realReturnPct, 2)} tone="brand" hint="Above inflation" />
              <StatCard label="Lump sum today" value={formatCompactINR(result.lumpSumTodayRequired)} />
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Wealth mechanics" eyebrow="Breakdown" />
            <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full bg-stone-200">
              <div className="bg-stone-800" style={{ width: `${Math.min(100, investedPct)}%` }} />
              <div className="flex-1 bg-emerald-600" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <div>
                <div className="text-stone-500">Total invested</div>
                <div className="font-semibold text-stone-900">{formatINR(result.totalInvested)}</div>
              </div>
              <div>
                <div className="text-stone-500">Gains</div>
                <div className="font-semibold text-emerald-700">{formatINR(result.gains)}</div>
              </div>
              <div>
                <div className="text-stone-500">Final value</div>
                <div className="font-semibold text-stone-900">{formatINR(result.finalValue)}</div>
              </div>
              <div>
                <div className="text-stone-500">Post-tax value</div>
                <div className="font-semibold text-stone-900">{formatINR(result.postTaxValue)}</div>
              </div>
            </div>
            {tvm.taxEnabled ? (
              <Callout tone="warning" className="mt-3">
                Tax on gains at {formatPct(tvm.taxRatePct, 1)} costs {formatINR(result.taxPaid)}. The
                solver already grosses up the SIP so the <em>post-tax</em> corpus still hits the goal.
              </Callout>
            ) : null}
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Goal solved. Screen the fund universe next.
            </div>
            <Link to="/screener">
              <Button variant="accent">
                <Calculator className="h-3.5 w-3.5" /> Stage 3 <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-stone-200 p-4">
          <SectionTitle
            eyebrow="Amortisation"
            title="Year-by-year compounding"
            hint="Nominal value, cumulative capital, real purchasing power and progress to goal."
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 font-mono text-[10px] uppercase text-stone-600">
              <tr>
                <th className="px-3 py-2.5">Year</th>
                <th className="px-3 py-2.5">Annual outlay</th>
                <th className="px-3 py-2.5">Cumulative invested</th>
                <th className="px-3 py-2.5 text-emerald-700">Gains</th>
                <th className="px-3 py-2.5">Nominal value</th>
                <th className="px-3 py-2.5">Real value</th>
                <th className="px-3 py-2.5 text-right">% of goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {result.schedule.map((row) => (
                <tr key={row.year} className="hover:bg-stone-50">
                  <td className="px-3 py-2 font-sans font-medium text-stone-900">Year {row.year}</td>
                  <td className="px-3 py-2">{formatINR(row.annualOutlay)}</td>
                  <td className="px-3 py-2">{formatINR(row.cumulativeInvested)}</td>
                  <td className="px-3 py-2 text-emerald-700">+{formatINR(row.gains)}</td>
                  <td className="px-3 py-2 font-bold text-stone-900">{formatINR(row.nominalValue)}</td>
                  <td className="px-3 py-2 text-stone-500">{formatINR(row.realValue)}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-stone-200">
                        <span
                          className="block h-full rounded-full bg-stone-700"
                          style={{ width: `${row.pctOfGoal}%` }}
                        />
                      </span>
                      {row.pctOfGoal.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
