import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, Users, Wand2 } from "lucide-react";
import { agents } from "@/data/agents";
import { SLEEVES, SLEEVE_KEYS, ALLOCATION_PRESETS } from "@/domain/finance/sleeves";
import type { AllocationModel, RiskProfile } from "@/domain/finance/sleeves";
import type { SleeveWeights } from "@/domain/finance/types";
import { summariseRisk } from "@/domain/finance/portfolio";
import { useProfile, totalWeight } from "@/store/profile";
import {
  Badge,
  Button,
  Callout,
  Card,
  ProgressBar,
  SectionTitle,
  Segmented,
  Slider,
  StatCard,
} from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

const PROFILE_OPTIONS = [
  { value: "aggressive" as RiskProfile, label: "Aggressive" },
  { value: "moderate" as RiskProfile, label: "Moderate" },
  { value: "conservative" as RiskProfile, label: "Conservative" },
];

const MODEL_OPTIONS = [
  { value: "baseline" as AllocationModel, label: "L02 Baseline" },
  { value: "enhanced" as AllocationModel, label: "Council Enhanced" },
];

export default function AllocationPage() {
  const profile = useProfile((s) => s.profile);
  const model = useProfile((s) => s.model);
  const weights = useProfile((s) => s.weights);
  const setProfile = useProfile((s) => s.setProfile);
  const setModel = useProfile((s) => s.setModel);
  const setWeight = useProfile((s) => s.setWeight);
  const setWeights = useProfile((s) => s.setWeights);
  const autoBalance = useProfile((s) => s.autoBalance);
  const resetWeights = useProfile((s) => s.resetWeights);
  const fillRemainingToDebt = useProfile((s) => s.fillRemainingToDebt);

  const total = totalWeight(weights);
  const balanced = total === 100;
  const risk = summariseRisk(weights);
  const preset = ALLOCATION_PRESETS[profile][model];
  const isPreset = sameWeights(weights, preset.weights);

  /** Don't silently discard a customised allocation. */
  const guardCustom = (action: () => void) => {
    if (isPreset || window.confirm("This will replace your custom allocation. Continue?")) {
      action();
    }
  };

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <Badge tone="brand" className="mb-1">
                Stage 1 · Lessons 01 &amp; 02
              </Badge>
              <h1 className="font-serif text-lg font-bold text-white">
                Strategic asset allocation
              </h1>
              <p className="max-w-2xl text-xs text-stone-400">
                Decide the sleeve mix before any fund is named. One canonical key set is shared by
                every later stage.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Segmented
              ariaLabel="Risk profile"
              options={PROFILE_OPTIONS}
              value={profile}
              onChange={(p) => guardCustom(() => setProfile(p))}
            />
            <Segmented
              ariaLabel="Allocation model"
              options={MODEL_OPTIONS}
              value={model}
              onChange={(m) => guardCustom(() => setModel(m))}
              className="bg-stone-800/80 border-stone-700"
            />
            {!isPreset ? (
              <span className="text-[10px] font-semibold text-amber-300">
                customised — switching profile replaces it
              </span>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <Card className="p-5">
            <SectionTitle
              eyebrow="Council"
              title="Adopt a committee mandate"
              hint="Each agent proposes a canonical sleeve mix. Adopt one as a starting point, then tune."
            />
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {agents.map((agent) => {
                const isActive = sameWeights(agent.allocation, weights);
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => guardCustom(() => setWeights(agent.allocation))}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-colors",
                      isActive
                        ? "border-amber-400 bg-amber-50/70 ring-1 ring-amber-300"
                        : "border-stone-200 bg-white hover:border-stone-300",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Badge tone={agentTone(agent.variant)}>{agent.variant}</Badge>
                      {isActive ? <span className="text-[10px] text-amber-700">applied</span> : null}
                    </div>
                    <div className="mt-1.5 text-xs font-bold text-stone-900">{agent.name}</div>
                    <div className="text-[11px] text-stone-500">{agent.tagline}</div>
                    <div className="mt-2 font-mono text-[10px] text-stone-600">
                      {SLEEVE_KEYS.filter((k) => agent.allocation[k] > 0)
                        .map((k) => `${SLEEVES[k].shortLabel} ${agent.allocation[k]}`)
                        .join(" · ")}
                    </div>
                  </button>
                );
              })}
            </div>
            <Callout tone="brand" className="mt-4">
              {preset.title}: {preset.description}
            </Callout>
          </Card>

          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SectionTitle
                eyebrow="Sleeves"
                title="Allocation sliders"
                hint="Drag freely. The engine re-normalises active sleeves at every downstream stage."
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={fillRemainingToDebt} disabled={total >= 100}>
                  Fill rest to debt
                </Button>
                <Button variant="outline" size="sm" onClick={autoBalance}>
                  Auto-balance
                </Button>
                <Button variant="ghost" size="sm" onClick={resetWeights} aria-label="Reset to preset">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {SLEEVE_KEYS.map((key) => (
                <Slider
                  key={key}
                  label={SLEEVES[key].label}
                  value={weights[key] ?? 0}
                  min={0}
                  max={100}
                  onChange={(v) => setWeight(key, v)}
                  accent={SLEEVES[key].broadType === "Equity" ? "stone" : SLEEVES[key].broadType === "Commodity" ? "amber" : "emerald"}
                  hint={`${SLEEVES[key].role} · expected ~${SLEEVES[key].expectedCagrPct}% CAGR · horizon ${SLEEVES[key].horizon}`}
                  formatValue={(v) => `${v}%`}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <SectionTitle title="Live portfolio metrics" />
              <Badge tone={balanced ? "success" : total > 100 ? "danger" : "warning"}>
                {total}% allocated
              </Badge>
            </div>
            <ProgressBar
              className="mt-3"
              value={total}
              tone={balanced ? "success" : total > 100 ? "danger" : "warning"}
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard
                label="Expected CAGR"
                value={`${risk.expectedCagrPct.toFixed(1)}%`}
                tone="success"
                hint="Weighted sleeve assumption"
              />
              <StatCard
                label="Portfolio volatility"
                value={`${risk.portfolioVolPct.toFixed(1)}%`}
                hint="Covariance-based"
              />
              <StatCard
                label="Naive volatility"
                value={`${risk.naiveVolPct.toFixed(1)}%`}
                hint="Weighted average"
              />
              <StatCard
                label="Diversification benefit"
                value={`${risk.diversificationBenefitPct.toFixed(1)}%`}
                tone="brand"
                hint="Lower risk from low correlation"
              />
            </div>
            <Callout tone="info" className="mt-4">
              Naive weighted drawdown would be {risk.naiveDrawdownPct.toFixed(1)}%. Real portfolios
              do better because sleeves are not perfectly correlated — the engine uses the
              covariance matrix, not a weighted sum.
            </Callout>
          </Card>

          <Card className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs font-bold text-stone-800">Next: size the goal</div>
              <div className="text-[11px] text-stone-500">
                {balanced
                  ? "Allocation balanced. Proceed to the goal solver."
                  : `Allocate ${Math.abs(100 - total)}% ${total > 100 ? "less" : "more"} to proceed cleanly.`}
              </div>
            </div>
            <Link to="/goal" aria-disabled={!balanced} tabIndex={balanced ? 0 : -1}>
              <Button variant="accent" disabled={!balanced}>
                <Wand2 className="h-3.5 w-3.5" /> Stage 2 <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function sameWeights(a: SleeveWeights, b: SleeveWeights): boolean {
  return SLEEVE_KEYS.every((k) => (a[k] ?? 0) === (b[k] ?? 0));
}

function agentTone(variant: string): "danger" | "warning" | "success" | "info" | "brand" {
  switch (variant) {
    case "Aggressive":
      return "danger";
    case "Moderate":
      return "warning";
    case "Conservative":
      return "success";
    case "Macro":
      return "brand";
    default:
      return "info";
  }
}
