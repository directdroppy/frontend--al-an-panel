import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';
import { toast } from '@/components/ui/use-toast';
import type { SystemSettings } from '@/types/api';

interface SettingsState {
  settings: SystemSettings;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SystemSettings>) => Promise<void>;
}

const initialSettings: SystemSettings = {
  minInvestmentAmount: 50,
  maxInvestmentAmount: 100000,
  referralCommissionRate: 10,
  employeeCommissionRate: 5,
  paymentDetails: {
    walletAddress: 'TWd2yzw5yFc5W8Tq6CuRRsqJxgEH2h8DBE',
    network: 'TRC20',
    minAmount: 50,
    maxAmount: 100000,
    processingTime: '5-15 dakika',
    confirmations: 12
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: initialSettings,
      isLoading: false,
      error: null,

      fetchSettings: async () => {
        set({ isLoading: true });
        try {
          const response = await api.system.getMetrics();
          set({
            settings: response.data,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Ayarlar yüklenirken bir hata oluştu' 
          });
        }
      },

      updateSettings: async (newSettings) => {
        set({ isLoading: true });
        try {
          await api.system.updateSettings(newSettings);
          
          set(state => ({
            settings: {
              ...state.settings,
              ...newSettings
            },
            isLoading: false,
            error: null
          }));

          toast({
            title: "Başarılı",
            description: "Ayarlar başarıyla güncellendi.",
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Ayarlar güncellenirken bir hata oluştu' 
          });

          toast({
            title: "Hata",
            description: "Ayarlar güncellenirken bir hata oluştu.",
            variant: "destructive"
          });
        }
      }
    }),
    {
      name: 'settings-store',
      partialize: (state) => ({
        settings: state.settings
      })
    }
  )
);