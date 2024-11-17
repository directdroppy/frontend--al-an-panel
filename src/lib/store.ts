import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee } from '@/types/employee';
import { Investment } from '@/types/investment';

interface AppState {
  currentUser: Employee | null;
  investments: Investment[];
  simulationEnabled: boolean;
  simulationSpeed: number;
  
  stats: {
    totalInvestment: number;
    activeInvestments: number;
    totalReferrals: number;
    totalEarnings: number;
    dailyVolume: number;
    monthlyGrowth: number;
  };

  setCurrentUser: (user: Employee | null) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, data: Partial<Investment>) => void;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  updateStats: (stats: Partial<AppState['stats']>) => void;
}

const initialState: AppState = {
  currentUser: null,
  investments: [],
  simulationEnabled: false,
  simulationSpeed: 1,
  
  stats: {
    totalInvestment: 0,
    activeInvestments: 0,
    totalReferrals: 0,
    totalEarnings: 0,
    dailyVolume: 0,
    monthlyGrowth: 0
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentUser: (user) => set({ currentUser: user }),

      addInvestment: (investment) => set((state) => ({
        investments: [...state.investments, investment],
        stats: {
          ...state.stats,
          totalInvestment: state.stats.totalInvestment + investment.amount,
          activeInvestments: state.stats.activeInvestments + 1
        }
      })),

      updateInvestment: (id, data) => set((state) => ({
        investments: state.investments.map((inv) =>
          inv.id === id ? { ...inv, ...data } : inv
        )
      })),

      toggleSimulation: () => set((state) => ({
        simulationEnabled: !state.simulationEnabled
      })),

      setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

      updateStats: (stats) => set((state) => ({
        stats: { ...state.stats, ...stats }
      }))
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        simulationEnabled: state.simulationEnabled,
        simulationSpeed: state.simulationSpeed
      })
    }
  )
);