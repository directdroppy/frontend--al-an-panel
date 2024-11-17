import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from '@/components/ui/use-toast';
import { Investment } from '@/types/investment';
import { eventBus } from './eventBus';

interface AdminState {
  investments: Investment[];
  pendingInvestments: Investment[];
  metrics: SystemMetrics;
  settings: SystemSettings;
  countryStats: Record<string, CountryStats>;
  paymentDetails: PaymentDetails;
  simulation: SimulationState;
  
  // State Management
  getFullState: () => Partial<AdminState>;
  
  // Investment Management
  addPendingInvestment: (investment: Investment) => void;
  approveInvestment: (id: string, adminId: string, adminName: string, notes?: string) => void;
  rejectInvestment: (id: string, adminId: string, adminName: string, reason: string) => void;
  
  // System Management
  updateMetrics: (metrics: Partial<SystemMetrics>) => void;
  updateSettings: (settings: Partial<SystemSettings>) => void;
  updateCountryStats: (countryCode: string, stats: Partial<CountryStats>) => void;
  updatePaymentDetails: (details: Partial<PaymentDetails>) => void;

  // Simulation Controls
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  updateSimulationMetrics: (metrics: Partial<SimulationMetrics>) => void;
}

interface SystemMetrics {
  totalInvestments: number;
  activeInvestments: number;
  successfulInvestments: number;
  totalReferrals: number;
  successfulReferrals: number;
  totalRevenue: number;
  monthlyGrowth: number;
  userCount?: number;
  activeUsers?: number;
  dailyTransactions?: number;
  conversionRate?: number;
}

interface SystemSettings {
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  referralCommissionRate: number;
  employeeCommissionRate: number;
  autoApprovalEnabled: boolean;
  notificationsEnabled: boolean;
}

interface CountryStats {
  totalInvestment: number;
  activeInvestments: number;
  occupancyRate: number;
  averageReturn: number;
  riskScore: number;
}

interface PaymentDetails {
  walletAddress: string;
  qrCode: string | null;
}

interface SimulationState {
  isEnabled: boolean;
  speed: number;
  metrics: SimulationMetrics;
  lastUpdate: string;
}

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

const initialMetrics: SystemMetrics = {
  totalInvestments: 1000000,
  activeInvestments: 450,
  successfulInvestments: 1200,
  totalReferrals: 128,
  successfulReferrals: 87,
  totalRevenue: 2500000,
  monthlyGrowth: 14.3,
  userCount: 82,
  activeUsers: 65,
  dailyTransactions: 24,
  conversionRate: 68
};

const initialSettings: SystemSettings = {
  minInvestmentAmount: 50,
  maxInvestmentAmount: 100000,
  referralCommissionRate: 10,
  employeeCommissionRate: 5,
  autoApprovalEnabled: false,
  notificationsEnabled: true
};

