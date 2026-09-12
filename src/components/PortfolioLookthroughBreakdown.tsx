import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PieChart, Info, Download, Filter, Check, ArrowUpDown, 
  Layers, TrendingUp, Calendar, ShieldCheck, ChevronDown, CheckCircle2,
  X, SlidersHorizontal, CheckSquare, Square, DollarSign, Wallet, ArrowRight,
  Calculator, Sparkles
} from 'lucide-react';
import { loadUserProfile, saveUserProfile } from '../utils/storage';
import { mutualFundsDatabase } from '../data/fundsDatabase';
import { Fund, StockHolding } from '../types';

interface CombinedStockHolding {
  ticker: string;
  name: string;
  sector: string;
  marketCapTier: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Debt/Cash' | 'Commodity';
  cumulativeWeight: number; // percentage in total portfolio
  monthlyInvestment: number; // in INR
  lumpSumInvestment: number; // in INR
  contributingFunds: { fundName: string; fundWeight: number; stockWeightInFund: number; contribution: number }[];
  valuationMetric: string;
  metricValue: number;
  marketPrice: number;
  rationale: string;
}

export const PortfolioLookthroughBreakdown: React.FC = () => {
  const profile = useMemo(() => loadUserProfile(), []);
  
  // Custom weights from Stage 1 or standard balanced aggressive default
  const savedWeights = profile.stage1.customWeights;
  const weights: Record<string, number> = useMemo(() => {
    if (savedWeights && Object.keys(savedWeights).length > 0) {
      return savedWeights;
    }
    return { flexi: 40, mid: 25, large: 15, debt: 12, gold: 8 };
  }, [savedWeights]);

  const monthlySIP = 84407;

  // Lump sum state initialized from storage
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(() => {
    return profile.stage3?.lumpSumAmount || 1000000;
  });

  const [deploymentDisplayMode, setDeploymentDisplayMode] = useState<'both' | 'lumpsum' | 'sip'>('both');

  // Available fund choices per category
  const categoryOptions = useMemo(() => ({
    flexi: mutualFundsDatabase.filter(f => f.category === 'Flexi Cap'),
    mid: mutualFundsDatabase.filter(f => f.category === 'Mid Cap'),
    large: mutualFundsDatabase.filter(f => f.category === 'Large Cap'),
    debt: mutualFundsDatabase.filter(f => f.category === 'Arbitrage'),
    gold: mutualFundsDatabase.filter(f => f.category === 'Gold / Commodity')
  }), []);

  // Multi-selection state: array of selected fund IDs per category initialized from storage
  const [selectedFundIdsByCategory, setSelectedFundIdsByCategory] = useState<Record<string, string[]>>(() => {
    return profile.stage3?.selectedFundIdsByCategory || {
      flexi: ['ppfc-01'],
      mid: ['motilal-mc-01'],
      large: ['nippon-lc-01'],
      debt: ['kotak-arb-01'],
      gold: ['nippon-gold-01']
    };
  });

  // Persist selections to storage when changed
  const updateFundSelections = (newSelection: Record<string, string[]>) => {
    setSelectedFundIdsByCategory(newSelection);
    saveUserProfile({
      stage3: {
        selectedFundIdsByCategory: newSelection,
        lumpSumAmount: lumpSumAmount
      }
    });
  };

  // Update lump-sum amount and persist
  const handleLumpSumChange = (amount: number) => {
    const validAmount = Math.max(0, isNaN(amount) ? 0 : amount);
    setLumpSumAmount(validAmount);
    saveUserProfile({
      stage3: {
        selectedFundIdsByCategory: selectedFundIdsByCategory,
        lumpSumAmount: validAmount
      }
    });
  };

  // State to track which category dropdown menu is currently open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle fund selection in a category
  const handleToggleFund = (catKey: string, fundId: string) => {
    const current = selectedFundIdsByCategory[catKey] || [];
    let updatedCategory: string[];
    if (current.includes(fundId)) {
      updatedCategory = current.filter(id => id !== fundId);
    } else {
      updatedCategory = [...current, fundId];
    }
    const newSelections = { ...selectedFundIdsByCategory, [catKey]: updatedCategory };
    updateFundSelections(newSelections);
  };

  // Set category to "None" (clear all selections in that category)
  const handleSetCategoryNone = (catKey: string) => {
    const newSelections = {
      ...selectedFundIdsByCategory,
      [catKey]: []
    };
    updateFundSelections(newSelections);
  };

  // Helper to determine accurate market cap tier
  const getHoldingCapTier = (h: StockHolding): 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Debt/Cash' | 'Commodity' => {
    if (h.marketCapTier) return h.marketCapTier as any;
    const s = (h.sector || '').toLowerCase();
    const t = (h.ticker || '').toLowerCase();
    const n = (h.name || '').toLowerCase();
    if (s.includes('gold') || s.includes('precious') || s.includes('metal') || s.includes('commodity') || t.includes('gold') || n.includes('gold')) {
      return 'Commodity';
    }
    if (s.includes('debt') || s.includes('cash') || s.includes('arbitrage') || s.includes('bill')) {
      return 'Debt/Cash';
    }
    return 'Large Cap';
  };

  // DYNAMIC 100% RE-NORMALIZATION ENGINE:
  // When any category is set to None / unchecked, the active categories re-scale to sum to exactly 100%!
  // No void, no empty gap in donut, no unallocated money!
  const activeWeightTotal = useMemo(() => {
    let sum = 0;
    Object.entries(weights).forEach(([catKey, w]) => {
      const activeIds = selectedFundIdsByCategory[catKey] || [];
      if (activeIds.length > 0) {
        sum += (w || 0);
      }
    });
    return sum > 0 ? sum : 100;
  }, [weights, selectedFundIdsByCategory]);

  // Normalized effective percentage per category (sums to exactly 100%)
  const normalizedCategoryWeights = useMemo(() => {
    const result: Record<string, number> = {};
    Object.entries(weights).forEach(([catKey, w]) => {
      const activeIds = selectedFundIdsByCategory[catKey] || [];
      if (activeIds.length > 0) {
        result[catKey] = (w / activeWeightTotal) * 100;
      } else {
        result[catKey] = 0;
      }
    });
    return result;
  }, [weights, activeWeightTotal, selectedFundIdsByCategory]);

  // Compute Look-Through Aggregated Breakdown (ALWAYS SUMS TO 100%)
  const lookthrough = useMemo(() => {
    let large = 0;
    let mid = 0;
    let small = 0;
    let cashDebt = 0;
    let gold = 0;

    Object.entries(normalizedCategoryWeights).forEach(([catKey, catEffectivePct]) => {
      if (catEffectivePct <= 0) return;

      const activeIds = selectedFundIdsByCategory[catKey] || [];
      if (activeIds.length === 0) return;

      const weightPerScheme = (catEffectivePct / activeIds.length) / 100;

      activeIds.forEach(fId => {
        const fund = mutualFundsDatabase.find(f => f.id === fId);
        if (!fund) return;

        if (fund.marketCapBreakdown) {
          large += weightPerScheme * fund.marketCapBreakdown.largeCap;
          mid += weightPerScheme * fund.marketCapBreakdown.midCap;
          small += weightPerScheme * fund.marketCapBreakdown.smallCap;
          cashDebt += weightPerScheme * fund.marketCapBreakdown.cashDebt;
          gold += weightPerScheme * fund.marketCapBreakdown.commodity;
        } else {
          if (catKey === 'flexi') {
            large += weightPerScheme * 68;
            mid += weightPerScheme * 16;
            small += weightPerScheme * 2;
            cashDebt += weightPerScheme * 14;
          } else if (catKey === 'mid') {
            large += weightPerScheme * 12;
            mid += weightPerScheme * 76;
            small += weightPerScheme * 8;
            cashDebt += weightPerScheme * 4;
          } else if (catKey === 'large') {
            large += weightPerScheme * 88;
            mid += weightPerScheme * 8;
            cashDebt += weightPerScheme * 4;
          } else if (catKey === 'debt') {
            cashDebt += weightPerScheme * 100;
          } else if (catKey === 'gold') {
            gold += weightPerScheme * 99;
            cashDebt += weightPerScheme * 1;
          }
        }
      });
    });

    return {
      large: parseFloat(large.toFixed(1)),
      mid: parseFloat(mid.toFixed(1)),
      small: parseFloat(small.toFixed(1)),
      cashDebt: parseFloat(cashDebt.toFixed(1)),
      gold: parseFloat(gold.toFixed(1))
    };
  }, [normalizedCategoryWeights, selectedFundIdsByCategory]);

  // Aggregate underlying individual stock holdings across all selected funds
  // Dynamically uses normalizedCategoryWeights so all stocks sum to 100%, ₹84,407/mo SIP, and total lump-sum
  const combinedHoldings = useMemo(() => {
    const stockMap = new Map<string, CombinedStockHolding>();

    Object.entries(normalizedCategoryWeights).forEach(([catKey, catEffectivePct]) => {
      if (catEffectivePct <= 0) return;

      const activeIds = selectedFundIdsByCategory[catKey] || [];
      if (activeIds.length === 0) return;

      const effectiveSchemePct = (catEffectivePct / activeIds.length);

      activeIds.forEach(fId => {
        const fund = mutualFundsDatabase.find(f => f.id === fId);
        if (!fund || !fund.topHoldings) return;

        fund.topHoldings.forEach((holding: StockHolding) => {
          const key = holding.ticker || holding.name;
          const tier = getHoldingCapTier(holding);
          const stockContributionPct = (effectiveSchemePct * holding.weight) / 100;

          if (!stockMap.has(key)) {
            stockMap.set(key, {
              ticker: holding.ticker,
              name: holding.name,
              sector: holding.sector,
              marketCapTier: tier,
              cumulativeWeight: stockContributionPct,
              monthlyInvestment: (monthlySIP * stockContributionPct) / 100,
              lumpSumInvestment: (lumpSumAmount * stockContributionPct) / 100,
              contributingFunds: [{
                fundName: fund.shortName || fund.name,
                fundWeight: effectiveSchemePct,
                stockWeightInFund: holding.weight,
                contribution: stockContributionPct
              }],
              valuationMetric: holding.valuationMetric,
              metricValue: holding.metricValue,
              marketPrice: holding.marketPrice,
              rationale: holding.rationale || ''
            });
          } else {
            const existing = stockMap.get(key)!;
            existing.cumulativeWeight += stockContributionPct;
            existing.monthlyInvestment += (monthlySIP * stockContributionPct) / 100;
            existing.lumpSumInvestment += (lumpSumAmount * stockContributionPct) / 100;
            existing.contributingFunds.push({
              fundName: fund.shortName || fund.name,
              fundWeight: effectiveSchemePct,
              stockWeightInFund: holding.weight,
              contribution: stockContributionPct
            });
          }
        });
      });
    });

    return Array.from(stockMap.values()).sort((a, b) => b.cumulativeWeight - a.cumulativeWeight);
  }, [normalizedCategoryWeights, selectedFundIdsByCategory, lumpSumAmount]);

  // Selected asset class filter for stock table drilldown
  const [selectedStockTier, setSelectedStockTier] = useState<string>('All');
  const [stockSortField, setStockSortField] = useState<'weight' | 'name' | 'sector'>('weight');
  const [stockSortOrder, setStockSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredStocks = useMemo(() => {
    return combinedHoldings.filter(stock => {
      if (selectedStockTier === 'All') return true;
      if (selectedStockTier === 'Large Cap') return stock.marketCapTier === 'Large Cap';
      if (selectedStockTier === 'Mid Cap') return stock.marketCapTier === 'Mid Cap';
      if (selectedStockTier === 'Small Cap') return stock.marketCapTier === 'Small Cap';
      if (selectedStockTier === 'Commodity') return stock.marketCapTier === 'Commodity';
      if (selectedStockTier === 'Debt/Cash') return stock.marketCapTier === 'Debt/Cash';
      return true;
    }).sort((a, b) => {
      if (stockSortField === 'weight') {
        return stockSortOrder === 'desc' ? b.cumulativeWeight - a.cumulativeWeight : a.cumulativeWeight - b.cumulativeWeight;
      } else if (stockSortField === 'name') {
        return stockSortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      } else {
        return stockSortOrder === 'desc' ? b.sector.localeCompare(a.sector) : a.sector.localeCompare(b.sector);
      }
    });
  }, [combinedHoldings, selectedStockTier, stockSortField, stockSortOrder]);

  // Scheme by scheme deployment table data (for Lump-Sum and SIP)
  const schemeDeploymentBreakdown = useMemo(() => {
    const list: {
      categoryKey: string;
      categoryTitle: string;
      targetPct: number;
      normalizedPct: number;
      schemeId: string;
      schemeName: string;
      managerName: string;
      splitPct: number;
      effectiveSchemePct: number;
      lumpSumRupees: number;
      sipRupees: number;
      executionNote: string;
    }[] = [];

    const catMeta: Record<string, { title: string; note: string }> = {
      flexi: { title: 'Flexi Cap', note: 'Core Compounder: High active share equity, suitable for SIP or 6-month STP.' },
      mid: { title: 'Mid Cap', note: 'Alpha Engine: Stagger lump-sum via 6 to 12-month STP to average volatility.' },
      large: { title: 'Large Cap', note: 'Valuation Anchor: Tier-1 balance sheets provide market resilience.' },
      debt: { title: 'Arbitrage / Debt', note: 'Capital Shield: Ideal destination for initial lump sum, then STP to equity.' },
      gold: { title: 'Gold / Commodity', note: 'Crisis Hedge: Direct lump-sum deployment to capture INR hedge.' }
    };

    Object.entries(normalizedCategoryWeights).forEach(([catKey, normPct]) => {
      if (normPct <= 0) return;
      const activeIds = selectedFundIdsByCategory[catKey] || [];
      if (activeIds.length === 0) return;

      const splitPerFund = normPct / activeIds.length;
      const statedTarget = weights[catKey] || 0;

      activeIds.forEach(fId => {
        const fund = mutualFundsDatabase.find(f => f.id === fId);
        if (!fund) return;

        list.push({
          categoryKey: catKey,
          categoryTitle: catMeta[catKey]?.title || catKey,
          targetPct: statedTarget,
          normalizedPct: normPct,
          schemeId: fund.id,
          schemeName: fund.name,
          managerName: fund.fundManager,
          splitPct: 100 / activeIds.length,
          effectiveSchemePct: splitPerFund,
          lumpSumRupees: Math.round((lumpSumAmount * splitPerFund) / 100),
          sipRupees: Math.round((monthlySIP * splitPerFund) / 100),
          executionNote: catMeta[catKey]?.note || ''
        });
      });
    });

    return list;
  }, [normalizedCategoryWeights, selectedFundIdsByCategory, weights, lumpSumAmount, monthlySIP]);

  // CSV Export
  const downloadCSV = () => {
    const headers = ["Stock Name", "Ticker", "Sector", "Market Cap Tier", "Cumulative Weight (%)", "Monthly SIP Outlay (INR)", "Lump Sum Outlay (INR)", "Valuation Metric", "Metric Value", "Contributing Funds"];
    const rows = combinedHoldings.map(s => [
      `"${s.name}"`,
      `"${s.ticker}"`,
      `"${s.sector}"`,
      `"${s.marketCapTier}"`,
      s.cumulativeWeight.toFixed(2),
      s.monthlyInvestment.toFixed(0),
      s.lumpSumInvestment.toFixed(0),
      s.valuationMetric,
      s.metricValue,
      `"${s.contributingFunds.map(f => `${f.fundName} (${f.contribution.toFixed(2)}%)`).join('; ')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "combined_portfolio_holdings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVGs Slices computation (Dynamic 100% donut)
  const circumference = 2 * Math.PI * 80;
  const largeSlice = (lookthrough.large / 100) * circumference;
  const midSlice = (lookthrough.mid / 100) * circumference;
  const smallSlice = (lookthrough.small / 100) * circumference;
  const debtSlice = (lookthrough.cashDebt / 100) * circumference;
  const goldSlice = (lookthrough.gold / 100) * circumference;

  const largeOffset = 0;
  const midOffset = -largeSlice;
  const smallOffset = -(largeSlice + midSlice);
  const debtOffset = -(largeSlice + midSlice + smallSlice);
  const goldOffset = -(largeSlice + midSlice + smallSlice + debtSlice);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const lumpSumPresets = [100000, 500000, 1000000, 2500000, 5000000];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 rounded-xl p-4 shadow-sm border border-stone-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-stone-100 leading-tight">
                  Portfolio Look-Through & Capital Deployment Matrix
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
                  Stage 3 Look-Through
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold font-mono">
                  Synced with Stage 4
                </span>
              </div>
              <p className="text-stone-400 text-xs mt-0.5">
                Aggregating underlying stocks, resolving the asset allocation illusion, and calculating exact fund deployment cheques.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={downloadCSV}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download Portfolio CSV
            </button>
          </div>
        </div>
      </div>

      {/* COMPACT SCHEME SELECTION POPOVER BAR */}
      <div className="ivory-card p-4 border-stone-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              Select Active Schemes for Look-Through & Deployment
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Select 1 or more schemes per category (multi-selections split equally). Unchecked categories automatically re-normalize remaining funds to 100%.
            </p>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {activeWeightTotal < 100 
              ? `Re-Normalized: Active ${activeWeightTotal}% Scaled to 100.0%`
              : `Active Allocations: 100.0% Total`
            }
          </div>
        </div>

        {/* Compact Dropdown Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-3" ref={dropdownRef}>
          {(['flexi', 'mid', 'large', 'debt', 'gold'] as const).map(catKey => {
            const statedWeight = weights[catKey] || 0;
            const normalizedWeight = normalizedCategoryWeights[catKey] || 0;
            const activeIds = selectedFundIdsByCategory[catKey] || [];
            const isOpen = openDropdown === catKey;
            const options = categoryOptions[catKey] || [];
            const catTitle = catKey === 'flexi' ? 'Flexi Cap' : catKey === 'mid' ? 'Mid Cap' : catKey === 'large' ? 'Large Cap' : catKey === 'debt' ? 'Arbitrage / Debt' : 'Gold / Commodity';

            const summaryText = activeIds.length === 0
              ? 'None (0%)'
              : activeIds.length === 1
                ? `${mutualFundsDatabase.find(f => f.id === activeIds[0])?.shortName || 'Selected'} (${normalizedWeight.toFixed(1)}%)`
                : `${activeIds.length} funds (${(normalizedWeight / activeIds.length).toFixed(1)}% ea)`;

            return (
              <div key={catKey} className="relative">
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : catKey)}
                  className={`w-full p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between gap-1 shadow-sm ${
                    activeIds.length > 0
                      ? 'bg-stone-50 hover:bg-stone-100/90 border-stone-300'
                      : 'bg-stone-100/50 border-dashed border-stone-300 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-stone-900 truncate">
                      {catTitle}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      activeIds.length > 0 ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {statedWeight}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full mt-0.5">
                    <span className="text-[11px] text-stone-600 font-medium truncate max-w-[130px]" title={summaryText}>
                      {summaryText}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isOpen ? 'rotate-180 text-stone-900' : ''}`} />
                  </div>
                </button>

                {/* Floating Popover Menu */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-stone-300 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                      <span className="text-xs font-bold text-stone-900">
                        {catTitle} Options
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetCategoryNone(catKey)}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold underline"
                        >
                          Set None
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(null)}
                          className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Candidate Options Checklist */}
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {options.map(fund => {
                        const isChecked = activeIds.includes(fund.id);
                        const effectiveShare = isChecked 
                          ? (normalizedWeight / Math.max(1, activeIds.length)).toFixed(1)
                          : ((normalizedWeight || statedWeight) / (activeIds.length + 1)).toFixed(1);

                        return (
                          <div
                            key={fund.id}
                            onClick={() => handleToggleFund(catKey, fund.id)}
                            className={`p-2 rounded-lg cursor-pointer transition-all flex items-start gap-2 text-xs border ${
                              isChecked
                                ? 'bg-amber-50/70 border-amber-300 font-medium text-stone-900'
                                : 'bg-stone-50 hover:bg-stone-100 border-transparent text-stone-700'
                            }`}
                          >
                            <div className="mt-0.5">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-stone-900 truncate leading-tight">
                                {fund.shortName || fund.name}
                              </div>
                              <div className="text-[10px] text-stone-500 mt-0.5 flex items-center justify-between">
                                <span>{fund.fundManager}</span>
                                <span className={`font-mono font-bold px-1 rounded ${
                                  isChecked ? 'text-amber-800 bg-amber-100' : 'text-stone-500'
                                }`}>
                                  {effectiveShare}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-500">
                      <span>Multi-select splits evenly</span>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        className="px-2 py-0.5 bg-stone-900 text-white rounded text-[10px] font-bold"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DEDICATED ABSOLUTE LUMPSUM & SIP DEPLOYMENT CALCULATOR */}
      <div className="ivory-card p-5 border-amber-300 bg-amber-50/20 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900">
                Absolute Capital Deployment Calculator (Lump-Sum & Monthly SIP)
              </h2>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Enter any lump-sum amount. The engine computes exact rupee cheques per fund based on your active 100% normalized allocation.
            </p>
          </div>

          {/* Quick Display Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs self-end md:self-auto shrink-0 font-medium">
            <button
              onClick={() => setDeploymentDisplayMode('both')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                deploymentDisplayMode === 'both' ? 'bg-stone-900 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Both Outlays
            </button>
            <button
              onClick={() => setDeploymentDisplayMode('lumpsum')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                deploymentDisplayMode === 'lumpsum' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lump-Sum Only
            </button>
            <button
              onClick={() => setDeploymentDisplayMode('sip')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                deploymentDisplayMode === 'sip' ? 'bg-stone-900 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              SIP Only
            </button>
          </div>
        </div>

        {/* Input & Presets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 items-center">
          <div className="lg:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
              <span>Total Lump-Sum Investment (INR)</span>
              <span className="font-mono text-amber-700 font-bold">{formatINR(lumpSumAmount)}</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-500 font-bold text-sm">₹</span>
              <input
                type="number"
                min="0"
                step="10000"
                value={lumpSumAmount}
                onChange={(e) => handleLumpSumChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                placeholder="Enter custom lump-sum amount"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {lumpSumPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleLumpSumChange(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    lumpSumAmount === preset
                      ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs ring-1 ring-amber-600'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  {preset >= 10000000 
                    ? `₹${(preset / 10000000).toFixed(1)} Cr` 
                    : `₹${(preset / 100000).toFixed(0)} Lakh${preset > 100000 ? 's' : ''}`
                  }
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scheme-by-Scheme Cheque Allocation Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 uppercase font-mono text-[10px] border-y border-stone-200">
              <tr>
                <th className="p-3">Asset Category</th>
                <th className="p-3">Selected Mutual Fund Scheme</th>
                <th className="p-3">Effective Share</th>
                {(deploymentDisplayMode === 'both' || deploymentDisplayMode === 'lumpsum') && (
                  <th className="p-3 font-bold text-amber-900 bg-amber-100/50">Lump-Sum Cheque</th>
                )}
                {(deploymentDisplayMode === 'both' || deploymentDisplayMode === 'sip') && (
                  <th className="p-3 font-bold text-stone-900">Monthly SIP Cheque</th>
                )}
                <th className="p-3">Institutional Execution Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {schemeDeploymentBreakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-stone-900">{item.categoryTitle}</div>
                    <div className="text-[10px] font-mono text-stone-500">
                      Target: {item.targetPct}% {item.targetPct !== item.normalizedPct && `(Norm: ${item.normalizedPct.toFixed(1)}%)`}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-stone-900">{item.schemeName}</div>
                    <div className="text-[10px] text-stone-500">Manager: {item.managerName}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-stone-800">
                    {item.effectiveSchemePct.toFixed(1)}%
                    {item.splitPct < 100 && (
                      <span className="ml-1 text-[10px] text-amber-700 bg-amber-100 px-1 py-0.2 rounded font-normal">
                        50/50 split
                      </span>
                    )}
                  </td>
                  {(deploymentDisplayMode === 'both' || deploymentDisplayMode === 'lumpsum') && (
                    <td className="p-3 font-mono font-bold text-amber-900 text-sm bg-amber-50/60">
                      {formatINR(item.lumpSumRupees)}
                    </td>
                  )}
                  {(deploymentDisplayMode === 'both' || deploymentDisplayMode === 'sip') && (
                    <td className="p-3 font-mono font-bold text-stone-900 text-sm">
                      {formatINR(item.sipRupees)}/mo
                    </td>
                  )}
                  <td className="p-3 text-[11px] text-stone-600 max-w-xs">
                    {item.executionNote}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-900 text-stone-100 font-mono text-xs border-t-2 border-amber-500">
              <tr>
                <td className="p-3 font-bold uppercase" colSpan={2}>
                  Total Portfolio Allocation (100% Deployed)
                </td>
                <td className="p-3 font-bold text-amber-400">
                  100.0%
                </td>
                {(deploymentDisplayMode === 'both' || deploymentDisplayMode === 'lumpsum') && (
                  <td className="p-3 font-bold text-amber-300 text-sm bg-stone-950">
                    {formatINR(lumpSumAmount)}
                  </td>
                )}
                {(deploymentDisplayMode === 'both' || deploymentDisplayMode === 'sip') && (
                  <td className="p-3 font-bold text-stone-200 text-sm">
                    {formatINR(monthlySIP)}/mo
                  </td>
                )}
                <td className="p-3 text-[10px] text-stone-400 font-sans">
                  Mathematically balanced with zero unallocated void.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* LOOK-THROUGH VISUAL DONUT & BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 ivory-card p-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-4 border-b border-stone-200 pb-2">
            <div>
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                True Look-Through Exposure
              </h3>
              <p className="text-[11px] text-stone-500">
                Deconstructed economic weighting
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-semibold">
              Zero Void
            </span>
          </div>

          <div className="relative w-56 h-56 my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                className="text-stone-100 stroke-current"
                strokeWidth="24"
                fill="none"
              />
              {/* Large Cap */}
              <circle
                cx="100"
                cy="100"
                r="80"
                className="text-blue-600 stroke-current transition-all duration-500"
                strokeWidth="24"
                strokeDasharray={`${largeSlice} ${circumference}`}
                strokeDashoffset={largeOffset}
                fill="none"
              />
              {/* Mid Cap */}
              <circle
                cx="100"
                cy="100"
                r="80"
                className="text-amber-500 stroke-current transition-all duration-500"
                strokeWidth="24"
                strokeDasharray={`${midSlice} ${circumference}`}
                strokeDashoffset={midOffset}
                fill="none"
              />
              {/* Small Cap */}
              <circle
                cx="100"
                cy="100"
                r="80"
                className="text-emerald-500 stroke-current transition-all duration-500"
                strokeWidth="24"
                strokeDasharray={`${smallSlice} ${circumference}`}
                strokeDashoffset={smallOffset}
                fill="none"
              />
              {/* Debt / Cash */}
              <circle
                cx="100"
                cy="100"
                r="80"
                className="text-stone-500 stroke-current transition-all duration-500"
                strokeWidth="24"
                strokeDasharray={`${debtSlice} ${circumference}`}
                strokeDashoffset={debtOffset}
                fill="none"
              />
              {/* Gold */}
              <circle
                cx="100"
                cy="100"
                r="80"
                className="text-yellow-400 stroke-current transition-all duration-500"
                strokeWidth="24"
                strokeDasharray={`${goldSlice} ${circumference}`}
                strokeDashoffset={goldOffset}
                fill="none"
              />
            </svg>

            {/* Donut Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                True Exposure
              </span>
              <span className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                100%
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5">
                Aggregated
              </span>
            </div>
          </div>

          {/* Interactive Tier Click Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full mt-4 text-xs font-mono">
            <button
              onClick={() => setSelectedStockTier('Large Cap')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStockTier === 'Large Cap' ? 'bg-blue-50 border-blue-400 shadow-xs' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span>Large Cap</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{lookthrough.large}%</div>
            </button>

            <button
              onClick={() => setSelectedStockTier('Mid Cap')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStockTier === 'Mid Cap' ? 'bg-amber-50 border-amber-400 shadow-xs' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>Mid Cap</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{lookthrough.mid}%</div>
            </button>

            <button
              onClick={() => setSelectedStockTier('Small Cap')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStockTier === 'Small Cap' ? 'bg-emerald-50 border-emerald-400 shadow-xs' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Small Cap</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{lookthrough.small}%</div>
            </button>

            <button
              onClick={() => setSelectedStockTier('Debt/Cash')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStockTier === 'Debt/Cash' ? 'bg-stone-200 border-stone-400 shadow-xs' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-500 shrink-0" />
                <span>Debt/Cash</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{lookthrough.cashDebt}%</div>
            </button>

            <button
              onClick={() => setSelectedStockTier('Commodity')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStockTier === 'Commodity' ? 'bg-yellow-50 border-yellow-400 shadow-xs' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-yellow-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                <span>Commodity</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{lookthrough.gold}%</div>
            </button>

            <button
              onClick={() => setSelectedStockTier('All')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStockTier === 'All' ? 'bg-stone-800 text-white border-stone-900 shadow-xs' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className={`flex items-center gap-1.5 font-semibold ${selectedStockTier === 'All' ? 'text-stone-100' : 'text-stone-700'}`}>
                <span>Show All</span>
              </div>
              <div className={`text-sm font-bold mt-0.5 ${selectedStockTier === 'All' ? 'text-amber-400' : 'text-stone-900'}`}>
                100.0%
              </div>
            </button>
          </div>
        </div>

        {/* Right Col: Underlying Portfolio Stocks Table (7 Cols) */}
        <div className="lg:col-span-7 ivory-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                  <span>Underlying Portfolio Stocks & Combined Weights</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-200 text-stone-800">
                    {filteredStocks.length} Holdings
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Calculated cumulative stock weights and monetary allocation across your chosen funds
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <span className="text-[10px] text-stone-500 font-medium">Filter:</span>
                <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {selectedStockTier}
                </span>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto max-h-[360px] overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 sticky top-0 z-10 text-stone-700 uppercase font-mono text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-2.5 w-1/3">Stock / Asset</th>
                    <th className="p-2.5 w-24">Cap Tier</th>
                    <th 
                      className="p-2.5 w-24 cursor-pointer hover:bg-stone-200"
                      onClick={() => {
                        setStockSortField('weight');
                        setStockSortOrder(stockSortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Weight</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                      </div>
                    </th>
                    <th className="p-2.5 w-28 font-bold text-amber-900 bg-amber-50">Lump-Sum Outlay</th>
                    <th className="p-2.5 w-28">Monthly Outlay</th>
                    <th className="p-2.5">Source Funds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredStocks.map((stock, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-2.5">
                        <div className="font-semibold text-stone-900 truncate max-w-[170px]" title={stock.name}>
                          {stock.name}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {stock.sector} • {stock.ticker}
                        </div>
                      </td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          stock.marketCapTier === 'Large Cap' ? 'bg-blue-100 text-blue-800' :
                          stock.marketCapTier === 'Mid Cap' ? 'bg-amber-100 text-amber-800' :
                          stock.marketCapTier === 'Small Cap' ? 'bg-emerald-100 text-emerald-800' :
                          stock.marketCapTier === 'Commodity' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-stone-200 text-stone-800'
                        }`}>
                          {stock.marketCapTier}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-stone-900 whitespace-nowrap">
                        {stock.cumulativeWeight.toFixed(2)}%
                      </td>
                      <td className="p-2.5 font-mono font-bold text-amber-900 whitespace-nowrap bg-amber-50/40">
                        {formatINR(stock.lumpSumInvestment)}
                      </td>
                      <td className="p-2.5 font-mono font-semibold text-stone-800 whitespace-nowrap">
                        {formatINR(stock.monthlyInvestment)}
                      </td>
                      <td className="p-2.5 text-[10px] text-stone-600 max-w-[150px]">
                        {stock.contributingFunds.map((c, cIdx) => (
                          <span key={cIdx} className="inline-block bg-stone-100 px-1 py-0.2 rounded border border-stone-200 mr-1 mb-0.5">
                            {c.fundName}: {c.contribution.toFixed(1)}%
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 mt-3 flex items-center justify-between text-[11px] text-stone-500 font-mono">
            <span>Showing top {filteredStocks.length} holdings</span>
            <span className="font-bold text-stone-800">
              Top 10 Concentration: {filteredStocks.slice(0, 10).reduce((acc, s) => acc + s.cumulativeWeight, 0).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
