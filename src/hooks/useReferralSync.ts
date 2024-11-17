import { useEffect } from 'react';
import { useReferralStore } from '@/lib/referralStore';
import { useAdminStore } from '@/lib/adminStore';
import { useBalanceStore } from '@/lib/balanceStore';
import { eventBus } from '@/lib/eventBus';
import { useSyncStore } from '@/lib/syncStore';

export function useReferralSync() {
  const referralStore = useReferralStore();
  const adminStore = useAdminStore();
  const balanceStore = useBalanceStore();
  const { startSync, completeSyncItem } = useSyncStore();

  useEffect(() => {
    const handleReferralCompleted = ({ referral }) => {
      startSync();

      // Add commission to user balance
      balanceStore.addBalance(
        referral.userId,
        referral.commission,
        'referral_commission'
      );

      // Update admin metrics
      adminStore.updateMetrics({
        successfulReferrals: adminStore.metrics.successfulReferrals + 1,
        totalRevenue: adminStore.metrics.totalRevenue + referral.commission
      });

      completeSyncItem();
    };

    const handleReferralApproved = ({ referral }) => {
      startSync();

      // Update referral store
      referralStore.updateReferral(referral.id, {
        status: 'successful',
        approvedAt: referral.approvedAt
      });

      // Update admin metrics
      adminStore.updateMetrics({
        totalReferrals: adminStore.metrics.totalReferrals + 1
      });

      completeSyncItem();
    };

    // Subscribe to events
    const unsubscribeCompleted = eventBus.subscribe('referral-completed', handleReferralCompleted);
    const unsubscribeApproved = eventBus.subscribe('referral-approved', handleReferralApproved);

    return () => {
      unsubscribeCompleted();
      unsubscribeApproved();
    };
  }, []);
}