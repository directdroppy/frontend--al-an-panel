import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Investment } from '@/types/investment';
import { eventBus } from './eventBus';
import { api } from './api';

interface InvestmentState {
  investments: Investment[];
  activeInvestments: Investment[];
  completedInvestments: Investment[];
  isLoading: boolean;
  error: string | null;
  
  fetchInvestments: () => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>;
  updateInvestment: (id: string, data: Partial<Investment>) => Promise<void>;
  getInvestmentsByStatus: (status: Investment['status']) => Investment[];
}

export const useInvestmentStore = create<InvestmentState>()(
  persist(
    (set, get) => ({
      investments: [],
      activeInvestments: [],
      completedInvestments: [],
      isLoading: false,
      error: null,

      fetchInvestments: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/investments');
          const investments = response.data;
          
          set({
            investments,
            activeInvestments: investments.filter(i => i.status === 'active'),
            completedInvestments: investments.filter(i => i.status === 'completed'),
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Yatırımlar yüklenirken bir hata oluştu' 
          });
        }
      },

      addInvestment: async (investment) => {
        try {
          const response = await api.post('/investments', investment);
          const newInvestment = response.data;
          
          set(state => ({
            investments: [...state.investments, newInvestment],
            activeInvestments: newInvestment.status === 'active' 
              ? [...state.activeInvestments, newInvestment]
              : state.activeInvestments
          }));

          eventBus.publish('investment-added', { investment: newInvestment });
        } catch (error) {
          throw error;
        }
      },

      updateInvestment: async (id, data) => {
        try {
          const response = await api.put(`/investments/${id}`, data);
          const updatedInvestment = response.data;
          
          set(state => {
            const updatedInvestments = state.investments.map(inv =>
              inv.id === id ? { ...inv, ...updatedInvestment } : inv
            );

            return {
              investments: updatedInvestments,
              activeInvestments: updatedInvestments.filter(i => i.status === 'active'),
              completedInvestments: updatedInvestments.filter(i => i.status === 'completed')
            };
          });

          eventBus.publish('investment-updated', { id, data: updatedInvestment });
        } catch (error) {
          throw error;
        }
      },

      getInvestmentsByStatus: (status) => {
        return get().investments.filter(i => i.status === status);
      }
    }),
    {
      name: 'investment-store'
    }
  )
);