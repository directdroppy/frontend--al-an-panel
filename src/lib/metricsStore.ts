import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';
import { eventBus } from './eventBus';
import type { MetricsResponse } from '@/types/api';

interface MetricsState {
  metrics: MetricsResponse['metrics'];
  countryStats: MetricsResponse['countryStats'];
  isLoading: boolean;
  error: string | null;
  lastUpdate: string;
  updateInterval: number;
  
  fetchMetrics: () => Promise<void>;
  startAutoUpdate: () => void;
  stopAutoUpdate: () => void;
}

const initialMetrics: MetricsResponse['metrics'] = {
  totalInvestments: 0,
  activeInvestments: 0,
  totalReferrals: 0,
  successfulReferrals: 0,
  totalRevenue: 0,
  monthlyGrowth: 0
};

export const useMetricsStore = create<MetricsState>()(
  persist(
    (set, get) => {
      let updateTimer: NodeJS.Timeout | null = null;

      return {
        metrics: initialMetrics,
        countryStats: {},
        isLoading: false,
        error: null,
        lastUpdate: new Date().toISOString(),
        updateInterval: 30000,

        fetchMetrics: async () => {
          set({ isLoading: true });
          try {
            const response = await api.system.getMetrics();
            const { metrics, countryStats } = response.data;

            set({
              metrics,
              countryStats,
              isLoading: false,
              error: null,
              lastUpdate: new Date().toISOString()
            });

            eventBus.publish('metrics-updated', { metrics, countryStats });
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Metrikler yüklenirken bir hata oluştu' 
            });
          }
        },

        startAutoUpdate: () => {
          const { updateInterval, fetchMetrics } = get();
          
          if (updateTimer) {
            clearInterval(updateTimer);
          }

          updateTimer = setInterval(fetchMetrics, updateInterval);
          fetchMetrics();
        },

        stopAutoUpdate: () => {
          if (updateTimer) {
            clearInterval(updateTimer);
            updateTimer = null;
          }
        }
      };
    },
    {
      name: 'metrics-store',
      partialize: (state) => ({
        metrics: state.metrics,
        countryStats: state.countryStats
      })
    }
  )
);