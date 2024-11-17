import { useEffect } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { useAppStore } from '@/lib/store';
import { useSharedStore } from '@/lib/sharedStore';
import { useSyncStore } from '@/lib/syncStore';
import { eventBus } from '@/lib/eventBus';

export function useSyncManager() {
  const adminStore = useAdminStore();
  const appStore = useAppStore();
  const sharedStore = useSharedStore();
  const { startSync, completeSyncItem } = useSyncStore();

  useEffect(() => {
    // Yatırım senkronizasyonu
    const handleInvestmentSync = ({ investment, action }) => {
      startSync();
      
      const updates = {
        status: investment.status,
        approvedAt: investment.approvedAt,
        completedAt: investment.completedAt,
        returns: investment.returns
      };

      // Tüm store'ları güncelle
      appStore.updateInvestment(investment.id, updates);
      sharedStore.updateInvestment(investment.id, updates);

      // Admin metriklerini güncelle
      if (action === 'approve') {
        adminStore.updateMetrics({
          activeInvestments: adminStore.metrics.activeInvestments + 1,
          totalInvestments: adminStore.metrics.totalInvestments + 1
        });
      }

      completeSyncItem();
    };

    // Referans senkronizasyonu
    const handleReferralSync = ({ referral, action }) => {
      startSync();
      
      const updates = {
        status: referral.status,
        approvedAt: referral.approvedAt,
        completedAt: referral.completedAt,
        commission: referral.commission
      };

      // Tüm store'ları güncelle
      appStore.updateReferral(referral.id, updates);
      sharedStore.updateReferral(referral.id, updates);

      // Admin metriklerini güncelle
      if (action === 'approve') {
        adminStore.updateMetrics({
          totalReferrals: adminStore.metrics.totalReferrals + 1,
          successfulReferrals: adminStore.metrics.successfulReferrals + 1
        });
      }

      completeSyncItem();
    };

    // Bakiye senkronizasyonu
    const handleBalanceSync = ({ userId, amount, type }) => {
      startSync();
      
      // Metrikleri güncelle
      const metrics = {
        totalEarnings: (appStore.stats.totalEarnings || 0) + amount
      };
      
      appStore.updateStats(metrics);
      sharedStore.updateMetrics(metrics);
      
      // Admin metriklerini güncelle
      adminStore.updateMetrics({
        totalRevenue: adminStore.metrics.totalRevenue + amount
      });

      completeSyncItem();
    };

    // Event dinleyicilerini ekle
    const unsubscribeInvestment = eventBus.subscribe('investment-sync', handleInvestmentSync);
    const unsubscribeReferral = eventBus.subscribe('referral-sync', handleReferralSync);
    const unsubscribeBalance = eventBus.subscribe('balance-sync', handleBalanceSync);

    // Periyodik senkronizasyon
    const syncInterval = setInterval(() => {
      startSync();
      
      // Admin metriklerini al
      const adminState = adminStore.getFullState();
      if (!adminState || !adminState.metrics) return;
      
      // Tüm store'ları güncelle
      const metrics = {
        totalInvestment: adminState.metrics.totalInvestments,
        activeInvestments: adminState.metrics.activeInvestments,
        totalReferrals: adminState.metrics.totalReferrals,
        totalEarnings: adminState.metrics.totalRevenue
      };

      appStore.updateStats(metrics);
      sharedStore.updateMetrics(metrics);

      completeSyncItem();
    }, 5000);

    // Cleanup
    return () => {
      unsubscribeInvestment();
      unsubscribeReferral();
      unsubscribeBalance();
      clearInterval(syncInterval);
    };
  }, []);
}