import { useEffect } from 'react';
import { useSimulationStore } from '@/lib/simulationStore';
import { useAdminStore } from '@/lib/adminStore';
import { useAppStore } from '@/lib/store';
import { eventBus } from '@/lib/eventBus';

export function useSimulationManager() {
  const simulationStore = useSimulationStore();
  const adminStore = useAdminStore();
  const appStore = useAppStore();

  useEffect(() => {
    let simulationInterval: NodeJS.Timeout;

    const startSimulation = () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }

      simulationInterval = setInterval(() => {
        if (!simulationStore.isEnabled) return;

        // Simülasyon verilerini güncelle
        const baseMetrics = {
          totalInvestment: 1000000,
          activeInvestments: 450,
          totalReferrals: 22,
          totalEarnings: 100000
        };

        // Simülasyon değişimlerini hesapla
        const randomChange = () => (Math.random() * 0.1) - 0.05; // -5% to +5%
        
        const simulatedMetrics = {
          totalInvestment: Math.max(0, baseMetrics.totalInvestment * (1 + randomChange())),
          activeInvestments: Math.max(0, Math.floor(baseMetrics.activeInvestments * (1 + randomChange()))),
          totalReferrals: Math.max(0, Math.floor(baseMetrics.totalReferrals * (1 + randomChange()))),
          totalEarnings: Math.max(0, baseMetrics.totalEarnings * (1 + randomChange())),
          monthlyGrowth: 14.3 + (Math.random() * 2 - 1)
        };

        // Admin store'u güncelle
        adminStore.updateMetrics({
          totalInvestments: simulatedMetrics.totalInvestment,
          activeInvestments: simulatedMetrics.activeInvestments,
          totalReferrals: simulatedMetrics.totalReferrals,
          totalRevenue: simulatedMetrics.totalEarnings,
          monthlyGrowth: simulatedMetrics.monthlyGrowth
        });

        // App store'u güncelle
        appStore.updateStats({
          totalInvestment: simulatedMetrics.totalInvestment,
          activeInvestments: simulatedMetrics.activeInvestments,
          totalReferrals: simulatedMetrics.totalReferrals,
          totalEarnings: simulatedMetrics.totalEarnings,
          monthlyGrowth: simulatedMetrics.monthlyGrowth
        });

        // Simülasyon eventini yayınla
        eventBus.publish('simulation-update', {
          metrics: simulatedMetrics,
          timestamp: new Date().toISOString()
        });

      }, Math.max(1000, 5000 / simulationStore.speed));
    };

    // Simülasyon değişikliklerini dinle
    const unsubscribeToggle = eventBus.subscribe('simulation-toggled', () => {
      if (simulationStore.isEnabled) {
        startSimulation();
      } else {
        clearInterval(simulationInterval);
      }
    });

    const unsubscribeSpeed = eventBus.subscribe('simulation-speed-changed', () => {
      startSimulation();
    });

    // İlk başlangıç
    if (simulationStore.isEnabled) {
      startSimulation();
    }

    // Cleanup
    return () => {
      unsubscribeToggle();
      unsubscribeSpeed();
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, []);
}