import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, Shield, TrendingUp, AlertCircle, Compass, CheckCircle2, 
  Layers, ArrowUpRight, BarChart2, Filter, FileText, ChevronRight,
  ArrowRight, Activity, Percent, DollarSign, ShieldAlert, Award, Sliders,
  HelpCircle, RefreshCw, BookOpen, Info, Plus, Minus, Check
} from 'lucide-react';
import { agentCouncil } from '../data/agentCouncil';
import { Agent } from '../types';
import { loadUserProfile, saveUserProfile } from '../utils/storage';

interface AgentCouncilViewProps {
  onOpenFundFactsheet: (fundId: string) => void;
  onNavigateToTab: (tab: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm') => void;
  onSetCustomExpectedReturn?: (cagr: number) => void;
}

interface CategoryBullet {
  key: string;
  val: string;
}

interface CategorySlice {
  id: string;
  name: string;
  categoryType: 'Equity' | 'Hybrid' | 'Debt' | 'Commodity';
  defaultWeight: number;
  expectedCagrVal: number;
  maxDrawdownVal: number;
  role: string;
  typicalHorizon: string;
  sebiBullets: CategoryBullet[];
  whyChosenBullets: CategoryBullet[];
}

export const AgentCouncilView: React.FC<AgentCouncilViewProps> = ({ 
  onOpenFundFactsheet,
  onNavigateToTab,
  onSetCustomExpectedReturn
}) => {
  const initialSavedProfile = useMemo(() => loadUserProfile().stage1, []);

  const [selectedRiskProfile, setSelectedRiskProfile] = useState<'aggressive' | 'moderate' | 'conservative'>(
    initialSavedProfile.selectedRiskProfile || 'aggressive'
  );
  const [activeAgentId, setActiveAgentId] = useState<string>(() => {
    const risk = initialSavedProfile.selectedRiskProfile || 'aggressive';
    return risk === 'moderate' ? 'agent-moderate' : risk === 'conservative' ? 'agent-conservative' : 'agent-aggressive';
  });
  const [selectedModel, setSelectedModel] = useState<'training' | 'council'>(
    initialSavedProfile.selectedModel || 'council'
  );
  const [customWeights, setCustomWeights] = useState<Record<string, number>>(
    initialSavedProfile.customWeights || {}
  );
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const isInitialMountRef = useRef<boolean>(true);

  const handleSelectRisk = (risk: 'aggressive' | 'moderate' | 'conservative') => {
    setSelectedRiskProfile(risk);
    if (risk === 'aggressive') setActiveAgentId('agent-aggressive');
    else if (risk === 'moderate') setActiveAgentId('agent-moderate');
    else if (risk === 'conservative') setActiveAgentId('agent-conservative');
  };

  const handleSelectAgent = (agentId: string) => {
    setActiveAgentId(agentId);
    if (agentId === 'agent-aggressive') setSelectedRiskProfile('aggressive');
    else if (agentId === 'agent-moderate') setSelectedRiskProfile('moderate');
    else if (agentId === 'agent-conservative') setSelectedRiskProfile('conservative');
  };

  // Base Category Architectures per model and risk profile
  const baseCategories = useMemo((): CategorySlice[] => {
    if (selectedRiskProfile === 'aggressive') {
      if (selectedModel === 'training') {
        // Pure Lecture 02 Baseline: 80% Equity / 20% Debt
        return [
          {
            id: 'flexi',
            name: 'Flexi Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 45,
            expectedCagrVal: 15.2,
            maxDrawdownVal: -30,
            role: 'Primary Compounder',
            typicalHorizon: '> 7 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Unconstrained across Large, Mid, Small, & Global caps' },
              { key: 'Mandate', val: 'Min 65% in equities with 0% market-cap restriction' },
              { key: 'L04 Concept', val: '"The new Large Cap" retaining true active stock-picking alpha' }
            ],
            whyChosenBullets: [
              { key: 'Core Wealth Anchor', val: 'Holds ~70% bluechips + 30% mid/global compounders' },
              { key: 'Crash Defense', val: 'Significantly lower drawdowns than pure Mid/Small caps' },
              { key: 'Manager Freedom', val: 'Can exit frothy sectors without rigid index constraints' }
            ]
          },
          {
            id: 'mid',
            name: 'Mid Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 25,
            expectedCagrVal: 16.5,
            maxDrawdownVal: -36,
            role: 'Alpha Booster',
            typicalHorizon: '> 7 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Companies ranked 101 to 250 by market capitalization' },
              { key: 'Mandate', val: 'Strict minimum 65% allocation in mid-cap stocks' },
              { key: 'Growth Profile', val: 'Fast-growing businesses scaling into tomorrow\'s leaders' }
            ],
            whyChosenBullets: [
              { key: 'Alpha Booster', val: 'Generates +2% to +4% extra CAGR over large caps (L02/L08)' },
              { key: '25% Risk Cap', val: 'Mathematical ceiling prevents devastating -40% crash panic' },
              { key: 'Capex Driver', val: 'Direct beneficiary of Indian manufacturing expansion' }
            ]
          },
          {
            id: 'large',
            name: 'Large Cap / Value Anchor',
            categoryType: 'Equity',
            defaultWeight: 10,
            expectedCagrVal: 13.0,
            maxDrawdownVal: -22,
            role: 'Franchise Stability',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Top 100 companies by market capitalization in India' },
              { key: 'Mandate', val: 'Strict minimum 80% invested in top 100 blue chips' },
              { key: 'Profile', val: 'Tier-1 balance sheets with highest institutional liquidity' }
            ],
            whyChosenBullets: [
              { key: 'Valuation Anchor', val: 'Fair P/B banking (Nippon/HDFC) cushions mid-cap volatility' },
              { key: 'Dividend Shield', val: 'Generates steady cash yield during sideways markets' },
              { key: 'Capital Safety', val: 'Lowest equity drawdown during macro selloffs' }
            ]
          },
          {
            id: 'debt',
            name: 'Arbitrage & Short Debt',
            categoryType: 'Debt',
            defaultWeight: 20,
            expectedCagrVal: 7.2,
            maxDrawdownVal: -1,
            role: 'Dry Powder Buffer',
            typicalHorizon: 'Liquidity / Buffer',
            sebiBullets: [
              { key: 'SEBI Strategy', val: 'Simultaneous buy in cash market & sell in futures market' },
              { key: 'Directional Risk', val: 'Zero equity market risk (completely market-neutral)' },
              { key: 'Tax Shield', val: 'Taxed as equity capital gains (12.5%) instead of 30% slab' }
            ],
            whyChosenBullets: [
              { key: 'Dry Powder Buffer', val: 'Liquid cash ready to buy equities when markets drop >15%' },
              { key: 'Predictable Yield', val: 'Consistent ~7.2% accrual with zero credit or default risk' },
              { key: '20% Debt Law', val: 'Enables systematic rebalancing without fresh capital' }
            ]
          }
        ];
      } else {
        // Council Enhanced: 80% Equity / 12% Debt / 8% Gold
        return [
          {
            id: 'flexi',
            name: 'Flexi Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 40,
            expectedCagrVal: 15.2,
            maxDrawdownVal: -30,
            role: 'Core Wealth Anchor',
            typicalHorizon: '> 7 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Unconstrained across Large, Mid, Small, & Global caps' },
              { key: 'Mandate', val: 'Min 65% in equities with 0% market-cap restriction' },
              { key: 'L04 Concept', val: '"The new Large Cap" retaining true active stock-picking alpha' }
            ],
            whyChosenBullets: [
              { key: 'Core Wealth Anchor', val: 'Holds ~70% bluechips + 30% mid/global compounders' },
              { key: 'Crash Defense', val: 'Significantly lower drawdowns than pure Mid/Small caps' },
              { key: 'Manager Freedom', val: 'Can exit frothy sectors without rigid index constraints' }
            ]
          },
          {
            id: 'mid',
            name: 'Mid Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 25,
            expectedCagrVal: 16.5,
            maxDrawdownVal: -36,
            role: 'Alpha Booster',
            typicalHorizon: '> 7 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Companies ranked 101 to 250 by market capitalization' },
              { key: 'Mandate', val: 'Strict minimum 65% allocation in mid-cap stocks' },
              { key: 'Growth Profile', val: 'Fast-growing businesses scaling into tomorrow\'s leaders' }
            ],
            whyChosenBullets: [
              { key: 'Alpha Booster', val: 'Generates +2% to +4% extra CAGR over large caps (L02/L08)' },
              { key: '25% Risk Cap', val: 'Mathematical ceiling prevents devastating -40% crash panic' },
              { key: 'Capex Driver', val: 'Direct beneficiary of Indian manufacturing expansion' }
            ]
          },
          {
            id: 'large',
            name: 'Large Cap / Value Anchor',
            categoryType: 'Equity',
            defaultWeight: 15,
            expectedCagrVal: 13.0,
            maxDrawdownVal: -22,
            role: 'Bluechip Cushion',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Top 100 companies by market capitalization in India' },
              { key: 'Mandate', val: 'Strict minimum 80% invested in top 100 blue chips' },
              { key: 'Profile', val: 'Tier-1 balance sheets with highest institutional liquidity' }
            ],
            whyChosenBullets: [
              { key: 'Valuation Anchor', val: 'Fair P/B banking (Nippon/HDFC) cushions mid-cap volatility' },
              { key: 'Dividend Shield', val: 'Generates steady cash yield during sideways markets' },
              { key: 'Capital Safety', val: 'Lowest equity drawdown during macro selloffs' }
            ]
          },
          {
            id: 'debt',
            name: 'Arbitrage & Short Debt',
            categoryType: 'Debt',
            defaultWeight: 12,
            expectedCagrVal: 7.2,
            maxDrawdownVal: -1,
            role: 'Rebalance Buffer',
            typicalHorizon: 'Liquidity / Buffer',
            sebiBullets: [
              { key: 'SEBI Strategy', val: 'Simultaneous buy in cash market & sell in futures market' },
              { key: 'Directional Risk', val: 'Zero equity market risk (completely market-neutral)' },
              { key: 'Tax Shield', val: 'Taxed as equity capital gains (12.5%) instead of 30% slab' }
            ],
            whyChosenBullets: [
              { key: 'Dry Powder Buffer', val: 'Liquid cash ready to buy equities when markets drop >15%' },
              { key: 'Predictable Yield', val: 'Consistent ~7.2% accrual with zero credit or default risk' },
              { key: '20% Debt Law', val: 'Enables systematic rebalancing without fresh capital' }
            ]
          },
          {
            id: 'gold',
            name: 'Sovereign Gold / Gold ETFs',
            categoryType: 'Commodity',
            defaultWeight: 8,
            expectedCagrVal: 11.5,
            maxDrawdownVal: -12,
            role: 'Crisis Shock Absorber',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Instrument', val: 'Physical 99.5% purity gold ETFs or RBI Sovereign Gold Bonds' },
              { key: 'Currency Peg', val: 'Tracks global spot gold price and USD/INR exchange rate' },
              { key: 'Default Risk', val: 'Zero credit/default risk; audited physical vaults or RBI backing' }
            ],
            whyChosenBullets: [
              { key: '2008 Crash Proof', val: 'Surged +11% in 2008 when Nifty collapsed -46%' },
              { key: 'Negative Correlation', val: 'Acts as counterweight when equity markets experience panic' },
              { key: 'Inflation Armor', val: 'Long-term store of purchasing power over decades' }
            ]
          }
        ];
      }
    } else if (selectedRiskProfile === 'conservative') {
      if (selectedModel === 'training') {
        // Pure Lecture 02 Baseline: 20% Equity / 80% Debt
        return [
          {
            id: 'large',
            name: 'Large Cap / Quality Flexi',
            categoryType: 'Equity',
            defaultWeight: 20,
            expectedCagrVal: 13.0,
            maxDrawdownVal: -22,
            role: 'CPI Inflation Breaker',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Top 100 blue chips with robust earnings & dividends' },
              { key: 'Mandate', val: 'Minimum 80% invested in top 100 Indian companies' },
              { key: 'Quality Filter', val: 'P/B and ROCE disciplined compounders' }
            ],
            whyChosenBullets: [
              { key: 'Inflation Hurdle', val: '100% debt post-tax gives ~5.7%, failing the 6.65% CPI hurdle' },
              { key: '20% Equity Law', val: 'L02 law: even conservative portfolios must beat inflation' },
              { key: '90% Principal Safe', val: 'Ensures capital growth without risking core savings' }
            ]
          },
          {
            id: 'arb',
            name: 'Arbitrage Funds',
            categoryType: 'Debt',
            defaultWeight: 45,
            expectedCagrVal: 7.2,
            maxDrawdownVal: -0.5,
            role: 'Liquid Protection',
            typicalHorizon: '> 6 Months',
            sebiBullets: [
              { key: 'Mechanism', val: 'Hedging cash against futures spread for market-neutral returns' },
              { key: 'Credit Risk', val: 'Zero credit and default risk' },
              { key: 'Tax Treatment', val: 'Equity taxation rate rather than highest slab rate' }
            ],
            whyChosenBullets: [
              { key: 'Capital Protection', val: 'Eliminates corporate bond downgrade/default risk' },
              { key: 'Drawdown Floor', val: 'Maximum historic drawdown less than -0.5%' },
              { key: 'Instant Liquidity', val: 'T+1 settlement for immediate cash emergencies' }
            ]
          },
          {
            id: 'corp',
            name: 'Corporate Bond / Banking & PSU',
            categoryType: 'Debt',
            defaultWeight: 35,
            expectedCagrVal: 7.8,
            maxDrawdownVal: -3,
            role: 'Coupon Accrual',
            typicalHorizon: '1 to 3 Years',
            sebiBullets: [
              { key: 'SEBI Mandate', val: 'Min 80% in AAA-rated corporate bonds and PSU debt papers' },
              { key: 'Credit Quality', val: 'Strict sovereign or quasi-sovereign highest safety ratings' },
              { key: 'Duration', val: '1 to 3 years target Macaulay duration' }
            ],
            whyChosenBullets: [
              { key: 'Predictable Income', val: 'High-grade quarterly accrual income for conservative goals' },
              { key: 'Capital Safety', val: 'Drawdown recovery under 18 months in any rate cycle' },
              { key: 'Low Volatility', val: 'Limits portfolio drawdown to under -3% even in rate hikes' }
            ]
          }
        ];
      } else {
        // Council Enhanced with Gold
        return [
          {
            id: 'large',
            name: 'Large Cap / Quality Flexi',
            categoryType: 'Equity',
            defaultWeight: 20,
            expectedCagrVal: 13.0,
            maxDrawdownVal: -22,
            role: 'CPI Inflation Breaker',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Top 100 blue chips with robust earnings & dividends' },
              { key: 'Mandate', val: 'Minimum 80% invested in top 100 Indian companies' },
              { key: 'Quality Filter', val: 'P/B and ROCE disciplined compounders' }
            ],
            whyChosenBullets: [
              { key: 'Inflation Hurdle', val: '100% debt post-tax gives ~5.7%, failing the 6.65% CPI hurdle' },
              { key: '20% Equity Law', val: 'L02 law: even conservative portfolios must beat inflation' },
              { key: '90% Principal Safe', val: 'Ensures capital growth without risking core savings' }
            ]
          },
          {
            id: 'arb',
            name: 'Arbitrage Funds',
            categoryType: 'Debt',
            defaultWeight: 40,
            expectedCagrVal: 7.2,
            maxDrawdownVal: -0.5,
            role: 'Liquid Protection',
            typicalHorizon: '> 6 Months',
            sebiBullets: [
              { key: 'Mechanism', val: 'Hedging cash against futures spread for market-neutral returns' },
              { key: 'Credit Risk', val: 'Zero credit and default risk' },
              { key: 'Tax Treatment', val: 'Equity taxation rate rather than highest slab rate' }
            ],
            whyChosenBullets: [
              { key: 'Capital Protection', val: 'Eliminates corporate bond downgrade/default risk' },
              { key: 'Drawdown Floor', val: 'Maximum historic drawdown less than -0.5%' },
              { key: 'Instant Liquidity', val: 'T+1 settlement for immediate cash emergencies' }
            ]
          },
          {
            id: 'corp',
            name: 'Corporate Bond / Banking & PSU',
            categoryType: 'Debt',
            defaultWeight: 30,
            expectedCagrVal: 7.8,
            maxDrawdownVal: -3,
            role: 'Coupon Accrual',
            typicalHorizon: '1 to 3 Years',
            sebiBullets: [
              { key: 'SEBI Mandate', val: 'Min 80% in AAA-rated corporate bonds and PSU debt papers' },
              { key: 'Credit Quality', val: 'Strict sovereign or quasi-sovereign highest safety ratings' },
              { key: 'Duration', val: '1 to 3 years target Macaulay duration' }
            ],
            whyChosenBullets: [
              { key: 'Predictable Income', val: 'High-grade quarterly accrual income for conservative goals' },
              { key: 'Capital Safety', val: 'Drawdown recovery under 18 months in any rate cycle' },
              { key: 'Low Volatility', val: 'Limits portfolio drawdown to under -3% even in rate hikes' }
            ]
          },
          {
            id: 'gold',
            name: 'Sovereign Gold / Gold ETFs',
            categoryType: 'Commodity',
            defaultWeight: 10,
            expectedCagrVal: 11.5,
            maxDrawdownVal: -12,
            role: 'Crisis Protection Buffer',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Instrument', val: 'Physical 99.5% purity gold ETFs or RBI Sovereign Gold Bonds' },
              { key: 'Currency Peg', val: 'Tracks global spot gold price and USD/INR exchange rate' },
              { key: 'Default Risk', val: 'Zero credit/default risk; audited physical vaults or RBI backing' }
            ],
            whyChosenBullets: [
              { key: '2008 Crash Proof', val: 'Surged +11% in 2008 when Nifty collapsed -46%' },
              { key: 'Negative Correlation', val: 'Acts as counterweight when equity markets experience panic' },
              { key: 'Inflation Armor', val: 'Long-term store of purchasing power over decades' }
            ]
          }
        ];
      }
    } else {
      // Moderate (50:50 or 50:40:10)
      if (selectedModel === 'training') {
        return [
          {
            id: 'flexi',
            name: 'Flexi Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 30,
            expectedCagrVal: 15.2,
            maxDrawdownVal: -30,
            role: 'Core Wealth Anchor',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Unconstrained across Large, Mid, Small, & Global caps' },
              { key: 'Mandate', val: 'Min 65% in equities with 0% market-cap restriction' },
              { key: 'L04 Concept', val: '"The new Large Cap" retaining true active alpha' }
            ],
            whyChosenBullets: [
              { key: 'Core Wealth Anchor', val: 'Holds ~70% bluechips + 30% mid/global compounders' },
              { key: 'Sortino > 1.5', val: 'Optimized risk-adjusted compounding' },
              { key: 'Manager Freedom', val: 'Dynamic positioning across market cycles' }
            ]
          },
          {
            id: 'mid',
            name: 'Mid Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 20,
            expectedCagrVal: 16.5,
            maxDrawdownVal: -36,
            role: 'Alpha Engine',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Companies ranked 101 to 250 by market capitalization' },
              { key: 'Mandate', val: 'Strict minimum 65% allocation in mid-cap stocks' },
              { key: 'Growth Profile', val: 'High Return on Equity (ROE) scaling businesses' }
            ],
            whyChosenBullets: [
              { key: 'Controlled Alpha', val: 'Boosts total returns without dominating drawdown' },
              { key: '20% Allocation', val: 'Comfortable balance for moderate risk tolerance' },
              { key: 'Earnings Growth', val: '15-20% domestic earnings compounding' }
            ]
          },
          {
            id: 'baf',
            name: 'Balanced Advantage Funds (BAF)',
            categoryType: 'Hybrid',
            defaultWeight: 25,
            expectedCagrVal: 11.8,
            maxDrawdownVal: -14,
            role: 'Counter-Cyclical Hedger',
            typicalHorizon: '> 3 Years',
            sebiBullets: [
              { key: 'SEBI Mandate', val: 'Dynamic 0% to 100% active shift between Equity and Debt' },
              { key: 'Tax Status', val: 'Maintains >65% gross equity via arbitrage for equity tax' },
              { key: 'Execution', val: 'In-house quant models (P/E, P/B, Dividend Yield triggers)' }
            ],
            whyChosenBullets: [
              { key: 'Auto Profit Booking', val: 'Trims equity at frothy peaks, buys at crash troughs' },
              { key: 'Half Crash Drawdown', val: 'Max historical dip limited to ~-14% vs -35% index' },
              { key: 'Zero Emotional Bias', val: 'Removes market-timing mistakes through algorithmic shifts' }
            ]
          },
          {
            id: 'debt',
            name: 'Arbitrage & Short Debt',
            categoryType: 'Debt',
            defaultWeight: 25,
            expectedCagrVal: 7.5,
            maxDrawdownVal: -2,
            role: 'Stability & Rebalance',
            typicalHorizon: '1 to 3 Years',
            sebiBullets: [
              { key: 'SEBI Strategy', val: 'Cash-futures arbitrage + high-grade short duration paper' },
              { key: 'Credit Safety', val: 'AAA corporate and sovereign debt mix' },
              { key: 'Liquidity', val: 'High daily liquidity with minimal duration volatility' }
            ],
            whyChosenBullets: [
              { key: 'Rebalance Cushion', val: 'Ensures dry powder to buy equities during troughs' },
              { key: 'Steady Accrual', val: 'Reliable quarterly compounding without credit risk' },
              { key: 'Psychological Anchor', val: 'Stabilizes portfolio NAV during bear markets' }
            ]
          }
        ];
      } else {
        return [
          {
            id: 'flexi',
            name: 'Flexi Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 30,
            expectedCagrVal: 15.2,
            maxDrawdownVal: -30,
            role: 'Core Wealth Anchor',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Unconstrained across Large, Mid, Small, & Global caps' },
              { key: 'Mandate', val: 'Min 65% in equities with 0% market-cap restriction' },
              { key: 'L04 Concept', val: '"The new Large Cap" retaining true active alpha' }
            ],
            whyChosenBullets: [
              { key: 'Core Wealth Anchor', val: 'Holds ~70% bluechips + 30% mid/global compounders' },
              { key: 'Sortino > 1.5', val: 'Optimized risk-adjusted compounding' },
              { key: 'Manager Freedom', val: 'Dynamic positioning across market cycles' }
            ]
          },
          {
            id: 'mid',
            name: 'Mid Cap Funds',
            categoryType: 'Equity',
            defaultWeight: 15,
            expectedCagrVal: 16.5,
            maxDrawdownVal: -36,
            role: 'Alpha Engine',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Universe', val: 'Companies ranked 101 to 250 by market capitalization' },
              { key: 'Mandate', val: 'Strict minimum 65% allocation in mid-cap stocks' },
              { key: 'Growth Profile', val: 'High Return on Equity (ROE) scaling businesses' }
            ],
            whyChosenBullets: [
              { key: 'Controlled Alpha', val: 'Boosts total returns without dominating drawdown' },
              { key: '15% Allocation', val: 'Capped to prevent extreme volatility' },
              { key: 'Earnings Growth', val: '15-20% domestic earnings compounding' }
            ]
          },
          {
            id: 'baf',
            name: 'Balanced Advantage Funds (BAF)',
            categoryType: 'Hybrid',
            defaultWeight: 20,
            expectedCagrVal: 11.8,
            maxDrawdownVal: -14,
            role: 'Counter-Cyclical Hedger',
            typicalHorizon: '> 3 Years',
            sebiBullets: [
              { key: 'SEBI Mandate', val: 'Dynamic 0% to 100% active shift between Equity and Debt' },
              { key: 'Tax Status', val: 'Maintains >65% gross equity via arbitrage for equity tax' },
              { key: 'Execution', val: 'In-house quant models (P/E, P/B, Dividend Yield triggers)' }
            ],
            whyChosenBullets: [
              { key: 'Auto Profit Booking', val: 'Trims equity at frothy peaks, buys at crash troughs' },
              { key: 'Half Crash Drawdown', val: 'Max historical dip limited to ~-14% vs -35% index' },
              { key: 'Zero Emotional Bias', val: 'Removes market-timing mistakes through algorithmic shifts' }
            ]
          },
          {
            id: 'debt',
            name: 'Arbitrage & Short Debt',
            categoryType: 'Debt',
            defaultWeight: 25,
            expectedCagrVal: 7.5,
            maxDrawdownVal: -2,
            role: 'Stability & Dry Powder',
            typicalHorizon: '1 to 3 Years',
            sebiBullets: [
              { key: 'SEBI Strategy', val: 'Cash-futures arbitrage + high-grade short duration paper' },
              { key: 'Credit Safety', val: 'AAA corporate and sovereign debt mix' },
              { key: 'Liquidity', val: 'High daily liquidity with minimal duration volatility' }
            ],
            whyChosenBullets: [
              { key: 'Rebalance Cushion', val: 'Ensures dry powder to buy equities during troughs' },
              { key: 'Steady Accrual', val: 'Reliable quarterly compounding without credit risk' },
              { key: 'Psychological Anchor', val: 'Stabilizes portfolio NAV during bear markets' }
            ]
          },
          {
            id: 'gold',
            name: 'Sovereign Gold / Gold ETFs',
            categoryType: 'Commodity',
            defaultWeight: 10,
            expectedCagrVal: 11.5,
            maxDrawdownVal: -12,
            role: 'Crisis Shock Absorber',
            typicalHorizon: '> 5 Years',
            sebiBullets: [
              { key: 'SEBI Instrument', val: 'Physical 99.5% purity gold ETFs or RBI Sovereign Gold Bonds' },
              { key: 'Currency Peg', val: 'Tracks global spot gold price and USD/INR exchange rate' },
              { key: 'Default Risk', val: 'Zero credit/default risk; audited physical vaults or RBI backing' }
            ],
            whyChosenBullets: [
              { key: '2008 Crash Proof', val: 'Surged +11% in 2008 when Nifty collapsed -46%' },
              { key: 'Negative Correlation', val: 'Acts as counterweight when equity markets experience panic' },
              { key: 'Inflation Armor', val: 'Long-term store of purchasing power over decades' }
            ]
          }
        ];
      }
    }
  }, [selectedRiskProfile, selectedModel]);

  // Reset custom weights when model or risk changes, but preserve saved custom weights on initial mount
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // If we have saved custom weights on mount, preserve them
      if (customWeights && Object.keys(customWeights).length > 0) {
        return;
      }
    }
    const initialWeights: Record<string, number> = {};
    baseCategories.forEach(cat => {
      initialWeights[cat.id] = cat.defaultWeight;
    });
    setCustomWeights(initialWeights);
  }, [baseCategories]);

  // Total weight calculation
  const totalWeight = useMemo(() => {
    return Object.values(customWeights).reduce((sum, w) => sum + (w || 0), 0);
  }, [customWeights]);

  // Handle slider change for any category - allows flexible free movement up to 100%
  const handleWeightChange = (id: string, newWeight: number) => {
    setCustomWeights(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(100, newWeight))
    }));
  };

  // Auto-balance all categories proportionally to exactly 100%
  const handleAutoBalance = () => {
    if (totalWeight === 0) return;
    const factor = 100 / totalWeight;
    const newWeights: Record<string, number> = {};
    let runningTotal = 0;
    baseCategories.forEach((cat, idx) => {
      if (idx === baseCategories.length - 1) {
        newWeights[cat.id] = Math.max(0, 100 - runningTotal);
      } else {
        const scaled = Math.round((customWeights[cat.id] || 0) * factor);
        newWeights[cat.id] = scaled;
        runningTotal += scaled;
      }
    });
    setCustomWeights(newWeights);
  };

  // Reset to default weights
  const handleResetWeights = () => {
    const initialWeights: Record<string, number> = {};
    baseCategories.forEach(cat => {
      initialWeights[cat.id] = cat.defaultWeight;
    });
    setCustomWeights(initialWeights);
  };

  // Quick fill remaining unallocated percentage to debt / arbitrage
  const handleFillRemainingToDebt = () => {
    const unallocated = 100 - totalWeight;
    if (unallocated <= 0) return;
    const debtCat = baseCategories.find(c => c.categoryType === 'Debt') || baseCategories[baseCategories.length - 1];
    if (debtCat) {
      setCustomWeights(prev => ({
        ...prev,
        [debtCat.id]: (prev[debtCat.id] || 0) + unallocated
      }));
    }
  };

  // Dynamic CAGR and Max Drawdown calculation based on custom slider weights
  const dynamicMetrics = useMemo(() => {
    if (totalWeight === 0) return { cagr: '0.0%', drawdown: '0.0%', rawCagr: 0 };
    let weightedCagr = 0;
    let weightedDrawdown = 0;
    baseCategories.forEach(cat => {
      const w = (customWeights[cat.id] || 0) / 100;
      weightedCagr += w * cat.expectedCagrVal;
      weightedDrawdown += w * cat.maxDrawdownVal;
    });

    // Normalize if total != 100%
    if (totalWeight !== 100 && totalWeight > 0) {
      const factor = 100 / totalWeight;
      weightedCagr *= factor;
      weightedDrawdown *= factor;
    }

    return {
      cagr: `${weightedCagr.toFixed(1)}%`,
      drawdown: `${weightedDrawdown.toFixed(1)}%`,
      rawCagr: weightedCagr
    };
  }, [baseCategories, customWeights, totalWeight]);

  // Persist stage 1 configuration changes to user profile
  useEffect(() => {
    if (Object.keys(customWeights).length > 0) {
      saveUserProfile({
        stage1: {
          selectedRiskProfile,
          selectedModel,
          customWeights,
          targetExpectedReturn: dynamicMetrics.rawCagr
        }
      });
    }
  }, [selectedRiskProfile, selectedModel, customWeights, dynamicMetrics.rawCagr]);

  const selectedAgent: Agent = agentCouncil.find((a: Agent) => a.id === activeAgentId) || agentCouncil[0];

  return (
    <div className="space-y-4">
      {/* Top Header - Slim & Optimized */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 rounded-xl p-3 sm:p-4 shadow-sm border border-stone-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-stone-100 leading-tight">
                  Stage 1: Asset Allocation Strategy (Lessons 01 & 02)
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                  Mandated Asset Mix
                </span>
              </div>
              <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">
                Establish your exact Equity, Debt, and Gold split pursuant to the 5 laws of asset allocation before selecting schemes.
              </p>
            </div>
          </div>

          {/* Risk Profile Selector Tabs */}
          <div className="flex items-center bg-stone-800/80 p-1 rounded-lg border border-stone-700/80 self-stretch sm:self-auto justify-between sm:justify-start">
            <button
              onClick={() => handleSelectRisk('aggressive')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                selectedRiskProfile === 'aggressive'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Aggressive (80:20)
            </button>
            <button
              onClick={() => handleSelectRisk('moderate')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                selectedRiskProfile === 'moderate'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Moderate (50:50)
            </button>
            <button
              onClick={() => handleSelectRisk('conservative')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                selectedRiskProfile === 'conservative'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Conservative (20:80)
            </button>
          </div>
        </div>
      </div>

      {/* 5-Agent Council Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-500">
              Multi-Agent Investment Council
            </span>
            <span className="text-[11px] text-stone-400 font-serif italic">
              • 5 Perspectives Debating Your Portfolio Risk
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-mono font-medium">
            Active: {selectedAgent.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {agentCouncil.map((agent: Agent) => {
            const isSelected = activeAgentId === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => handleSelectAgent(agent.id)}
                className={`cursor-pointer transition-all rounded-xl p-3 border text-left ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-300'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    agent.id === 'agent-aggressive' ? 'bg-rose-100 text-rose-800' :
                    agent.id === 'agent-moderate' ? 'bg-amber-100 text-amber-800' :
                    agent.id === 'agent-conservative' ? 'bg-emerald-100 text-emerald-800' :
                    agent.id === 'agent-quant' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {agent.variant}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                </div>

                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {agent.name}
                </div>
                <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                  {agent.tagline}
                </div>

                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-stone-400">Target Mix</span>
                  <span className="font-bold text-stone-800">
                    {agent.assetAllocation.equity}:{agent.assetAllocation.debt}:{agent.assetAllocation.gold}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Agent Stance & Masterclass Scientific Proofs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Agent Detailed Verdict Card */}
        <div className="lg:col-span-4 ivory-card p-3.5 border-stone-300 flex flex-col justify-between space-y-2.5">
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 font-mono">
                Agent Verdict & Rationale
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                L01-L02 Governed
              </span>
            </div>

            <div className="mt-2">
              <div className="text-xs font-serif font-bold text-stone-900">
                {selectedAgent.name} ({selectedAgent.title})
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed line-clamp-3">
                "{selectedAgent.philosophy}"
              </p>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-stone-500">
              <span>Target Asset Mix:</span>
              <span className="font-bold text-stone-800">
                {selectedAgent.assetAllocation.equity}% Eq • {selectedAgent.assetAllocation.debt}% Debt • {selectedAgent.assetAllocation.gold}% Gold
              </span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Philosophy Focus:</span>
              <span className="font-bold text-emerald-700 truncate max-w-[170px]">{selectedAgent.variant} Portfolio</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Key Mandate:</span>
              <span className="font-bold text-stone-700 truncate max-w-[170px]">{selectedAgent.title}</span>
            </div>
          </div>
        </div>

        {/* Masterclass Scientific Proof Cards (3 Proofs from L02) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Proof 1: 2008 Crash Shield */}
          <div className="ivory-card p-3 border-rose-200/80 bg-rose-50/20 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  1. The 2008 Crash Shield
                </span>
                <span className="text-[9px] font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-800">L02</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug mt-1">
                When Nifty fell <strong className="text-rose-700">-46%</strong> in 2008, Gold surged <strong className="text-amber-700">+11%</strong> and Bonds returned <strong className="text-emerald-700">+9%</strong>.
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold text-stone-700 pt-1 border-t border-rose-200/60">
              Law: Uncorrelated assets preserve sanity during panics.
            </div>
          </div>

          {/* Proof 2: Anti-Chasing Truth */}
          <div className="ivory-card p-3 border-amber-200/80 bg-amber-50/20 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  2. The Anti-Chasing Truth
                </span>
                <span className="text-[9px] font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">26Y Study</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug mt-1">
                Chasing last year's #1 asset gave only <strong className="text-rose-700">5.38% CAGR</strong> over 26 years. Disciplined rebalancing delivered <strong className="text-emerald-700">8.17% CAGR</strong> with half the risk.
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold text-stone-700 pt-1 border-t border-amber-200/60">
              Law: Winners rotate; never chase last year's peak asset.
            </div>
          </div>

          {/* Proof 3: The CPI Inflation Hurdle */}
          <div className="ivory-card p-3 border-emerald-200/80 bg-emerald-50/20 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                  3. The 6.65% CPI Hurdle
                </span>
                <span className="text-[9px] font-mono bg-emerald-100 px-1 py-0.5 rounded text-emerald-800">17Y CPI</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug mt-1">
                Average CPI was <strong className="text-stone-900">6.65%</strong>. 100% debt post-tax gives ~5.7% (failing inflation). Adding <strong className="text-emerald-700">20% equity</strong> lifts returns above inflation safely.
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold text-stone-700 pt-1 border-t border-emerald-200/60">
              Law: Even conservative investors MUST hold 20% equity.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Category Sub-Allocation Blueprint: 2-Column Split */}
      <div className="ivory-card p-4 border-stone-300">
        {/* Header & Model Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider font-mono">
                Stage 1 Portfolio Blueprint
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                totalWeight === 100 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : totalWeight > 100
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                Total: {totalWeight}% / 100% {
                  totalWeight === 100 ? '✓ Balanced' : 
                  totalWeight > 100 ? `(Over by +${totalWeight - 100}%)` : 
                  `(${100 - totalWeight}% Available)`
                }
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900">
              Category Asset Architecture & Allocation Sliders
            </h3>
          </div>

          {/* Model Switcher Buttons: Training vs Council */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                onClick={() => setSelectedModel('training')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedModel === 'training' 
                    ? 'bg-stone-900 text-stone-100 shadow-sm' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                L02 Pure Model (2-Asset)
              </button>
              <button
                onClick={() => setSelectedModel('council')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedModel === 'council' 
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Council Model (+ Gold)
              </button>
            </div>

            <button
              onClick={handleResetWeights}
              title="Reset weights to default"
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-3.5 items-start">
          {/* LEFT SIDE: Category Intelligence & Masterclass Selection Rationale */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Category Details & Selection Rationale</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                {baseCategories.length} Asset Classes
              </span>
            </div>

            <div className="space-y-2.5">
              {baseCategories.map((cat) => {
                const currentWeight = customWeights[cat.id] !== undefined ? customWeights[cat.id] : cat.defaultWeight;
                const isHovered = hoveredCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredCategory(cat.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isHovered
                        ? 'bg-amber-50/40 border-amber-300 shadow-sm ring-1 ring-amber-300/60'
                        : 'bg-white border-stone-200/90 hover:border-stone-300'
                    }`}
                  >
                    {/* Compact Top Bar */}
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                          cat.categoryType === 'Equity' ? 'bg-stone-900 text-stone-100' :
                          cat.categoryType === 'Debt' ? 'bg-emerald-100 text-emerald-800' :
                          cat.categoryType === 'Commodity' ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                        }`}>
                          {cat.categoryType}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="text-stone-400">Target:</span>
                        <span className="font-bold text-stone-900 px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200">
                          {currentWeight}%
                        </span>
                        <span className="text-emerald-700 font-semibold hidden sm:inline">
                          Exp: ~{cat.expectedCagrVal}%
                        </span>
                      </div>
                    </div>

                    {/* Split into Left Sub-Pane (SEBI Mandate) and Right Sub-Pane (Why Chosen) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                      {/* Left Sub-Pane: SEBI Mandate & Rules */}
                      <div className="bg-stone-50/70 p-2 rounded-lg border border-stone-200/70">
                        <div className="text-[10px] font-mono font-bold text-stone-600 uppercase mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-800"></span>
                          SEBI Regulatory Rules
                        </div>
                        <ul className="space-y-1 text-[11px] text-stone-700">
                          {cat.sebiBullets.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-1 leading-tight">
                              <span className="text-stone-400 shrink-0">•</span>
                              <span>
                                <strong className="text-stone-900 font-semibold">{b.key}:</strong> {b.val}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right Sub-Pane: Why Chosen in Portfolio */}
                      <div className="bg-amber-50/30 p-2 rounded-lg border border-amber-200/60">
                        <div className="text-[10px] font-mono font-bold text-amber-900 uppercase mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          Why Chosen in Portfolio
                        </div>
                        <ul className="space-y-1 text-[11px] text-stone-700">
                          {cat.whyChosenBullets.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-1 leading-tight">
                              <span className="text-amber-500 shrink-0">•</span>
                              <span>
                                <strong className="text-stone-900 font-semibold">{b.key}:</strong> {b.val}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Micro Metrics Footer */}
                    <div className="flex items-center justify-between gap-2 pt-1.5 mt-1.5 border-t border-stone-100 text-[10px] font-mono text-stone-400">
                      <span>Role: <strong className="text-stone-700">{cat.role}</strong></span>
                      <span>Max Drawdown: <strong className="text-rose-700">{cat.maxDrawdownVal}%</strong></span>
                      <span>Horizon: <strong className="text-stone-700">{cat.typicalHorizon}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Compact, Smooth Sliders & Live Recalculated Return Panel */}
          <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-14">
            {/* Live Recalculated Return & Drawdown Box */}
            <div className="p-3.5 rounded-xl bg-stone-900 text-stone-100 shadow-md border border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-1.5">
                <span className="font-bold font-serif tracking-wide text-amber-400 uppercase text-[11px]">
                  Live Portfolio Metrics
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  totalWeight === 100 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                    : totalWeight > 100
                      ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                }`}>
                  {totalWeight === 100 ? '100% Balanced ✓' : totalWeight > 100 ? `${totalWeight}% (Over: +${totalWeight - 100}%)` : `${totalWeight}% Allocated`}
                </span>
              </div>

              {/* Total Portfolio Allocation Visual Progress Bar */}
              <div className="space-y-1 bg-stone-800/90 p-2.5 rounded-lg border border-stone-700">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-stone-300 font-bold">Total Budget: 100%</span>
                  <span className={
                    totalWeight === 100 ? 'text-emerald-400 font-bold' :
                    totalWeight > 100 ? 'text-rose-400 font-bold animate-pulse' :
                    'text-amber-300 font-bold'
                  }>
                    {totalWeight === 100 ? '100% Fully Balanced ✓' : 
                     totalWeight > 100 ? `${totalWeight}% (Over by +${totalWeight - 100}%)` : 
                     `${totalWeight}% (${100 - totalWeight}% Unallocated)`}
                  </span>
                </div>
                
                {/* Visual Segmented Bar */}
                <div className="h-2.5 w-full bg-stone-700 rounded-full overflow-hidden flex">
                  {baseCategories.map((cat, idx) => {
                    const w = customWeights[cat.id] || 0;
                    if (w <= 0) return null;
                    const displayWidth = totalWeight > 100 ? (w / totalWeight) * 100 : w;
                    const colorClass = 
                      cat.categoryType === 'Equity' ? (idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-amber-300' : 'bg-orange-400') :
                      cat.categoryType === 'Debt' ? 'bg-emerald-400' :
                      cat.categoryType === 'Commodity' ? 'bg-yellow-300' : 'bg-blue-400';
                    return (
                      <div 
                        key={cat.id} 
                        style={{ width: `${displayWidth}%` }} 
                        className={`${colorClass} transition-all duration-150`}
                        title={`${cat.name}: ${w}%`}
                      />
                    );
                  })}
                  {totalWeight < 100 && (
                    <div 
                      style={{ width: `${100 - totalWeight}%` }} 
                      className="bg-stone-600 transition-all duration-150" 
                      title={`Unallocated: ${100 - totalWeight}%`}
                    />
                  )}
                </div>

                {/* Status Guidance & Quick Action Buttons */}
                {totalWeight === 100 && (
                  <div className="flex justify-between items-center pt-0.5 text-[9px] font-mono text-emerald-400">
                    <span>✓ Portfolio is 100% balanced.</span>
                    <span>Stage 2 Unlocked</span>
                  </div>
                )}

                {totalWeight > 100 && (
                  <div className="space-y-1 pt-1 border-t border-stone-700/80 mt-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-rose-300 font-semibold">
                      <span>⚠️ Over-allocated by +{totalWeight - 100}%</span>
                      <button
                        onClick={handleAutoBalance}
                        className="text-amber-300 hover:text-amber-200 underline cursor-pointer text-[10px]"
                      >
                        Auto-balance to 100%
                      </button>
                    </div>
                    <div className="text-[9px] text-stone-400 leading-tight">
                      Reduce {totalWeight - 100}% from other categories (e.g. Mid Cap or Debt) to rebalance.
                    </div>
                  </div>
                )}

                {totalWeight < 100 && (
                  <div className="flex justify-between items-center pt-0.5 text-[9px] font-mono">
                    <span className="text-amber-300">{100 - totalWeight}% Unallocated (Dry Powder)</span>
                    <button
                      onClick={handleFillRemainingToDebt}
                      className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      + Fill {100 - totalWeight}% to Debt
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic Metrics Dual Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-stone-800/80 border border-stone-700">
                  <div className="text-[9px] uppercase font-bold text-stone-400 font-mono">Expected 10Y CAGR</div>
                  <div className="text-base font-serif font-bold text-emerald-400 font-mono mt-0.5">
                    {dynamicMetrics.cagr}
                  </div>
                  <div className="text-[9px] text-stone-400">Dynamically weighted</div>
                </div>

                <div className="p-2 rounded-lg bg-stone-800/80 border border-stone-700">
                  <div className="text-[9px] uppercase font-bold text-stone-400 font-mono">Crash Drawdown</div>
                  <div className="text-base font-serif font-bold text-rose-400 font-mono mt-0.5">
                    {dynamicMetrics.drawdown}
                  </div>
                  <div className="text-[9px] text-stone-400">2008 stress test</div>
                </div>
              </div>
            </div>

            {/* Compact Sliders List */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Sliders className="w-3 h-3 text-amber-600" />
                  <span>Category Allocation Sliders</span>
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Free 0-100% Range</span>
              </div>

              <div className="space-y-2">
                {baseCategories.map((cat) => {
                  const currentWeight = customWeights[cat.id] !== undefined ? customWeights[cat.id] : cat.defaultWeight;
                  const isHovered = hoveredCategory === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`p-2 rounded-lg border transition-all ${
                        isHovered 
                          ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-300/60' 
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {/* Top row: Label & Weight */}
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            cat.categoryType === 'Equity' ? 'bg-stone-900' :
                            cat.categoryType === 'Debt' ? 'bg-emerald-600' :
                            cat.categoryType === 'Commodity' ? 'bg-amber-500' : 'bg-indigo-600'
                          }`} />
                          <span className="text-xs font-bold text-stone-800 truncate" title={cat.name}>
                            {cat.name}
                          </span>
                        </div>

                        {/* Nudge buttons and exact weight */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleWeightChange(cat.id, Math.max(0, currentWeight - 1))}
                            disabled={currentWeight <= 0}
                            className="w-4 h-4 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-700 flex items-center justify-center text-[10px] font-bold transition-all"
                            title="Decrease 1%"
                          >
                            -
                          </button>
                          <span className="min-w-[36px] text-center font-mono font-bold text-[11px] px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200 text-stone-900">
                            {currentWeight}%
                          </span>
                          <button
                            onClick={() => handleWeightChange(cat.id, Math.min(100, currentWeight + 1))}
                            disabled={currentWeight >= 100}
                            className="w-4 h-4 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-700 flex items-center justify-center text-[10px] font-bold transition-all"
                            title="Increase 1%"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Smooth Slider Bar with full 0-100 freedom */}
                      <div className="py-0.5">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={currentWeight}
                          onChange={(e) => handleWeightChange(cat.id, parseInt(e.target.value))}
                          className="smooth-slider"
                        />
                      </div>

                      {/* Contribution readout */}
                      <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
                        <span>Rate: ~{cat.expectedCagrVal}%</span>
                        <span className="text-stone-600 font-semibold">
                          Impact: +{((currentWeight / 100) * cat.expectedCagrVal).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage 2 Transfer CTA Button */}
            <div>
              <button
                onClick={() => {
                  if (onSetCustomExpectedReturn && dynamicMetrics.rawCagr) {
                    onSetCustomExpectedReturn(dynamicMetrics.rawCagr);
                  }
                  onNavigateToTab('tvm');
                }}
                disabled={totalWeight !== 100}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  totalWeight === 100
                    ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer hover:shadow-md'
                    : totalWeight > 100
                      ? 'bg-rose-950 text-rose-300 border border-rose-800 cursor-not-allowed'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {totalWeight === 100 
                    ? `Proceed to Stage 2 with ${dynamicMetrics.cagr} Return` 
                    : totalWeight > 100
                      ? `Reduce ${totalWeight - 100}% from other assets to proceed`
                      : `Allocate ${100 - totalWeight}% more to proceed`}
                </span>
                <ArrowRight className={`w-4 h-4 ${totalWeight === 100 ? 'text-amber-400' : 'text-stone-400'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
