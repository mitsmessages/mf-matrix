import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { ErrorBoundary } from "./ErrorBoundary";
import { universeMeta } from "@/data/funds";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-3 py-5 sm:px-5">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <footer className="no-print mt-10 border-t border-stone-200 bg-stone-100/60">
        <div className="mx-auto w-full max-w-[1400px] px-3 py-6 sm:px-5">
          <div className="grid gap-4 text-xs text-stone-500 sm:grid-cols-3">
            <div>
              <div className="font-serif text-sm font-bold text-stone-800">Mutual Fund Matrix</div>
              <p className="mt-1 max-w-sm leading-relaxed">
                An educational decision engine built from a mutual-fund masterclass. Every number is
                derived from the dataset or clearly labelled as an assumption.
              </p>
            </div>
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Methods
              </div>
              <ul className="mt-1 space-y-0.5">
                <li>Canonical sleeve allocation</li>
                <li>Five-hurdle gatekeeper</li>
                <li>Method 2 sector valuation</li>
                <li>Covariance-based risk</li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Data &amp; risk
              </div>
              <ul className="mt-1 space-y-0.5">
                <li>Provenance: {universeMeta.provenance}</li>
                <li>As of: {universeMeta.asOf}</li>
                <li>Not investment advice</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 border-t border-stone-200 pt-4 text-[11px] text-stone-400">
            Past performance does not guarantee future results. Mutual fund investments are subject
            to market risk.
          </p>
        </div>
      </footer>
    </div>
  );
}
