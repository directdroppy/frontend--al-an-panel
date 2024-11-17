import { useNotificationStore } from './notificationStore';
import { useAdminStore } from './adminStore';
import { useReferralStore } from './referralStore';

export function useNotificationManager() {
  const { addNotification } = useNotificationStore();
  const { investments } = useAdminStore();
  const { referrals } = useReferralStore();

  // Yeni yatırım bildirimi
  const notifyNewInvestment = (investment: any) => {
    addNotification({
      title: 'Yeni Yatırım Talebi',
      message: `${investment.userName} tarafından ${investment.amount} USDT tutarında yeni yatırım talebi.`,
      type: 'info',
      link: `/admin/investments/${investment.id}`
    });
  };

  // Yatırım onay bildirimi
  const notifyInvestmentApproval = (investment: any) => {
    addNotification({
      title: 'Yatırım Onaylandı',
      message: `${investment.amount} USDT tutarındaki yatırımınız onaylandı.`,
      type: 'success'
    });
  };

  // Yeni referans bildirimi
  const notifyNewReferral = (referral: any) => {
    addNotification({
      title: 'Yeni Referans',
      message: `${referral.clientName} için yeni referans kaydı oluşturuldu.`,
      type: 'info',
      link: `/admin/referrals/${referral.id}`
    });
  };

  // Hedef bildirimi
  const notifyGoalProgress = (progress: number, target: number) => {
    if (progress >= target) {
      addNotification({
        title: 'Hedef Tamamlandı! 🎉',
        message: 'Aylık hedefinize ulaştınız. Tebrikler!',
        type: 'success'
      });
    } else if (progress >= target * 0.9) {
      addNotification({
        title: 'Hedefe Yaklaşıyorsunuz',
        message: `Aylık hedefinize %${((progress / target) * 100).toFixed(1)} oranında ulaştınız.`,
        type: 'info'
      });
    }
  };

  // Başarı bildirimi
  const notifyAchievement = (achievementId: string, title: string) => {
    addNotification({
      title: 'Yeni Başarı! 🏆',
      message: `"${title}" başarısını kazandınız!`,
      type: 'success',
      link: '/achievements'
    });
  };

  return {
    notifyNewInvestment,
    notifyInvestmentApproval,
    notifyNewReferral,
    notifyGoalProgress,
    notifyAchievement
  };
}