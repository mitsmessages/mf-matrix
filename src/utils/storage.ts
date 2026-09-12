export interface UserProfileState {
  activeTab: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm';
  stage1: {
    selectedRiskProfile: 'aggressive' | 'moderate' | 'conservative';
    selectedModel: 'training' | 'council';
    customWeights: Record<string, number>;
    targetExpectedReturn: number;
  };
  stage2: {
    goalType: 'retirement' | 'education' | 'wealth' | 'custom';
    targetToday: number;
    horizonYears: number;
    inflationRate: number;
    expectedReturn: number;
    existingSavings: number;
  };
  stage3: {
    selectedFundIdsByCategory: Record<string, string[]>;
    lumpSumAmount: number;
    deploymentMode: 'sip' | 'lumpsum';
  };
}

const STORAGE_KEY = 'mf_matrix_user_profile_v1';

export const DEFAULT_USER_PROFILE: UserProfileState = {
  activeTab: 'journey',
  stage1: {
    selectedRiskProfile: 'aggressive',
    selectedModel: 'council',
    customWeights: {},
    targetExpectedReturn: 14.5,
  },
  stage2: {
    goalType: 'retirement',
    targetToday: 10000000, // 1 Crore
    horizonYears: 10,
    inflationRate: 6.65,
    expectedReturn: 11.5,
    existingSavings: 0,
  },
  stage3: {
    selectedFundIdsByCategory: {
      flexi: ['ppfc-01'],
      mid: ['motilal-mc-01'],
      large: ['nippon-lc-01'],
      debt: ['kotak-arb-01'],
      gold: ['nippon-gold-01']
    },
    lumpSumAmount: 1000000, // 10 Lakhs default
    deploymentMode: 'sip'
  }
};

export const loadUserProfile = (): UserProfileState => {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      activeTab: parsed.activeTab || DEFAULT_USER_PROFILE.activeTab,
      stage1: {
        ...DEFAULT_USER_PROFILE.stage1,
        ...(parsed.stage1 || {})
      },
      stage2: {
        ...DEFAULT_USER_PROFILE.stage2,
        ...(parsed.stage2 || {})
      },
      stage3: {
        ...DEFAULT_USER_PROFILE.stage3,
        ...(parsed.stage3 || {})
      }
    };
  } catch (err) {
    console.warn('Failed to load user profile from localStorage:', err);
    return DEFAULT_USER_PROFILE;
  }
};

export interface UserProfileUpdates {
  activeTab?: 'journey' | 'council' | 'catalog' | 'ddlab' | 'tvm';
  stage1?: {
    selectedRiskProfile?: 'aggressive' | 'moderate' | 'conservative';
    selectedModel?: 'training' | 'council';
    customWeights?: Record<string, number>;
    targetExpectedReturn?: number;
  };
  stage2?: {
    goalType?: 'retirement' | 'education' | 'wealth' | 'custom';
    targetToday?: number;
    horizonYears?: number;
    inflationRate?: number;
    expectedReturn?: number;
    existingSavings?: number;
  };
  stage3?: {
    selectedFundIdsByCategory?: Record<string, string[]>;
    lumpSumAmount?: number;
    deploymentMode?: 'sip' | 'lumpsum';
  };
}

export const saveUserProfile = (updates: UserProfileUpdates): void => {
  if (typeof window === 'undefined') return;
  try {
    const current = loadUserProfile();
    const updated: UserProfileState = {
      ...current,
      ...updates,
      stage1: {
        ...current.stage1,
        ...(updates.stage1 || {})
      },
      stage2: {
        ...current.stage2,
        ...(updates.stage2 || {})
      },
      stage3: {
        ...current.stage3,
        ...(updates.stage3 || {})
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save user profile to localStorage:', err);
  }
};

export const resetUserProfile = (): UserProfileState => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear user profile:', err);
    }
  }
  return DEFAULT_USER_PROFILE;
};
