import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Investment } from '@/types/investment';
import { Referral } from '@/types/referral';

interface SharedState {
  investments: Investment[];
  referrals: Referral[];
  metrics: {
    totalInvestment: number;
    activeInvestments: number;
    totalReferrals: number;
    totalEarnings: number;
  };
  
  // Actions
  updateInvestment: (id: string, data: Partial<Investment>) => void;
  updateReferral: (id: string, data: Partial<Referral>) => void;
  updateMetrics: (metrics: Partial<SharedState['metrics']>) => void;
}

export const useSharedStore = create<SharedState>()(
  persist(
    (set) => ({
      investments: [],
      referrals: [],
      metrics: {
        totalInvestment: 0,
        activeInvestments: 0,
        totalReferrals: 0,
        totalEarnings: 0
      },

      updateInvestment: (id, data) => set((state) => ({
        investments: state.investments.map((inv) =>
          inv.id === id ? { ...inv, ...data } : inv
        )
      })),

      updateReferral: (id, data) => set((state) => ({
        referrals: state.referrals.map((ref) =>
          ref.id === id ? { ...ref, ...data } : ref
        )
      })),

      updateMetrics: (metrics) => set((state) => ({
        metrics: { ...state.metrics, ...metrics }
      }))
    }),
    {
      name: 'shared-store'
    }
  )
);