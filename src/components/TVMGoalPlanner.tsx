import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Check
} from 'lucide-react';
import { loadUserProfile, saveUserProfile, DEFAULT_USER_PROFILE } from '../utils/storage';

interface TVMGoalPlannerProps {
  initialExpectedReturn?: number;
  onNavigateToTab?: (tab: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm') => void;
}

export const TVMGoalPlanner: React.FC<TVMGoalPlannerProps> = ({ initialExpectedReturn, onNavigateToTab }) => {
  const initialSaved = useMemo(() => loadUserProfile().stage2, []);

  const [goalType, setGoalType] = useState<'retirement' | 'education' | 'wealth' | 'custom'>(
    initialSaved.goalType || 'retirement'
  );
  const [targetToday, setTargetToday] = useState<number>(
    initialSaved.targetToday ?? 10000000
  );
  const [horizonYears, setHorizonYears] = useState<number>(
    initialSaved.horizonYears ?? 10
  );
  const [inflationRate, setInflationRate] = useState<number>(
    initialSaved.inflationRate ?? 6.65
  );
  const [expectedReturn, setExpectedReturn] = useState<number>(
    initialSaved.expectedReturn ?? (initialExpectedReturn ?? 11.5)
  );
  const [existingSavings, setExistingSavings] = useState<number>(
    initialSaved.existingSavings ?? 0
  );

  useEffect(() => {
    if (initialExpectedReturn !== undefined && initialExpectedReturn > 0) {
      setExpectedReturn(parseFloat(initialExpectedReturn.toFixed(1)));
    }
  }, [initialExpectedReturn]);

  // Persist state changes to user profile
  useEffect(() => {
    saveUserProfile({
      stage2: {
        goalType,
        targetToday,
        horizonYears,
        inflationRate,
        expectedReturn,
        existingSavings
      }
    });
  }, [goalType, targetToday, horizonYears, inflationRate, expectedReturn, existingSavings]);

  const handleResetDefaults = () => {
    const def = DEFAULT_USER_PROFILE.stage2;
    setGoalType(def.goalType);
    setTargetToday(def.targetToday);
    setHorizonYears(def.horizonYears);
    setInflationRate(def.inflationRate);
    setExpectedReturn(def.expectedReturn);
    setExistingSavings(def.existingSavings);
  };

  // Calculations
  const rAnnual = expectedReturn / 100;
  const iAnnual = inflationRate / 100;
  const months = horizonYears * 12;
  const rMonthly = rAnnual / 12;

  // Future Value of target goal
  const futureCost = targetToday * Math.pow(1 + iAnnual, horizonYears);

  // Future Value of existing lump sum
  const futureExisting = existingSavings * Math.pow(1 + rAnnual, horizonYears);

  // Remaining shortfall
  const netFutureNeeded = Math.max(0, futureCost - futureExisting);

  // Monthly SIP needed (PMT Annuity Due formula)
  let requiredMonthlySIP = 0;
  if (months > 0 && rMonthly > 0) {
    requiredMonthlySIP = (netFutureNeeded * rMonthly) / ((Math.pow(1 + rMonthly, months) - 1) * (1 + rMonthly));
  }

  // Equivalent lump sum today (PV)
  const lumpSumTodayRequired = netFutureNeeded / Math.pow(1 + rAnnual, horizonYears);

  // Real Rate of return
  const realRate = ((1 + rAnnual) / (1 + iAnnual) - 1) * 100;

  // Total invested through SIP
  const totalSIPInvested = requiredMonthlySIP * months;
  const totalCapitalInvested = totalSIPInvested + existingSavings;
  const wealthCreated = futureCost - totalCapitalInvested;
  const annualInvestment = requiredMonthlySIP * 12;

  // Year-by-year compounding amortization matrix
  const yearlySchedule: Array<{
    year: number;
    annualInvested: number;
    cumulativeInvested: number;
    wealthGained: number;
    portfolioValue: number;
    realValue: number;
    percentOfGoal: number;
  }> = [];

  let runningPortfolio = existingSavings;
  let runningInvested = existingSavings;

  for (let yr = 1; yr <= horizonYears; yr++) {
    runningInvested += annualInvestment;
    for (let m = 0; m < 12; m++) {
      runningPortfolio = (runningPortfolio + requiredMonthlySIP) * (1 + rMonthly);
    }
    const yearGains = runningPortfolio - runningInvested;
    const realPurchasingPower = runningPortfolio / Math.pow(1 + iAnnual, yr);
    yearlySchedule.push({
      year: yr,
      annualInvested: annualInvestment,
      cumulativeInvested: runningInvested,
      wealthGained: Math.max(0, yearGains),
      portfolioValue: runningPortfolio,
      realValue: realPurchasingPower,
      percentOfGoal: Math.min(100, (runningPortfolio / (futureCost || 1)) * 100)
    });
  }

  const handlePreset = (preset: 'retirement' | 'education' | 'wealth') => {
    setGoalType(preset);
    if (preset === 'retirement') {
      setTargetToday(10000000); // 1 Crore
      setHorizonYears(20);
      setInflationRate(6.65);
      setExpectedReturn(12.0);
    } else if (preset === 'education') {
      setTargetToday(3500000); // 35 Lakhs
      setHorizonYears(12);
      setInflationRate(9.0); // Higher education inflation
      setExpectedReturn(12.5);
    } else {
      setTargetToday(5000000);
      setHorizonYears(10);
      setInflationRate(6.0);
      setExpectedReturn(13.0);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amberLight text-brand-amber text-xs font-semibold border border-brand-amber/20">
            <Clock className="w-3.5 h-3.5" /> Module L03: Time Value of Money & Goal Engineering
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/80">
            <Check className="w-3 h-3 text-emerald-600" /> Profile Auto-Saved
          </div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
          Disciplined Goal & SIP Planner
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-3xl">
          Scientific calculation of future inflated liabilities, real rate of return, and exact monthly SIP requirements.
          Linking investments to concrete life goals eliminates panic redemptions during market downturns.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-medium text-stone-500 mr-1">Goal Presets:</span>
        <button
          onClick={() => handlePreset('retirement')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
            goalType === 'retirement'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          🌅 Retirement Corpus (20Y)
        </button>
        <button
          onClick={() => handlePreset('education')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
            goalType === 'education'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          🎓 Child Higher Education (12Y)
        </button>
        <button
          onClick={() => handlePreset('wealth')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
            goalType === 'wealth'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          💎 Wealth Accumulation (10Y)
        </button>

        <button
          onClick={handleResetDefaults}
          className="sm:ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors border border-dashed border-stone-300"
          title="Reset goal inputs to defaults"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="ivory-card p-6 sm:p-7">
            <h2 className="font-serif text-lg font-semibold text-stone-900 mb-5 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Goal Parameters</span>
              <Calculator className="w-4 h-4 text-brand-amber" />
            </h2>

            {/* Target in today money */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1.5">
                  <span>Target Value in Today’s Money</span>
                  <span className="font-semibold text-stone-900">{formatINR(targetToday)}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="250000"
                  value={targetToday}
                  onChange={(e) => setTargetToday(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              {/* Horizon */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1.5">
                  <span>Investment Horizon (Years)</span>
                  <span className="font-semibold text-stone-900">{horizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  step="1"
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              {/* Inflation */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1.5">
                  <span>Estimated Annual Inflation</span>
                  <span className="font-semibold text-brand-amber">{inflationRate}%</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="12.0"
                  step="0.25"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-amber"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Average India CPI over past 17 years: 6.65%. Education inflation averages ~9-10%.
                </p>
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1.5">
                  <span>Expected Portfolio Return (CAGR)</span>
                  <span className="font-semibold text-brand-forest">{expectedReturn}%</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="18.0"
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-forest"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Equities average ~12-14%; Balanced/BAF ~10-11%; Debt ~7-8%.
                </p>
              </div>

              {/* Existing savings */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1.5">
                  <span>Existing Corpus Already Invested</span>
                  <span className="font-semibold text-stone-900">{formatINR(existingSavings)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={existingSavings}
                  onChange={(e) => setExistingSavings(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Masterclass Behavioral Lesson Card */}
          <div className="ivory-card-subtle p-5 border-amber-200/60 bg-amber-50/40">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-brand-amber shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  The Masterclass Behavioral Anchor (L03)
                </h4>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  "Random SIPs without goal designation get redeemed at the first sign of market panic. 
                  When your SIP is mapped directly to <strong>{formatINR(futureCost)} in {horizonYears} years</strong>, 
                  you will never stop investing during a crash—because stopping harms your life goal, not just an abstract number."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Card */}
          <div className="ivory-card p-6 sm:p-8 bg-gradient-to-br from-white via-ivory-50 to-ivory-100/60">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Required Monthly Contribution
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
                {formatINR(requiredMonthlySIP)}
              </span>
              <span className="text-sm font-medium text-stone-500">/ month</span>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              Monthly disciplined SIP required over <strong>{horizonYears} years</strong> ({months} installments) to fulfill this goal.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-200/80">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200/70">
                <span className="text-[11px] text-stone-500 block">Future Inflated Cost</span>
                <span className="font-serif text-lg font-semibold text-stone-900 mt-0.5 block">
                  {formatINR(futureCost)}
                </span>
                <span className="text-[10px] text-brand-amber font-medium">
                  +{((futureCost / targetToday - 1) * 100).toFixed(0)}% Inflation Surge
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200/70">
                <span className="text-[11px] text-stone-500 block">Real Return Rate</span>
                <span className="font-serif text-lg font-semibold text-brand-forest mt-0.5 block">
                  +{realRate.toFixed(2)}%
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  CAGR above inflation
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200/70 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-stone-500 block">Or One-Time Lump Sum</span>
                <span className="font-serif text-lg font-semibold text-stone-900 mt-0.5 block">
                  {formatINR(lumpSumTodayRequired)}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  Single deposit today
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown & Compounding Power Table */}
          <div className="ivory-card p-6">
            <h3 className="font-serif text-base font-semibold text-stone-900 mb-4 flex items-center justify-between">
              <span>Wealth Creation Mechanics</span>
              <span className="text-xs font-normal text-stone-500">Compounding breakdown</span>
            </h3>

            {/* Visual Bar representation */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs font-medium text-stone-600">
                <span>Capital Invested: {formatINR(totalCapitalInvested)}</span>
                <span className="text-brand-forest">Wealth Growth: {formatINR(wealthCreated)}</span>
              </div>
              <div className="h-4 w-full bg-stone-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-stone-800 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (totalCapitalInvested / futureCost) * 100)}%` }}
                  title="Your Capital"
                />
                <div 
                  className="bg-emerald-600 h-full transition-all duration-500 flex-1" 
                  title="Compounding Returns"
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Principal Contribution ({(totalCapitalInvested / futureCost * 100).toFixed(0)}%)</span>
                <span>Compounding Multiplier ({((futureCost / (totalCapitalInvested || 1))).toFixed(1)}x)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-ivory-200/70 border border-stone-200/60">
                <span className="text-stone-500 block">Total Fresh SIP Invested:</span>
                <span className="font-semibold text-stone-900 text-sm mt-0.5 block">{formatINR(totalSIPInvested)}</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/60">
                <span className="text-emerald-700 block">Existing Savings at Maturity:</span>
                <span className="font-semibold text-emerald-900 text-sm mt-0.5 block">{formatINR(futureExisting)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Wealth Accretion & Amortization Matrix */}
      <div className="ivory-card p-6 sm:p-7 mt-8 border border-stone-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200/70">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-forest" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Year-by-Year Investment & Compounding Matrix
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Annual cash outlay schedule, cumulative capital invested, compounded market growth, and inflation-adjusted purchasing power.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200/80">
              <span className="text-stone-500 text-[10px] uppercase font-mono block">Annual Investment</span>
              <span className="font-bold text-stone-900 font-mono">{formatINR(annualInvestment)}/yr</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200/80">
              <span className="text-stone-500 text-[10px] uppercase font-mono block">Total Outlay ({horizonYears}Y)</span>
              <span className="font-bold text-stone-900 font-mono">{formatINR(totalCapitalInvested)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80">
              <span className="text-emerald-700 text-[10px] uppercase font-mono block">Wealth Generated</span>
              <span className="font-bold text-emerald-800 font-mono">+{formatINR(wealthCreated)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">
              <span className="text-amber-800 text-[10px] uppercase font-mono block">Target Corpus</span>
              <span className="font-bold text-amber-900 font-mono">{formatINR(futureCost)}</span>
            </div>
          </div>
        </div>

        {/* Behavioral Education Banner */}
        <div className="my-4 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold">Why Target is {formatINR(futureCost)} and not ₹1.00 Crore:</strong>
            {" "}At 6.65% inflation, what costs ₹1 Crore today will cost {formatINR(futureCost)} in {horizonYears} years. 
            Notice how your nominal portfolio crosses ₹1.00 Crore around{" "}
            <strong>
              Year {yearlySchedule.find(s => s.portfolioValue >= 10000000)?.year || horizonYears}
            </strong>. By Year {horizonYears}, compounding delivers the full <strong>{formatINR(futureCost)}</strong>, fully preserving your ₹1.00 Crore true purchasing power!
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-600 font-medium">
                <th className="py-2.5 px-3 font-semibold">Year</th>
                <th className="py-2.5 px-3 font-semibold">Annual Outlay</th>
                <th className="py-2.5 px-3 font-semibold">Cumulative Invested</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-700">Compounded Growth</th>
                <th className="py-2.5 px-3 font-semibold text-stone-900">Portfolio Value</th>
                <th className="py-2.5 px-3 font-semibold text-stone-500">Real Purchasing Power</th>
                <th className="py-2.5 px-3 font-semibold text-right">Milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {yearlySchedule.map((row, idx) => {
                const isNominalCrossYear = row.portfolioValue >= 10000000 && (idx === 0 || yearlySchedule[idx - 1].portfolioValue < 10000000);
                const isFinalYear = row.year === horizonYears;

                return (
                  <tr 
                    key={row.year} 
                    className={`transition-colors hover:bg-stone-50/80 ${
                      isFinalYear ? 'bg-emerald-50/40 font-semibold' : isNominalCrossYear ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-stone-900 font-sans font-medium">
                      Year {row.year}
                      <span className="text-[10px] text-stone-400 font-mono block">({row.year * 12} mo)</span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-700">
                      {formatINR(row.annualInvested)}
                    </td>
                    <td className="py-2.5 px-3 text-stone-800 font-medium">
                      {formatINR(row.cumulativeInvested)}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 font-medium">
                      +{formatINR(row.wealthGained)}
                    </td>
                    <td className="py-2.5 px-3 text-stone-900 font-bold text-sm">
                      {formatINR(row.portfolioValue)}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500">
                      {formatINR(row.realValue)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      {isFinalYear ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ₹1 Cr Purchasing Power
                        </span>
                      ) : isNominalCrossYear ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          🎉 Crosses ₹1 Cr Nominal
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-stone-400 text-[11px]">
                          <span>{row.percentOfGoal.toFixed(0)}%</span>
                          <div className="w-12 h-1.5 bg-stone-200 rounded-full overflow-hidden hidden sm:inline-block">
                            <div 
                              className="bg-stone-700 h-full rounded-full" 
                              style={{ width: `${row.percentOfGoal}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Stage Navigation CTA */}
      {onNavigateToTab && (
        <div className="mt-8 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('council')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/80 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Stage 1: Council & Allocation
            </button>
            <div className="hidden md:block text-xs text-stone-500">
              Next: Pick top 10 percentile funds matching your asset sub-allocation blueprint.
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('catalog')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-forest text-white hover:bg-emerald-800 text-xs font-bold tracking-wide shadow-sm transition-all"
          >
            <span>Proceed to Stage 3: 5-Step Fund Screener</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
