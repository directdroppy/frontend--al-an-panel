import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { eventBus } from './eventBus';

interface SimulationMetrics {
  userCount: number;
  activeUsers: number;
  investmentRate: number;
  volatility: number;
  totalVolume: number;
  activeInvestments: number;
  monthlyGrowth: number;
  totalReferrals: number;
  activeReferrals: number;
  referralRate: number;
  conversionRate: number;
  averageInvestment: number;
  dailyTransactions: number;
  successRate: number;
}

interface SimulationState {
  isEnabled: boolean;
  speed: number;
  metrics: SimulationMetrics;
  lastUpdate: string;
  
  // Actions
  toggleSimulation: () => void;
  setSpeed: (speed: number) => void;
  updateMetrics: (metrics: Partial<SimulationMetrics>) => void;
  setUserCount: (count: number) => void;
  resetMetrics: () => void;
}

const initialMetrics: SimulationMetrics = {
  userCount: 82,
  activeUsers: 65,
  investmentRate: 15.5,
  volatility: 5,
  totalVolume: 1000000,
  activeInvestments: 450,
  monthlyGrowth: 14.3,
  totalReferrals: 128,
  activeReferrals: 45,
  referralRate: 12.5,
  conversionRate: 68,
  averageInvestment: 2500,
  dailyTransactions: 24,
  successRate: 95.5
};

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      isEnabled: false,
      speed: 1,
      metrics: initialMetrics,
      lastUpdate: new Date().toISOString(),

      toggleSimulation: () => {
        set(state => {
          const newState = { isEnabled: !state.isEnabled };
          eventBus.publish('simulation-toggled', newState);
          return newState;
        });
      },

      setSpeed: (speed) => {
        set({ speed });
        eventBus.publish('simulation-speed-changed', { speed });
      },

      updateMetrics: (newMetrics) => {
        set(state => {
          const updatedMetrics = {
            ...state.metrics,
            ...newMetrics
          };

          // Otomatik hesaplamalar
          if (newMetrics.userCount) {
            updatedMetrics.activeUsers = Math.floor(newMetrics.userCount * 0.8);
          }

          if (newMetrics.totalReferrals && newMetrics.conversionRate) {
            updatedMetrics.activeReferrals = Math.floor(
              newMetrics.totalReferrals * (newMetrics.conversionRate / 100)
            );
          }

          const newState = {
            metrics: updatedMetrics,
            lastUpdate: new Date().toISOString()
          };

          eventBus.publish('simulation-metrics-updated', {
            metrics: updatedMetrics,
            timestamp: newState.lastUpdate
          });

          return newState;
        });
      },

      setUserCount: (count) => {
        set(state => ({
          metrics: {
            ...state.metrics,
            userCount: count,
            activeUsers: Math.floor(count * 0.8)
          }
        }));
      },

      resetMetrics: () => {
        set({ metrics: initialMetrics });
      }
    }),
    {
      name: 'simulation-store',
      partialize: (state) => ({
        isEnabled: state.isEnabled,
        speed: state.speed,
        metrics: state.metrics
      })
    }
  )
);