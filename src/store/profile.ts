import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ALLOCATION_PRESETS,
  balanceWeightsTo100,
  SLEEVE_KEYS,
  type AllocationModel,
  type RiskProfile,
} from "@/domain/finance/sleeves";
import { SLEEVES } from "@/domain/finance/sleeves";
import type { SleeveKey } from "@/domain/finance/sleeves";
import type { Selections, SleeveWeights } from "@/domain/finance/types";
import type { TvmInput } from "@/domain/finance/tvm";
import type { Lot } from "@/domain/finance/portfolio-holdings";
import {
  DEFAULT_BAND_PCT,
  DEFAULT_LUMP_SUM,
  defaultSelections,
  defaultTvmInput,
  defaultWeights,
} from "@/data/defaults";

export interface ProfileState {
  profile: RiskProfile;
  model: AllocationModel;
  weights: SleeveWeights;
  tvm: TvmInput;
  selections: Selections;
  lumpSum: number;
  bandPct: number;
  completedModules: string[];
  /** The user's own holdings (manual / CAS-style lots). */
  lots: Lot[];

  setProfile: (profile: RiskProfile) => void;
  setModel: (model: AllocationModel) => void;
  applyPreset: () => void;
  setWeights: (weights: SleeveWeights) => void;
  setWeight: (sleeve: SleeveKey, value: number) => void;
  autoBalance: () => void;
  resetWeights: () => void;
  fillRemainingToDebt: () => void;

  setTvm: (patch: Partial<TvmInput>) => void;
  setSelection: (sleeve: SleeveKey, fundIds: string[]) => void;
  toggleFund: (sleeve: SleeveKey, fundId: string) => void;
  clearSleeve: (sleeve: SleeveKey) => void;
  setLumpSum: (value: number) => void;
  setBandPct: (value: number) => void;

  markModuleComplete: (id: string) => void;
  toggleModule: (id: string) => void;
  addLot: (lot: Lot) => void;
  removeLot: (id: string) => void;
  clearLots: () => void;
  resetAll: () => void;
}

export const totalWeight = (weights: SleeveWeights): number =>
  SLEEVE_KEYS.reduce((sum, k) => sum + (weights[k] ?? 0), 0);

/** Re-exported for callers; the pure implementation lives in the domain. */
export const balanceTo100 = balanceWeightsTo100;

const initial = {
  profile: "aggressive" as RiskProfile,
  model: "enhanced" as AllocationModel,
  weights: defaultWeights(),
  tvm: defaultTvmInput(),
  selections: defaultSelections(),
  lumpSum: DEFAULT_LUMP_SUM,
  bandPct: DEFAULT_BAND_PCT,
  completedModules: ["m01"],
  lots: [] as Lot[],
};

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...initial,

      setProfile: (profile) => {
        const model = get().model;
        set({ profile, weights: { ...ALLOCATION_PRESETS[profile][model].weights } });
      },
      setModel: (model) => {
        const profile = get().profile;
        set({ model, weights: { ...ALLOCATION_PRESETS[profile][model].weights } });
      },
      applyPreset: () => {
        const { profile, model } = get();
        set({ weights: { ...ALLOCATION_PRESETS[profile][model].weights } });
      },
      setWeights: (weights) => set({ weights: { ...weights } }),
      setWeight: (sleeve, value) =>
        set((s) => ({
          weights: { ...s.weights, [sleeve]: Math.max(0, Math.min(100, Math.round(value))) },
        })),
      autoBalance: () => set((s) => ({ weights: balanceTo100(s.weights) })),
      resetWeights: () => get().applyPreset(),
      fillRemainingToDebt: () =>
        set((s) => {
          const remaining = 100 - totalWeight(s.weights);
          if (remaining <= 0) return s;
          return { weights: { ...s.weights, debt: (s.weights.debt ?? 0) + remaining } };
        }),

      setTvm: (patch) => set((s) => ({ tvm: { ...s.tvm, ...patch } })),
      setSelection: (sleeve, fundIds) =>
        set((s) => ({ selections: { ...s.selections, [sleeve]: fundIds } })),
      toggleFund: (sleeve, fundId) =>
        set((s) => {
          const current = s.selections[sleeve] ?? [];
          const next = current.includes(fundId)
            ? current.filter((id) => id !== fundId)
            : [...current, fundId];
          return { selections: { ...s.selections, [sleeve]: next } };
        }),
      clearSleeve: (sleeve) => set((s) => ({ selections: { ...s.selections, [sleeve]: [] } })),
      setLumpSum: (value) => set({ lumpSum: Math.max(0, Math.round(value || 0)) }),
      setBandPct: (value) => set({ bandPct: Math.max(1, Math.min(20, Math.round(value))) }),

      markModuleComplete: (id) =>
        set((s) =>
          s.completedModules.includes(id) ? s : { completedModules: [...s.completedModules, id] },
        ),
      toggleModule: (id) =>
        set((s) => ({
          completedModules: s.completedModules.includes(id)
            ? s.completedModules.filter((m) => m !== id)
            : [...s.completedModules, id],
        })),

      addLot: (lot) => set((s) => ({ lots: [...s.lots, lot] })),
      removeLot: (id) => set((s) => ({ lots: s.lots.filter((l) => l.id !== id) })),
      clearLots: () => set({ lots: [] }),

      resetAll: () =>
        set({
          ...initial,
          weights: defaultWeights(),
          tvm: defaultTvmInput(),
          selections: defaultSelections(),
        }),
    }),
    {
      name: "mf-matrix-deepseek-v2",
      version: 1,
      partialize: (s) => ({
        profile: s.profile,
        model: s.model,
        weights: s.weights,
        tvm: s.tvm,
        selections: s.selections,
        lumpSum: s.lumpSum,
        bandPct: s.bandPct,
        completedModules: s.completedModules,
        lots: s.lots,
      }),
    },
  ),
);

export const sleeveTotal = totalWeight;
export { SLEEVES };
