import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Shield, 
  TrendingUp, BarChart3, PieChart, Layers, Search, Compass, Award, ExternalLink,
  Info, RefreshCw
} from 'lucide-react';
import { courseModules } from '../data/courseModules';
import { CourseModule } from '../types';

interface JourneyViewProps {
  onNavigateToTab: (tab: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm') => void;
  onOpenFundFactsheet?: (fundId: string) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({ onNavigateToTab, onOpenFundFactsheet }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('l01');
  const [completedModules, setCompletedModules] = useState<string[]>(['l01']);

  const activeModule: CourseModule = courseModules.find((m: CourseModule) => m.id === activeModuleId) || courseModules[0];
  const activeIndex = courseModules.findIndex((m: CourseModule) => m.id === activeModuleId);

  const toggleModuleCompleted = (id: string) => {
    if (completedModules.includes(id)) {
      setCompletedModules(completedModules.filter(mId => mId !== id));
    } else {
      setCompletedModules([...completedModules, id]);
    }
  };

  const handleNext = () => {
    if (activeIndex < courseModules.length - 1) {
      if (!completedModules.includes(activeModuleId)) {
        setCompletedModules([...completedModules, activeModuleId]);
      }
      setActiveModuleId(courseModules[activeIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveModuleId(courseModules[activeIndex - 1].id);
    }
  };

  // 26-year asset rotation sample data for L02 widget
  const rotationYears = [
    { year: '2019', best: 'Equity (+12.0%)', mid: 'Gold (+24.0%)', worst: 'Debt (+8.5%)', winner: 'Gold' },
    { year: '2020', best: 'Equity (+15.6%)', mid: 'Gold (+28.0%)', worst: 'Debt (+12.0%)', winner: 'Gold' },
    { year: '2021', best: 'Equity (+24.1%)', mid: 'Debt (+3.4%)', worst: 'Gold (-4.2%)', winner: 'Equity' },
    { year: '2022', best: 'Gold (+14.2%)', mid: 'Equity (+4.3%)', worst: 'Debt (+2.8%)', winner: 'Gold' },
    { year: '2023', best: 'Equity (+19.4%)', mid: 'Gold (+15.2%)', worst: 'Debt (+7.0%)', winner: 'Equity' },
    { year: '2024', best: 'Equity (+28.3%)', mid: 'Gold (+22.1%)', worst: 'Debt (+7.5%)', winner: 'Equity' },
  ];

  // Discarded Categories for L05 widget
  const discardedCategories = [
    { name: 'Thematic / Sectoral Funds', reason: 'High cyclicality; 80% retail investors buy at sector peaks and exit at bottoms.' },
    { name: 'Active Large Cap Funds', reason: 'SPIVA reports >85% active large caps fail to beat Nifty 50 TRI over 5Y/10Y after 1.5% TER.' },
    { name: 'Credit Risk Funds', reason: 'Asymmetric risk: Equity-like drawdown danger (defaults) for only 1.5% extra bond yield.' },
    { name: 'Dividend Yield Funds', reason: 'Suboptimal tax efficiency; forces cash payout rather than tax-advantaged internal compounding.' },
    { name: 'International FoFs', reason: 'Double taxation (debt tax treatment + LRS withholding) + double expense ratio layering.' },
    { name: 'Regular Plans (Distributor)', reason: '1.0% to 1.5% commission drag composes a loss of 30-40% of total wealth over 20 years.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner - Slim & Compact */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 rounded-xl p-3 sm:p-4 shadow-sm border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif font-bold text-stone-100 leading-tight">
                The Scientific Mutual Fund Decision Engine
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                11 Masterclass Modules
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">
              Derived from 14 lecture modules: risk profiling, asset allocation, quant filtering, and forensic due diligence.
            </p>
          </div>
        </div>

        <div className="bg-stone-800/90 border border-stone-700 px-3 py-1.5 rounded-lg flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <div className="w-6 h-6 rounded-full border-2 border-amber-500/40 border-t-amber-400 flex items-center justify-center font-bold text-[10px] text-amber-400 font-mono">
            {Math.round((completedModules.length / courseModules.length) * 100)}%
          </div>
          <div className="text-xs text-stone-300 font-medium">
            <span className="font-bold text-stone-100">{completedModules.length}</span> / {courseModules.length} Completed
          </div>
        </div>
      </div>

      {/* Main Grid: Module Navigator Sidebar + Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigator (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2 mb-2 flex justify-between items-center">
            <span>Curriculum Modules</span>
            <span>11 Lectures</span>
          </div>

          <div className="space-y-1.5 max-h-[780px] overflow-y-auto pr-1">
            {courseModules.map((module: CourseModule, idx: number) => {
              const isSelected = module.id === activeModuleId;
              const isDone = completedModules.includes(module.id);

              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModuleId(module.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-ivory-card border-stone-800 shadow-md ring-1 ring-stone-900/10'
                      : 'bg-stone-50/70 border-stone-200/80 hover:bg-stone-100/80 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isDone 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : isSelected 
                        ? 'bg-stone-900 text-white' 
                        : 'bg-stone-200 text-stone-600'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                        {module.lectureNumber} • {module.category}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                      )}
                    </div>
                    <div className={`text-xs font-semibold truncate ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                      {module.title}
                    </div>
                    <div className="text-[11px] text-stone-600 line-clamp-1">
                      {module.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Module Details & Lab (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Module Header */}
          <div className="ivory-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono uppercase bg-stone-900 text-stone-100">
                    {activeModule.lectureNumber}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    Category: {activeModule.category}
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {activeModule.title}
                </h2>
                <p className="text-stone-600 text-sm mt-0.5">
                  {activeModule.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleModuleCompleted(activeModule.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    completedModules.includes(activeModule.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {completedModules.includes(activeModule.id) ? 'Completed' : 'Mark Completed'}
                </button>
              </div>
            </div>

            {/* Contrast: Advisor Pitfall vs Scientific Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/90 text-rose-950">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  The Retail & Advisor Pitfall
                </div>
                <p className="text-xs leading-relaxed text-rose-900 font-medium">
                  {activeModule.commonAdvisorMistake}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 text-emerald-950">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Institutional Scientific Solution
                </div>
                <p className="text-xs leading-relaxed text-emerald-900 font-medium">
                  {activeModule.scientificSolution}
                </p>
              </div>
            </div>

            {/* Practical Rule & Formulas */}
            <div className="p-4 rounded-xl bg-stone-900 text-stone-100 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider font-mono text-amber-400 font-bold">
                  Rule & Mathematical Model
                </span>
                <span className="text-[11px] text-stone-400 font-mono">{activeModule.lectureNumber} Spec</span>
              </div>
              {activeModule.formulas && activeModule.formulas.length > 0 && (
                <div className="bg-stone-950 p-3 rounded-lg font-mono text-xs text-amber-300 overflow-x-auto border border-stone-800 mb-2">
                  {activeModule.formulas[0].formula}
                </div>
              )}
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {activeModule.practicalRule}
              </p>
            </div>

            {/* Key Takeaways */}
            <div>
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                Key Empirical Takeaways
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeModule.keyInsights.map((takeaway: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-xs text-stone-700">
                    <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Interactive Module Lab Widget */}
          <div className="ivory-card p-6 border-amber-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Interactive Lab: {activeModule.title}
                </h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                Hands-On Simulator
              </span>
            </div>

            {/* Module-Specific Simulation Widgets */}
            {activeModule.id === 'l01' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-600">
                  Time Value of Money (TVM) dictates that every financial dream must be mathematically bound to inflation and required rate of return. A target of ₹1 Crore in 20 years with 6% inflation is actually worth only ₹31 Lakhs in today's purchasing power!
                </p>
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase">Solve Your Custom Goal</div>
                    <div className="text-xs text-amber-800 mt-0.5">
                      Test inflation adjustments, required SIPs, and real rates of return in our dedicated TVM Solver.
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateToTab('tvm')}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shrink-0 shadow-sm"
                  >
                    Open TVM Goal Planner <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeModule.id === 'l02' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-600">
                  Historical asset class rotation proof: Over the last 26 years in India, no single asset class (Equity, Debt, Gold) has ever won consistently year-on-year. Chasing last year's top performer leads to catastrophic drawdowns.
                </p>
                <div className="overflow-x-auto border border-stone-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-100 text-stone-700 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2.5">Year</th>
                        <th className="p-2.5 text-emerald-800">1st (Top Performer)</th>
                        <th className="p-2.5 text-amber-800">2nd (Moderate)</th>
                        <th className="p-2.5 text-rose-800">3rd (Lagging)</th>
                        <th className="p-2.5 font-bold">Annual Winner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 font-mono">
                      {rotationYears.map((row, idx) => (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="p-2.5 font-bold text-stone-800">{row.year}</td>
                          <td className="p-2.5 font-semibold text-emerald-700 bg-emerald-50/50">{row.best}</td>
                          <td className="p-2.5 text-amber-700">{row.mid}</td>
                          <td className="p-2.5 text-rose-700">{row.worst}</td>
                          <td className="p-2.5 font-bold text-stone-900">{row.winner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-[11px] text-stone-500 italic">
                  Note how Gold crushed Equity in 2020 & 2022, while Equity surged in 2021, 2023, and 2024. Dynamic rebalancing is the only hedge.
                </div>
              </div>
            )}

            {activeModule.id === 'l03' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-600">
                  Why single P/E is fatal in mutual fund evaluation: You cannot apply P/E to ICICI Bank (Bank), Tata Power (High Capex), Bharti Airtel (Spectrum Debt), or Coal India (Cash Cow PSU). Method 2 requires sector-appropriate multiples.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-stone-100 border border-stone-200">
                    <div className="font-bold text-stone-800">Banks & NBFCs</div>
                    <div className="text-emerald-700 font-mono text-[11px] font-bold">Price-to-Book (P/B)</div>
                    <div className="text-[10px] text-stone-500">Loans are assets & liabilities; P/E distorted by provisioning.</div>
                  </div>
                  <div className="p-2.5 rounded bg-stone-100 border border-stone-200">
                    <div className="font-bold text-stone-800">Infra & Telecom</div>
                    <div className="text-emerald-700 font-mono text-[11px] font-bold">EV / EBITDA</div>
                    <div className="text-[10px] text-stone-500">Removes heavy depreciation & debt structure noise.</div>
                  </div>
                  <div className="p-2.5 rounded bg-stone-100 border border-stone-200">
                    <div className="font-bold text-stone-800">Cyclical & Autos</div>
                    <div className="text-emerald-700 font-mono text-[11px] font-bold">P/S (Price to Sales)</div>
                    <div className="text-[10px] text-stone-500">Margins oscillate violently; revenue shows true scale.</div>
                  </div>
                  <div className="p-2.5 rounded bg-stone-100 border border-stone-200">
                    <div className="font-bold text-stone-800">IT & FMCG</div>
                    <div className="text-emerald-700 font-mono text-[11px] font-bold">P/E & RoCE</div>
                    <div className="text-[10px] text-stone-500">Asset-light models where net income converts to free cash.</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToTab('ddlab')}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
                  >
                    Open Method 2 Portfolio DD Lab <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeModule.id === 'l05' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-600">
                  SEBI created 36 mutual fund categories. Smart institutional allocators eliminate over 75% of them immediately due to structural disadvantages. Here are the top categories discarded by our engine:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {discardedCategories.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-200 text-xs">
                      <div className="font-bold text-rose-900 flex items-center gap-1.5">
                        <span className="text-rose-600 font-mono">✕</span> {item.name}
                      </div>
                      <div className="text-[11px] text-rose-800 mt-1 leading-normal">
                        {item.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback for other modules */}
            {!['l01', 'l02', 'l03', 'l05'].includes(activeModule.id) && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Analyze In Mutual Fund Catalog
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    Inspect quantitative rolling returns, Sortino ratios, Jensen's Alpha, and Capture Shields for all qualified funds.
                  </div>
                </div>
                <button
                  onClick={() => onNavigateToTab('catalog')}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shrink-0 shadow-sm"
                >
                  View Screener Catalog <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Action Bottom Nav */}
            <div className="flex items-center justify-between pt-5 border-t border-stone-200 mt-5">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous Module
              </button>

              <div className="text-xs text-stone-400 font-mono">
                {activeIndex + 1} / {courseModules.length}
              </div>

              <button
                onClick={handleNext}
                disabled={activeIndex === courseModules.length - 1}
                className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                Next Module <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
