import { useEffect } from 'react';
import { useInvestmentStore } from '@/lib/investmentStore';
import { useAdminStore } from '@/lib/adminStore';
import { useBalanceStore } from '@/lib/balanceStore';
import { eventBus } from '@/lib/eventBus';
import { useSyncStore } from '@/lib/syncStore';

export function useInvestmentSync() {
  const investmentStore = useInvestmentStore();
  const adminStore = useAdminStore();
  const balanceStore = useBalanceStore();
  const { startSync, completeSyncItem } = useSyncStore();

  useEffect(() => {
    const handleInvestmentCompleted = ({ investment }) => {
      startSync();

      // Add returns to user balance
      balanceStore.addBalance(
        investment.userId,
        investment.returns,
        'investment_return'
      );

      // Update admin metrics
      adminStore.updateMetrics({
        totalRevenue: adminStore.metrics.totalRevenue + investment.returns
      });

      completeSyncItem();
    };

    const handleInvestmentApproved = ({ investment }) => {
      startSync();

      // Update investment store
      investmentStore.updateInvestment(investment.id, {
        status: 'active',
        approvedAt: investment.approvedAt
      });

      // Update admin metrics
      adminStore.updateMetrics({
        activeInvestments: adminStore.metrics.activeInvestments + 1
      });

      completeSyncItem();
    };

    // Subscribe to events
    const unsubscribeCompleted = eventBus.subscribe('investment-completed', handleInvestmentCompleted);
    const unsubscribeApproved = eventBus.subscribe('investment-approved', handleInvestmentApproved);

    return () => {
      unsubscribeCompleted();
      unsubscribeApproved();
    };
  }, []);
}