import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, TrendingUp, Award, BarChart3, FileText, 
  PieChart, AlertTriangle, CheckCircle2, Layers, Briefcase, Sparkles,
  ExternalLink, Calendar
} from 'lucide-react';
import { Fund, FundManagerProfile } from '../types';
import { FundManagerModal } from './FundManagerModal';

interface FactsheetModalProps {
  fund: Fund | null;
  onClose: () => void;
  onOpenManager?: (profile: FundManagerProfile) => void;
}

export const FactsheetModal: React.FC<FactsheetModalProps> = ({ fund, onClose, onOpenManager }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rolling' | 'risk' | 'portfolio' | 'agents' | 'qoq'>('overview');
  const [selectedManagerProfile, setSelectedManagerProfile] = useState<FundManagerProfile | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedManagerProfile) {
          setSelectedManagerProfile(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedManagerProfile]);

  if (!fund) return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-ivory-100 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-white px-6 py-5 border-b border-stone-200/80 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                {fund.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ivory-200 text-stone-800 border border-stone-300">
                {fund.style} Style
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                fund.fiveStepFilter.verdict === 'QUALIFIED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : fund.fiveStepFilter.verdict === 'WATCHLIST'
                  ? 'bg-amber-50 text-brand-amber border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {fund.fiveStepFilter.totalScore}/5 {fund.fiveStepFilter.verdict}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-semibold tracking-tight">
              {fund.name}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
              <span>{fund.fundHouse}</span>
              <span>•</span>
              <span>Inception: {fund.inceptionYear}</span>
              <span>•</span>
              <span>Benchmark: {fund.benchmark}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/60 px-6 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('rolling')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'rolling' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-brand-amber" /> 3Y Rolling (10Y)
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'risk' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" /> Risk &amp; Capture
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'portfolio' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-brand-gold" /> Method 2 Valuation
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'agents' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-600" /> Council Verdict
          </button>
          <button
            onClick={() => setActiveTab('qoq')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'qoq' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> 5Y Quarterly (Q-o-Q)
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="ivory-card p-4">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Current NAV</span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-1 block">₹{fund.nav.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Daily updated</span>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Total AUM</span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-1 block">₹{fund.aumCr.toLocaleString('en-IN')} Cr</span>
                  <span className="text-[10px] text-stone-500 font-medium">Institutional Scale</span>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Expense Ratio</span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-1 block">{fund.expenseRatio}%</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Direct Plan TER</span>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Cash Level</span>
                  <span className="font-serif text-2xl font-bold text-brand-amber mt-1 block">{fund.cashHoldingPct}%</span>
                  <span className="text-[10px] text-stone-500 font-medium">Turnover: {(fund.portfolioTurnover * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ivory-card p-5">
                  <h3 className="font-serif text-base font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-stone-700" />
                    <span>Fund Manager &amp; Governance</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                      <span className="text-stone-500">Lead Manager</span>
                      <button
                        onClick={() => {
                          if (fund.managerProfile) {
                            if (onOpenManager) onOpenManager(fund.managerProfile);
                            else setSelectedManagerProfile(fund.managerProfile);
                          }
                        }}
                        className="font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 group transition-colors bg-emerald-50/70 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200/60"
                        title="Click to view full manager career track record, philosophy & managed schemes"
                      >
                        <span>{fund.fundManager}</span>
                        <ExternalLink className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-stone-100">
                      <span className="text-stone-500">Tenure at Scheme</span>
                      <span className="font-semibold text-brand-forest">{fund.fundManagerTenureYears} Years</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-stone-100">
                      <span className="text-stone-500">Portfolio Turnover</span>
                      <span className="font-semibold text-stone-900">{(fund.portfolioTurnover * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-stone-500">Benchmark Hurdle</span>
                      <span className="font-semibold text-stone-900">{fund.benchmark}</span>
                    </div>
                  </div>
                </div>

                <div className="ivory-card p-5">
                  <h3 className="font-serif text-base font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-forest" />
                    <span>The 5-Step Quant Gatekeeper (L10)</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-600">1. 3Y Rolling Return &gt; Benchmark</span>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${fund.fiveStepFilter.rollingPassed ? 'badge-pass' : 'badge-fail'}`}>
                        {fund.rollingDistribution.threeYearRollingAvg}% vs {fund.rollingDistribution.benchmarkRollingAvg}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-600">2. Sortino Ratio &gt; Benchmark</span>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${fund.fiveStepFilter.sortinoPassed ? 'badge-pass' : 'badge-fail'}`}>
                        {fund.riskMetrics.sortinoRatio} vs {fund.riskMetrics.benchmarkSortino}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-600">3. Jensen’s Alpha &gt; 0</span>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${fund.fiveStepFilter.alphaPassed ? 'badge-pass' : 'badge-fail'}`}>
                        {fund.riskMetrics.jensensAlpha > 0 ? `+${fund.riskMetrics.jensensAlpha}%` : `${fund.riskMetrics.jensensAlpha}%`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-600">4. Up-Capture Ratio &gt; 100</span>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${fund.fiveStepFilter.upCapturePassed ? 'badge-pass' : 'badge-fail'}`}>
                        {fund.riskMetrics.upCaptureRatio}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-600">5. Down-Capture Ratio &lt; 100</span>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${fund.fiveStepFilter.downCapturePassed ? 'badge-pass' : 'badge-fail'}`}>
                        {fund.riskMetrics.downCaptureRatio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLLING */}
          {activeTab === 'rolling' && (
            <div className="space-y-6">
              <div className="ivory-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900">
                      3-Year Rolling Returns Over 10-Year History
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Eliminates point-to-point trailing bias across hundreds of 3-year holding periods.
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    Outperforms Benchmark in {fund.rollingDistribution.percentBeatingBenchmark}% of periods
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-3.5 rounded-xl bg-ivory-200/60 border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Average 3Y Rolling</span>
                    <span className="font-serif text-xl font-bold text-stone-900 mt-0.5 block">{fund.rollingDistribution.threeYearRollingAvg}%</span>
                    <span className="text-[10px] text-emerald-600">Bench: {fund.rollingDistribution.benchmarkRollingAvg}%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ivory-200/60 border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Minimum 3Y Rolling</span>
                    <span className={`font-serif text-xl font-bold mt-0.5 block ${fund.rollingDistribution.threeYearRollingMin >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {fund.rollingDistribution.threeYearRollingMin}%
                    </span>
                    <span className="text-[10px] text-stone-500">Worst historical entry</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ivory-200/60 border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Maximum 3Y Rolling</span>
                    <span className="font-serif text-xl font-bold text-stone-900 mt-0.5 block">{fund.rollingDistribution.threeYearRollingMax}%</span>
                    <span className="text-[10px] text-stone-500">Best cycle peak</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ivory-200/60 border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Loss Probability (&lt;0%)</span>
                    <span className="font-serif text-xl font-bold text-emerald-700 mt-0.5 block">
                      {(100 - fund.rollingDistribution.percentPositiveReturns).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-stone-500">{fund.rollingDistribution.percentPositiveReturns}% positive</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {fund.rollingDistribution.brackets.map((b, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-stone-700">
                        <span>{b.label}</span>
                        <span>{b.percentage}% probability ({b.count} rolls)</span>
                      </div>
                      <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            b.label.includes('< 0%') ? 'bg-rose-500' : b.label.includes('> 20%') ? 'bg-emerald-600' : 'bg-brand-amber'
                          }`}
                          style={{ width: `${b.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* TAB 3: RISK */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="ivory-card p-4">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Standard Deviation (σ)</span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-1 block">{fund.riskMetrics.standardDeviation}%</span>
                  <p className="text-[11px] text-stone-500 mt-1">Total portfolio dispersion range (L07)</p>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Beta (β)</span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-1 block">{fund.riskMetrics.beta}</span>
                  <p className="text-[11px] text-stone-500 mt-1">Market risk relative to index (1.0)</p>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Sharpe Ratio</span>
                  <span className="font-serif text-2xl font-bold text-brand-forest mt-1 block">{fund.riskMetrics.sharpeRatio}</span>
                  <p className="text-[11px] text-stone-500 mt-1">Intra-category excess return per total risk</p>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Sortino Ratio</span>
                  <span className="font-serif text-2xl font-bold text-emerald-700 mt-1 block">{fund.riskMetrics.sortinoRatio}</span>
                  <p className="text-[11px] text-stone-500 mt-1">Downside risk-adjusted efficiency (L09)</p>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Jensen’s Alpha</span>
                  <span className={`font-serif text-2xl font-bold mt-1 block ${fund.riskMetrics.jensensAlpha > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {fund.riskMetrics.jensensAlpha > 0 ? `+${fund.riskMetrics.jensensAlpha}%` : `${fund.riskMetrics.jensensAlpha}%`}
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1">True stock-picking alpha above CAPM</p>
                </div>
                <div className="ivory-card p-4">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">R-Squared (R²)</span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-1 block">{fund.riskMetrics.rSquared}</span>
                  <p className="text-[11px] text-stone-500 mt-1">Style purity vs benchmark index</p>
                </div>
              </div>

              <div className="ivory-card p-6 bg-gradient-to-br from-white to-ivory-50">
                <h3 className="font-serif text-base font-semibold text-stone-900 mb-4 flex items-center justify-between">
                  <span>Up-Capture vs Down-Capture Asymmetry (L09 &amp; L10)</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    Gap: +{(fund.riskMetrics.upCaptureRatio - fund.riskMetrics.downCaptureRatio).toFixed(1)} pts
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-stone-700 uppercase">Up-Capture Ratio</span>
                      <span className={`text-sm font-bold ${fund.riskMetrics.upCaptureRatio >= 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {fund.riskMetrics.upCaptureRatio}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (fund.riskMetrics.upCaptureRatio / 130) * 100)}%` }} />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-2">During market rallies, fund captures {fund.riskMetrics.upCaptureRatio}%. Target: &gt; 100.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-stone-700 uppercase">Down-Capture Ratio</span>
                      <span className={`text-sm font-bold ${fund.riskMetrics.downCaptureRatio <= 100 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {fund.riskMetrics.downCaptureRatio}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${fund.riskMetrics.downCaptureRatio <= 100 ? 'bg-emerald-600' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, (fund.riskMetrics.downCaptureRatio / 130) * 100)}%` }} />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-2">During market drops, fund falls only {fund.riskMetrics.downCaptureRatio}%. Target: &lt; 100.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="ivory-card-subtle p-4 border-amber-200/60 bg-amber-50/40">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Masterclass Method 2: Sector-Appropriate Multiples Decomposition (L11)
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Evaluating an entire mutual fund on a single P/E ratio is intellectually flawed. Banks must be audited on P/B; Power/Telecom on EV/EBITDA; Autos on Price/Sales; PSUs on Dividend Yield.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="ivory-card p-3.5 text-center">
                  <span className="text-[10px] uppercase text-stone-500 font-semibold block">IT/Pharma/FMCG</span>
                  <span className="font-serif text-lg font-bold text-stone-900 mt-1 block">{fund.weightedMultiples.pe ? `${fund.weightedMultiples.pe}x` : 'N/A'}</span>
                  <span className="text-[10px] text-brand-amber font-medium">P/E Multiple</span>
                </div>
                <div className="ivory-card p-3.5 text-center">
                  <span className="text-[10px] uppercase text-stone-500 font-semibold block">Banks &amp; NBFCs</span>
                  <span className="font-serif text-lg font-bold text-stone-900 mt-1 block">{fund.weightedMultiples.pb ? `${fund.weightedMultiples.pb}x` : 'N/A'}</span>
                  <span className="text-[10px] text-brand-forest font-medium">P/B Multiple</span>
                </div>
                <div className="ivory-card p-3.5 text-center">
                  <span className="text-[10px] uppercase text-stone-500 font-semibold block">Power/Telecom</span>
                  <span className="font-serif text-lg font-bold text-stone-900 mt-1 block">{fund.weightedMultiples.evEbitda ? `${fund.weightedMultiples.evEbitda}x` : 'N/A'}</span>
                  <span className="text-[10px] text-stone-600 font-medium">EV/EBITDA</span>
                </div>
                <div className="ivory-card p-3.5 text-center">
                  <span className="text-[10px] uppercase text-stone-500 font-semibold block">Automobile</span>
                  <span className="font-serif text-lg font-bold text-stone-900 mt-1 block">{fund.weightedMultiples.priceToSales ? `${fund.weightedMultiples.priceToSales}x` : 'N/A'}</span>
                  <span className="text-[10px] text-stone-600 font-medium">Price/Sales</span>
                </div>
                <div className="ivory-card p-3.5 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-stone-500 font-semibold block">PSU Yield</span>
                  <span className="font-serif text-lg font-bold text-emerald-700 mt-1 block">{fund.weightedMultiples.dividendYield}%</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Dividend Yield</span>
                </div>
              </div>

              <div className="ivory-card p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-stone-900">Top 10 Portfolio Holdings</h3>
                    <p className="text-[11px] text-stone-500">Comprehensive breakdown with SEBI market cap tiers, valuation multiples &amp; investment thesis</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    Holdings: {fund.topHoldings.length} Securities
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 uppercase bg-stone-50/50">
                        <th className="py-2.5 px-3 font-semibold w-8">#</th>
                        <th className="py-2.5 px-3 font-semibold">Security Name</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Cap Tier</th>
                        <th className="py-2.5 px-3 font-semibold">Sector</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Weight</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Metric</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Multiple</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Price</th>
                        <th className="py-2.5 px-3 font-semibold">Investment Thesis / Moat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {fund.topHoldings.map((h, i) => (
                        <tr key={i} className="hover:bg-stone-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-stone-400 font-semibold">{i + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-stone-900 whitespace-nowrap">
                            {h.name} <span className="text-stone-400 font-normal">({h.ticker})</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                              h.marketCapTier === 'Large Cap'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : h.marketCapTier === 'Mid Cap'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : h.marketCapTier === 'Small Cap'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}>
                              {h.marketCapTier || 'Large Cap'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 whitespace-nowrap">{h.sector}</td>
                          <td className="py-2.5 px-3 font-bold text-stone-900 text-right">{h.weight.toFixed(1)}%</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-ivory-200 text-[10px] font-medium text-stone-700">
                              {h.valuationMetric}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-serif font-semibold text-stone-900 text-right">
                            {h.metricValue}{h.valuationMetric === 'Dividend Yield' ? '%' : 'x'}
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 text-right font-mono">
                            ₹{h.marketPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 text-[11px] max-w-xs truncate" title={h.rationale}>
                            {h.rationale || 'High return on capital'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COUNCIL VERDICT */}
          {activeTab === 'agents' && (
            <div className="space-y-4">
              <div className="ivory-card p-5 border-l-4 border-l-stone-900">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-stone-900">Aarav Chen</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-amberLight text-brand-amber font-semibold">Aggressive</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">Rating: {fund.agentReviews.aggressive.score}/10 ({fund.agentReviews.aggressive.stance})</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">"{fund.agentReviews.aggressive.comment}"</p>
              </div>

              <div className="ivory-card p-5 border-l-4 border-l-brand-forest">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-stone-900">Elena Rostova</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">Moderate</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">Rating: {fund.agentReviews.moderate.score}/10 ({fund.agentReviews.moderate.stance})</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">"{fund.agentReviews.moderate.comment}"</p>
              </div>

              <div className="ivory-card p-5 border-l-4 border-l-blue-600">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-stone-900">Marcus Vance</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold">Conservative</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">Rating: {fund.agentReviews.conservative.score}/10 ({fund.agentReviews.conservative.stance})</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">"{fund.agentReviews.conservative.comment}"</p>
              </div>

              <div className="ivory-card p-5 border-l-4 border-l-purple-600">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-stone-900">Dr. Kabir Sen</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold">Macro Strategist</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">Rating: {fund.agentReviews.macro.score}/10 ({fund.agentReviews.macro.stance})</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">"{fund.agentReviews.macro.comment}"</p>
              </div>

              <div className="ivory-card p-5 border-l-4 border-l-amber-600">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-stone-900">Sarah Montgomery, CFA</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">Due Diligence</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">Rating: {fund.agentReviews.dueDiligence.score}/10 ({fund.agentReviews.dueDiligence.stance})</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">"{fund.agentReviews.dueDiligence.comment}"</p>
              </div>
            </div>
          )}

          {/* TAB 6: 5Y QUARTERLY (Q-o-Q) PERFORMANCE */}
          {activeTab === 'qoq' && (
            <div className="space-y-6">
              <div className="ivory-card-subtle p-4 border-emerald-200/60 bg-emerald-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      Quarter-on-Quarter (Q-o-Q) Performance Tracking (5 Years / 20 Quarters)
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Historical quarterly return series audited against benchmark ({fund.benchmark}) from Q1 2021 to Q4 2025.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    20 Quarters Audited
                  </span>
                </div>
              </div>

              {fund.quarterlyPerformance && fund.quarterlyPerformance.length > 0 ? (
                <>
                  {/* Summary Metric Cards */}
                  {(() => {
                    const totalQ = fund.quarterlyPerformance.length;
                    const beatQ = fund.quarterlyPerformance.filter(q => q.alpha >= 0).length;
                    const beatPct = ((beatQ / totalQ) * 100).toFixed(0);
                    const avgAlpha = (fund.quarterlyPerformance.reduce((acc, q) => acc + q.alpha, 0) / totalQ).toFixed(2);
                    const maxAlpha = Math.max(...fund.quarterlyPerformance.map(q => q.alpha)).toFixed(2);

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="ivory-card p-3.5 text-center">
                          <span className="text-[10px] uppercase text-stone-500 font-semibold block">Quarter Win Rate</span>
                          <span className="font-serif text-xl font-bold text-emerald-700 mt-1 block">{beatPct}%</span>
                          <span className="text-[10px] text-stone-500 font-medium">{beatQ} of {totalQ} quarters beat</span>
                        </div>
                        <div className="ivory-card p-3.5 text-center">
                          <span className="text-[10px] uppercase text-stone-500 font-semibold block">Avg Quarterly Alpha</span>
                          <span className={`font-serif text-xl font-bold mt-1 block ${Number(avgAlpha) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {Number(avgAlpha) >= 0 ? `+${avgAlpha}%` : `${avgAlpha}%`}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">Excess return per Q</span>
                        </div>
                        <div className="ivory-card p-3.5 text-center">
                          <span className="text-[10px] uppercase text-stone-500 font-semibold block">Best Single Quarter</span>
                          <span className="font-serif text-xl font-bold text-emerald-700 mt-1 block">+{maxAlpha}%</span>
                          <span className="text-[10px] text-emerald-600 font-medium">Peak relative outperformance</span>
                        </div>
                        <div className="ivory-card p-3.5 text-center">
                          <span className="text-[10px] uppercase text-stone-500 font-semibold block">Consistency Filter</span>
                          <span className="font-serif text-xl font-bold text-stone-900 mt-1 block">
                            {Number(beatPct) >= 65 ? 'SUPERIOR' : 'MODERATE'}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">L10 Quant Gatekeeper</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 20 Quarters Table */}
                  <div className="ivory-card p-5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500 uppercase bg-stone-50/50">
                            <th className="py-2.5 px-4 font-semibold">Quarter</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Fund Return (%)</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Benchmark ({fund.benchmark}) (%)</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Active Alpha (%)</th>
                            <th className="py-2.5 px-4 font-semibold text-center">Verdict</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-800">
                          {fund.quarterlyPerformance.map((item, idx) => {
                            const isPositive = item.alpha >= 0;
                            return (
                              <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                                <td className="py-2.5 px-4 font-bold text-stone-900 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                                  {item.quarter}
                                </td>
                                <td className={`py-2.5 px-4 font-bold text-right ${item.fundReturn >= 0 ? 'text-stone-900' : 'text-rose-600'}`}>
                                  {item.fundReturn > 0 ? `+${item.fundReturn.toFixed(2)}%` : `${item.fundReturn.toFixed(2)}%`}
                                </td>
                                <td className={`py-2.5 px-4 text-stone-600 text-right ${item.benchmarkReturn >= 0 ? '' : 'text-rose-600'}`}>
                                  {item.benchmarkReturn > 0 ? `+${item.benchmarkReturn.toFixed(2)}%` : `${item.benchmarkReturn.toFixed(2)}%`}
                                </td>
                                <td className={`py-2.5 px-4 font-bold text-right font-mono ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                                  {item.alpha > 0 ? `+${item.alpha.toFixed(2)}%` : `${item.alpha.toFixed(2)}%`}
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isPositive 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {isPositive ? 'OUTPERFORM' : 'LAG'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-stone-400 bg-white rounded-2xl border border-stone-200">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Quarterly performance data will be populated during next scheduled AMFI disclosure sync.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-white px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Institutional Audit: <strong className="text-stone-900">{fund.fiveStepFilter.summary}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-soft-sm"
          >
            Close Factsheet
          </button>
        </div>
      </div>

      {/* Fund Manager Profile Modal */}
      {selectedManagerProfile && (
        <FundManagerModal 
          profile={selectedManagerProfile}
          onClose={() => setSelectedManagerProfile(null)}
        />
      )}
    </div>
  );
};
