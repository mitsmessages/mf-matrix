import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Circle, ArrowRight, Quote } from "lucide-react";
import { courseModules } from "@/data/curriculum";
import type { CourseModule, LabId } from "@/domain/content/types";
import { useProfile } from "@/store/profile";
import { Badge, Button, Callout, Card, ProgressBar } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

const LAB_ROUTES: Record<LabId, string | null> = {
  allocation: "/allocation",
  tvm: "/goal",
  screener: "/screener",
  diligence: "/diligence",
  none: null,
};

const LAB_LABELS: Record<LabId, string> = {
  allocation: "Open Allocation Lab",
  tvm: "Open Goal Solver",
  screener: "Open Screener",
  diligence: "Open Diligence Lab",
  none: "Continue to Stage 1 · Allocation",
};

/** Conceptual modules still get a forward CTA so no module is a dead end. */
const CONCEPT_CONTINUE_ROUTE = "/allocation";
const CONCEPT_CONTINUE_LABEL = "Apply in Stage 1 · Allocation";

export default function JourneyPage() {
  const [activeId, setActiveId] = useState(courseModules[0]!.id);
  const completed = useProfile((s) => s.completedModules);
  const toggleModule = useProfile((s) => s.toggleModule);

  const active = useMemo(
    () => courseModules.find((m) => m.id === activeId) ?? courseModules[0]!,
    [activeId],
  );
  const progress = Math.round((completed.length / courseModules.length) * 100);
  const labRoute = LAB_ROUTES[active.lab];

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white">
              The five-stage decision engine
            </h1>
            <p className="max-w-2xl text-xs text-stone-400">
              Twelve modules mapped one-to-one to the source lectures. Every module cites its
              lecture, states the retail pitfall, the institutional fix and the rule.
            </p>
          </div>
        </div>
        <div className="w-48">
          <ProgressBar
            value={progress}
            tone="success"
            label={`${completed.length}/${courseModules.length} complete`}
          />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-12">
        <nav aria-label="Curriculum modules" className="space-y-1.5 lg:col-span-4">
          {courseModules.map((module) => (
            <ModuleButton
              key={module.id}
              module={module}
              active={module.id === active.id}
              done={completed.includes(module.id)}
              onClick={() => setActiveId(module.id)}
            />
          ))}
        </nav>

        <div className="space-y-5 lg:col-span-8">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{active.code}</Badge>
                  <span className="text-xs text-stone-500">{active.category}</span>
                </div>
                <h2 className="mt-1.5 font-serif text-2xl font-bold text-stone-900">
                  {active.title}
                </h2>
                <p className="text-sm text-stone-600">{active.subtitle}</p>
              </div>
              <Button
                variant={completed.includes(active.id) ? "outline" : "primary"}
                size="sm"
                onClick={() => toggleModule(active.id)}
              >
                {completed.includes(active.id) ? "Marked complete" : "Mark complete"}
              </Button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Callout tone="danger" title="Retail pitfall">
                {active.commonMistake}
              </Callout>
              <Callout tone="success" title="Institutional fix">
                {active.scientificSolution}
              </Callout>
            </div>

            <Callout tone="brand" className="mt-3" title="Rule">
              {active.practicalRule}
            </Callout>

            <div className="mt-5 rounded-xl bg-stone-900 p-4 text-stone-100">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-amber-400">
                Mathematical model
              </div>
              <div className="space-y-3">
                {active.formulas.map((f) => (
                  <div key={f.name}>
                    <div className="overflow-x-auto rounded-lg border border-stone-800 bg-stone-950 p-2.5 font-mono text-xs text-amber-300">
                      {f.formula}
                    </div>
                    <p className="mt-1 text-[11px] text-stone-400">
                      <span className="font-semibold text-stone-300">{f.name}:</span>{" "}
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Key takeaways
              </h4>
              <ul className="mt-2 space-y-1.5">
                {active.keyInsights.map((insight) => (
                  <li key={insight} className="flex gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone-200 pt-4">
              <Quote className="h-3.5 w-3.5 text-stone-400" />
              <span className="text-[11px] text-stone-500">Source lectures:</span>
              {active.citations.map((c) => (
                <Badge key={c.lectureId} tone="neutral">
                  {c.lectureId} · {c.label}
                </Badge>
              ))}
            </div>
          </Card>

          {labRoute ? (
            <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Hands-on lab
                </div>
                <div className="text-sm text-stone-700">
                  Apply this module in the live engine.
                </div>
              </div>
              <Link to={labRoute}>
                <Button variant="accent" size="sm">
                  {LAB_LABELS[active.lab]} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>
          ) : (
            <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Conceptual module
                </div>
                <div className="max-w-xl text-sm text-stone-700">
                  This lesson has no standalone lab — its ideas feed the allocation and macro
                  overlays. Continue into the engine to apply them.
                </div>
              </div>
              <Link to={CONCEPT_CONTINUE_ROUTE}>
                <Button variant="accent" size="sm">
                  {CONCEPT_CONTINUE_LABEL} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ModuleButton({
  module,
  active,
  done,
  onClick,
}: {
  module: CourseModule;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
        active
          ? "border-stone-800 bg-white shadow-soft-md"
          : "border-stone-200 bg-stone-50/70 hover:border-stone-300 hover:bg-white",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          done
            ? "bg-emerald-100 text-emerald-800"
            : active
              ? "bg-stone-900 text-white"
              : "bg-stone-200 text-stone-600",
        )}
      >
        {done ? "✓" : module.order}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
            {module.code} · {module.category}
          </span>
          {active ? <Circle className="h-2 w-2 fill-amber-500 text-amber-500" /> : null}
        </span>
        <span className="block truncate text-xs font-semibold text-stone-800">{module.title}</span>
        <span className="block truncate text-[11px] text-stone-500">{module.subtitle}</span>
      </span>
    </button>
  );
}
