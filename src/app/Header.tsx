import { NavLink } from "react-router-dom";
import { LayoutGrid, RotateCcw } from "lucide-react";
import { STAGE_ROUTES } from "./routes";
import { useProfile } from "@/store/profile";
import { funds, universeMeta } from "@/data/funds";
import { relativeFromISO } from "@/lib/format";
import { cn } from "@/lib/cn";

const fundCount = funds.length;

export function Header() {
  const resetAll = useProfile((s) => s.resetAll);

  const handleReset = () => {
    if (window.confirm("Reset allocation, goal, selections and progress to defaults?")) {
      resetAll();
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-stone-200 bg-ivory-100/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2.5 sm:px-5">
        <NavLink to="/journey" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 font-serif text-sm font-bold text-ivory-100">
            M
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base font-bold tracking-tight text-stone-900">
              Mutual Fund Matrix
            </span>
            <span className="hidden text-[10px] text-stone-500 sm:block">
              Five-stage decision engine · real NAV data {relativeFromISO(universeMeta.asOf)}
            </span>
          </span>
        </NavLink>

        <nav aria-label="Stages" className="order-last -mx-1 flex w-full gap-1 overflow-x-auto pb-1 md:order-none md:mx-0 md:w-auto md:flex-1 md:justify-center md:pb-0">
          {STAGE_ROUTES.map((route) => (
            <NavLink
              key={route.to}
              to={route.to}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-white text-stone-900 shadow-soft-sm"
                    : "text-stone-600 hover:bg-white/70 hover:text-stone-900",
                )
              }
            >
              <span className="hidden lg:inline">{route.label}</span>
              <span className="lg:hidden">{route.shortLabel}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/screener"
            className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 sm:inline-flex"
          >
            <LayoutGrid className="h-3 w-3" />
            {fundCount} funds screened
          </NavLink>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-900"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
