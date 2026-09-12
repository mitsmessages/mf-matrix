import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Users, 
  Layers, 
  Calculator, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm';
  setActiveTab: (tab: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm') => void;
  selectedFundCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0.5 z-50 px-2 sm:px-4 w-full max-w-[98%] mx-auto transition-all duration-300 pt-0.5">
      <div 
        className={`glass-pill rounded-full px-3.5 sm:px-5 flex items-center justify-between shadow-soft-md transition-all duration-300 ${
          isScrolled ? 'py-1 bg-ivory-100/95 backdrop-blur-md border border-stone-300/80 shadow-md' : 'py-1.5 sm:py-2'
        }`}
      >
        {/* Brand / Logo + Micro Sub-Header */}
        <div 
          onClick={() => setActiveTab('journey')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className={`rounded-full bg-stone-900 text-ivory-100 flex items-center justify-center font-serif font-bold shadow-inner group-hover:bg-amber-600 transition-all shrink-0 ${
            isScrolled ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
          }`}>
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className={`font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap transition-all ${
                isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
              }`}>
                Mutual Fund Matrix
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-300/40 shrink-0">
                <Sparkles className="w-2 h-2 text-amber-600" /> Institutional
              </span>
            </div>
            
            {/* Small limited-text sub-header */}
            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-mono leading-none mt-0.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0"></span>
              <span>PE 22.4</span>
              <span className="text-stone-300">·</span>
              <span>Expansion</span>
              <span className="text-stone-300">·</span>
              <span>CPI 5.1%</span>
              <span className="text-stone-300">·</span>
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                Profile Synced
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Centered & Comfortable) */}
        {/* Navigation Tabs (Ordered strictly by Stage 1 -> Stage 2 -> Stage 3 -> Stage 4) */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-full border border-stone-200/80 text-xs font-medium text-stone-600 shrink-0">
          <button
            onClick={() => setActiveTab('journey')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'journey'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Curriculum</span>
          </button>

          <button
            onClick={() => setActiveTab('council')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'council'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Stage 1: Council & Allocation</span>
          </button>

          <button
            onClick={() => setActiveTab('tvm')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'tvm'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Stage 2: TVM Goal Solver</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-stone-700" />
            <span>Stage 3: Fund Screener</span>
          </button>

          <button
            onClick={() => setActiveTab('ddlab')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'ddlab'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Stage 4: Portfolio DD Lab</span>
          </button>
        </nav>

        {/* Mobile menu pill toggle ordered strictly Stage 1 -> 2 -> 3 -> 4 */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={() => setActiveTab('journey')}
            className={`p-1.5 rounded-full text-xs ${activeTab === 'journey' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
            title="Curriculum"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('council')}
            className={`p-1.5 rounded-full text-xs ${activeTab === 'council' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
            title="Stage 1: Council"
          >
            <Users className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('tvm')}
            className={`p-1.5 rounded-full text-xs ${activeTab === 'tvm' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
            title="Stage 2: TVM Solver"
          >
            <Calculator className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`p-1.5 rounded-full text-xs ${activeTab === 'catalog' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
            title="Stage 3: Screener"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('ddlab')}
            className={`p-1.5 rounded-full text-xs ${activeTab === 'ddlab' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
            title="Stage 4: DD Lab"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
