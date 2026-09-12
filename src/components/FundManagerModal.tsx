import React, { useEffect } from 'react';
import { X, Award, Briefcase, GraduationCap, TrendingUp, Compass, Calendar, Shield } from 'lucide-react';
import { FundManagerProfile } from '../types';

interface FundManagerModalProps {
  profile: FundManagerProfile | null;
  onClose: () => void;
}

export const FundManagerModal: React.FC<FundManagerModalProps> = ({ profile, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!profile) return null;

  const totalAum = profile.otherFundsManaged.reduce((acc, f) => acc + f.aumCr, 0);

  return (
    <div 
      className="fixed inset-0 z-[60] overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white px-6 py-6 flex items-start justify-between border-b border-stone-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif font-bold text-2xl shadow-inner">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Key Investment Personnel
                </span>
                <span className="text-[11px] text-stone-300 font-medium">
                  Age: {profile.age} Years
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {profile.name}
              </h2>
              <p className="text-xs text-stone-300 mt-1 flex items-center gap-2">
                <span>{profile.totalExperienceYears} Years Total Industry Experience</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{profile.tenureAtSchemeYears} Years Tenure at this Fund</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-600 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-500" /> Scheme Tenure
              </span>
              <span className="font-serif text-xl font-bold text-stone-900 mt-1 block">{profile.tenureAtSchemeYears} Yrs</span>
              <span className="text-[10px] text-emerald-600 font-medium">Consecutive track record</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-600 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-stone-500" /> Market Exp
              </span>
              <span className="font-serif text-xl font-bold text-stone-900 mt-1 block">{profile.totalExperienceYears} Yrs</span>
              <span className="text-[10px] text-stone-500 font-medium">Across market cycles</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-stone-500" /> Total Active AUM
              </span>
              <span className="font-serif text-xl font-bold text-stone-900 mt-1 block">₹{totalAum.toLocaleString('en-IN')} Cr</span>
              <span className="text-[10px] text-brand-amber font-medium">Across all strategies</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-600 flex items-center gap-1">
                <Award className="w-3 h-3 text-stone-500" /> Mandate Count
              </span>
              <span className="font-serif text-xl font-bold text-stone-900 mt-1 block">{profile.otherFundsManaged.length + 1} Schemes</span>
              <span className="text-[10px] text-stone-500 font-medium">Direct management</span>
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-stone-700" />
              <span>Academic Background &amp; Professional Certifications</span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 font-medium bg-stone-50 p-3 rounded-xl border border-stone-200/70">
              {profile.education}
            </p>
          </div>

          {/* Core Philosophy */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-brand-amber" />
              <span>Investment Philosophy &amp; Portfolio Construction Mandate</span>
            </h4>
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif italic">
              "{profile.philosophy}"
            </div>
          </div>

          {/* Other Funds Managed Table */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-700" />
                <span>Other Funds Managed by {profile.name}</span>
              </h4>
              <span className="text-[11px] text-stone-600">SEBI Registered Mandates</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-100 text-stone-600 uppercase font-semibold border-b border-stone-200 text-[11px]">
                    <th className="py-2.5 px-3">Fund / Strategy Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">AUM (₹ Cr)</th>
                    <th className="py-2.5 px-3 text-right">3Y CAGR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {profile.otherFundsManaged.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-stone-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">
                        <span className="px-2 py-0.5 rounded bg-stone-100 font-medium text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">₹{item.aumCr.toLocaleString('en-IN')} Cr</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                        +{item.threeYearCagr.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Career Milestones */}
          {profile.careerMilestones && profile.careerMilestones.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Career Milestones &amp; Market Cycle Performance</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-700">
                {profile.careerMilestones.map((milestone, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-purple-200">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <span>Source: AMFI Monthly Manager Disclosures &amp; SEBI Scheme Filings</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};