const initialSimulationMetrics: SimulationMetrics = {
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

const initialState = {
  investments: [],
  pendingInvestments: [],
  metrics: initialMetrics,
  settings: initialSettings,
  countryStats: {},
  paymentDetails: {
    walletAddress: 'TWd2yzw5yFc5W8Tq6CuRRsqJxgEH2h8DBE',
    qrCode: null
  },
  simulation: {
    isEnabled: false,
    speed: 1,
    metrics: initialSimulationMetrics,
    lastUpdate: new Date().toISOString()
  }
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      ...initialState,

      getFullState: () => {
        const state = get();
        return {
          investments: state.investments,
          pendingInvestments: state.pendingInvestments,
          metrics: state.metrics,
          settings: state.settings,
          countryStats: state.countryStats,
          paymentDetails: state.paymentDetails,
          simulation: state.simulation
        };
      },

      addPendingInvestment: (investment) => {
        set((state) => ({
          pendingInvestments: [...state.pendingInvestments, investment]
        }));
        
        toast({
          title: 'Yeni Yatırım Talebi',
          description: `${investment.userName} tarafından yeni bir yatırım talebi geldi.`
        });

        if (investment.countryCode) {
          const currentStats = get().countryStats[investment.countryCode] || {
            totalInvestment: 0,
            activeInvestments: 0,
            occupancyRate: 70,
            averageReturn: 0,
            riskScore: 0
          };

          get().updateCountryStats(investment.countryCode, {
            totalInvestment: currentStats.totalInvestment + investment.amount,
            activeInvestments: currentStats.activeInvestments + 1,
            occupancyRate: Math.min(100, currentStats.occupancyRate + 5)
          });
        }
      },

      approveInvestment: (id, adminId, adminName, notes) => {
        set((state) => {
          const investment = state.pendingInvestments.find(inv => inv.id === id);
          if (!investment) return state;

          const updatedInvestment = {
            ...investment,
            status: 'active',
            approvedAt: new Date().toISOString(),
            approvedBy: adminId,
            approvedByName: adminName,
            notes
          };

          eventBus.publish('investment-approved', {
            investment: updatedInvestment,
            adminId,
            adminName
          });

          const newMetrics = {
            ...state.metrics,
            activeInvestments: state.metrics.activeInvestments + 1,
            totalInvestments: state.metrics.totalInvestments + 1,
            totalRevenue: state.metrics.totalRevenue + investment.amount
          };

          return {
            pendingInvestments: state.pendingInvestments.filter(inv => inv.id !== id),
            investments: [...state.investments, updatedInvestment],
            metrics: newMetrics
          };
        });

        toast({
          title: 'Yatırım Onaylandı',
          description: 'Yatırım başarıyla onaylandı.'
        });
      },

      rejectInvestment: (id, adminId, adminName, reason) => {
        set((state) => {
          const investment = state.pendingInvestments.find(inv => inv.id === id);
          if (!investment) return state;

          const updatedInvestment = {
            ...investment,
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectedBy: adminId,
            rejectedByName: adminName,
            rejectionReason: reason
          };

          eventBus.publish('investment-rejected', {
            investment: updatedInvestment,
            adminId,
            adminName,
            reason
          });

          return {
            pendingInvestments: state.pendingInvestments.filter(inv => inv.id !== id),
            investments: [...state.investments, updatedInvestment]
          };
        });

        toast({
          title: 'Yatırım Reddedildi',
          description: 'Yatırım reddedildi.',
          variant: 'destructive'
        });
      },

      updateMetrics: (metrics) => {
        set(state => ({
          metrics: { ...state.metrics, ...metrics }
        }));
        eventBus.publish('admin-metrics-updated', metrics);
      },

      updateSettings: (settings) => {
        set(state => ({
          settings: { ...state.settings, ...settings }
        }));
        
        toast({
          title: 'Ayarlar Güncellendi',
          description: 'Sistem ayarları başarıyla güncellendi.'
        });
      },

      updateCountryStats: (countryCode, stats) => {
        set(state => ({
          countryStats: {
            ...state.countryStats,
            [countryCode]: {
              ...state.countryStats[countryCode],
              ...stats
            }
          }
        }));
      },

      updatePaymentDetails: (details) => {
        set(state => ({
          paymentDetails: {
            ...state.paymentDetails,
            ...details
          }
        }));

        toast({
          title: 'Ödeme Detayları Güncellendi',
          description: 'Ödeme bilgileri başarıyla güncellendi.'
        });
      },

      toggleSimulation: () => {
        set(state => ({
          simulation: {
            ...state.simulation,
            isEnabled: !state.simulation.isEnabled
          }
        }));
        eventBus.publish('simulation-toggled', { isEnabled: !get().simulation.isEnabled });
      },

      setSimulationSpeed: (speed) => {
        set(state => ({
          simulation: {
            ...state.simulation,
            speed
          }
        }));
        eventBus.publish('simulation-speed-changed', { speed });
      },

      updateSimulationMetrics: (metrics) => {
        set(state => ({
          simulation: {
            ...state.simulation,
            metrics: {
              ...state.simulation.metrics,
              ...metrics
            },
            lastUpdate: new Date().toISOString()
          }
        }));
        eventBus.publish('simulation-metrics-updated', metrics);
      }
    }),
    {
      name: 'admin-store',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...initialState,
            ...persistedState,
            investments: Array.isArray(persistedState?.investments) ? persistedState.investments : [],
            pendingInvestments: Array.isArray(persistedState?.pendingInvestments) ? persistedState.pendingInvestments : [],
            metrics: {
              ...initialMetrics,
              ...persistedState?.metrics
            },
            settings: {
              ...initialSettings,
              ...persistedState?.settings
            }
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        settings: state.settings,
        metrics: state.metrics,
        countryStats: state.countryStats,
        paymentDetails: state.paymentDetails,
        simulation: {
          isEnabled: state.simulation.isEnabled,
          speed: state.simulation.speed
        }
      })
    }
  )
);