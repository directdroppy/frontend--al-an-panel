import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Referral } from '@/types/referral';
import { eventBus } from '@/lib/eventBus';
import { api } from '@/lib/api';

interface ReferralState {
  referrals: Referral[];
  stats: {
    totalReferrals: number;
    successfulReferrals: number;
    totalCommission: number;
    monthlyGrowth: number;
    conversionRate: number;
    activeLeads: number;
  };
  isLoading: boolean;
  error: string | null;

  fetchReferrals: () => Promise<void>;
  addReferral: (referral: Omit<Referral, 'id' | 'date'>) => Promise<void>;
  updateReferral: (id: string, data: Partial<Referral>) => Promise<void>;
  completeReferral: (id: string) => Promise<void>;
  getReferralsByStatus: (status: Referral['status']) => Referral[];
}

const initialStats = {
  totalReferrals: 0,
  successfulReferrals: 0,
  totalCommission: 0,
  monthlyGrowth: 0,
  conversionRate: 0,
  activeLeads: 0
};

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: [],
      stats: initialStats,
      isLoading: false,
      error: null,

      fetchReferrals: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/referrals');
          const { referrals, stats } = response.data;
          
          set({
            referrals,
            stats: {
              ...initialStats,
              ...stats
            },
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Referanslar yüklenirken bir hata oluştu' 
          });
        }
      },

      addReferral: async (referral) => {
        try {
          const response = await api.post('/referrals', referral);
          const newReferral = response.data;
          
          set(state => ({
            referrals: [...state.referrals, newReferral],
            stats: {
              ...state.stats,
              totalReferrals: state.stats.totalReferrals + 1,
              activeLeads: state.stats.activeLeads + 1
            }
          }));

          eventBus.publish('referral-added', { referral: newReferral });
        } catch (error) {
          throw error;
        }
      },

      updateReferral: async (id, data) => {
        try {
          const response = await api.put(`/referrals/${id}`, data);
          const updatedReferral = response.data;
          
          set(state => {
            const updatedReferrals = state.referrals.map(ref =>
              ref.id === id ? { ...ref, ...updatedReferral } : ref
            );

            const successfulCount = updatedReferrals.filter(r => r.status === 'completed').length;
            const activeLeads = updatedReferrals.filter(r => r.status === 'pending').length;
            const totalCommission = updatedReferrals.reduce((sum, ref) => 
              sum + (ref.status === 'completed' ? ref.commission : 0), 0);

            return {
              referrals: updatedReferrals,
              stats: {
                ...state.stats,
                successfulReferrals: successfulCount,
                activeLeads,
                totalCommission,
                conversionRate: (successfulCount / state.stats.totalReferrals) * 100
              }
            };
          });

          eventBus.publish('referral-updated', { id, data: updatedReferral });
        } catch (error) {
          throw error;
        }
      },

      completeReferral: async (id) => {
        try {
          const response = await api.put(`/referrals/${id}/complete`);
          const completedReferral = response.data;
          
          set(state => {
            const updatedReferrals = state.referrals.map(ref =>
              ref.id === id ? completedReferral : ref
            );

            return {
              referrals: updatedReferrals,
              stats: {
                ...state.stats,
                successfulReferrals: state.stats.successfulReferrals + 1,
                activeLeads: state.stats.activeLeads - 1,
                totalCommission: state.stats.totalCommission + completedReferral.commission
              }
            };
          });

          eventBus.publish('referral-completed', { referral: completedReferral });
        } catch (error) {
          throw error;
        }
      },

      getReferralsByStatus: (status) => {
        return get().referrals.filter(r => r.status === status);
      }
    }),
    {
      name: 'referral-store'
    }
  )
);