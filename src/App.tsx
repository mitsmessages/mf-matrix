import React, { useState } from 'react';
import { Header } from './components/Header';
import { JourneyView } from './components/JourneyView';
import { AgentCouncilView } from './components/AgentCouncilView';
import { FundCatalogView } from './components/FundCatalogView';
import { PortfolioDDLab } from './components/PortfolioDDLab';
import { TVMGoalPlanner } from './components/TVMGoalPlanner';
import { FactsheetModal } from './components/FactsheetModal';
import { mutualFundsDatabase } from './data/fundsDatabase';
import { Fund } from './types';
import { loadUserProfile, saveUserProfile } from './utils/storage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm'>(() => {
    return loadUserProfile().activeTab || 'journey';
  });
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [targetExpectedReturn, setTargetExpectedReturn] = useState<number>(() => {
    return loadUserProfile().stage1.targetExpectedReturn || 14.5;
  });

  const handleTabChange = (tab: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm') => {
    setActiveTab(tab);
    saveUserProfile({ activeTab: tab });
  };

  const handleSetExpectedReturn = (cagr: number) => {
    setTargetExpectedReturn(cagr);
    saveUserProfile({ stage1: { targetExpectedReturn: cagr } });
  };

  const selectedFund = selectedFundId 
    ? mutualFundsDatabase.find((f: Fund) => f.id === selectedFundId) || null 
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-ivory-bg text-stone-800 font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Institutional Top Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 w-full max-w-[98%] mx-auto px-2 sm:px-4 py-2">
        {activeTab === 'journey' && (
          <JourneyView 
            onNavigateToTab={handleTabChange}
            onOpenFundFactsheet={(fundId: string) => setSelectedFundId(fundId)}
          />
        )}

        {activeTab === 'council' && (
          <AgentCouncilView 
            onOpenFundFactsheet={(fundId: string) => setSelectedFundId(fundId)}
            onNavigateToTab={handleTabChange}
            onSetCustomExpectedReturn={handleSetExpectedReturn}
          />
        )}

        {activeTab === 'catalog' && (
          <FundCatalogView 
            onOpenFundFactsheet={(fundId: string) => setSelectedFundId(fundId)}
          />
        )}

        {activeTab === 'ddlab' && (
          <PortfolioDDLab 
            onOpenFundFactsheet={(fundId: string) => setSelectedFundId(fundId)}
          />
        )}

        {activeTab === 'tvm' && (
          <TVMGoalPlanner 
            initialExpectedReturn={targetExpectedReturn} 
            onNavigateToTab={handleTabChange}
          />
        )}
      </main>

      {/* Global Factsheet Modal */}
      {selectedFund && (
        <FactsheetModal 
          fund={selectedFund} 
          onClose={() => setSelectedFundId(null)} 
        />
      )}

      {/* Institutional Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-100/60 mt-12 py-8">
        <div className="max-w-[95%] xl:max-w-[96%] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-serif font-bold text-xs">
                  M
                </div>
                <span className="font-serif font-bold text-stone-900 tracking-tight text-sm">
                  MUTUAL FUND MATRIX
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-semibold">
                  Institutional v2.4
                </span>
              </div>
              <p className="text-xs text-stone-500 max-w-md leading-relaxed">
                Synthesized from a rigorous 14-lecture institutional mutual fund masterclass. Translating asset allocation physics, Method 2 multiples, rolling returns, and down-capture compounding into actionable decision intelligence.
              </p>
            </div>

            <div>
              <div className="text-[11px] uppercase font-bold text-stone-500 tracking-wider mb-2 font-mono">
                System Frameworks
              </div>
              <ul className="text-xs space-y-1 text-stone-600">
                <li className="hover:text-stone-900 cursor-pointer" onClick={() => setActiveTab('journey')}>
                  11-Module Curriculum
                </li>
                <li className="hover:text-stone-900 cursor-pointer" onClick={() => setActiveTab('council')}>
                  5-Agent Investment Committee
                </li>
                <li className="hover:text-stone-900 cursor-pointer" onClick={() => setActiveTab('catalog')}>
                  5-Step Quantitative Filter
                </li>
                <li className="hover:text-stone-900 cursor-pointer" onClick={() => setActiveTab('ddlab')}>
                  Method 2 Valuation Forensic
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[11px] uppercase font-bold text-stone-500 tracking-wider mb-2 font-mono">
                Governance & Standards
              </div>
              <div className="text-xs text-stone-500 space-y-1">
                <div>• SEBI Categorization Compliant</div>
                <div>• Sortino / Downside Risk Anchored</div>
                <div>• Asymmetric Capture Shielding</div>
                <div>• Zero Commission (Direct Plans Only)</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
            <div>
              © {new Date().getFullYear()} Mutual Fund Matrix Engine. Designed with warm ivory aesthetics inspired by StocksBrew & Secretary AI.
            </div>
            <div className="font-mono text-[10px]">
              Risk-Adjusted Compounding • Pure Alpha Integrity
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
