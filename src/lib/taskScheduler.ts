import { useEffect } from 'react';
import { useAdminStore } from './adminStore';
import { useReferralStore } from './referralStore';
import { useNotificationStore } from './notificationStore';
import { usePerformanceStore } from './performanceStore';
import { useBalanceStore } from './balanceStore';
import { eventBus } from './eventBus';

export function useTaskScheduler() {
  const { updateMetrics: updateAdminMetrics } = useAdminStore();
  const { updateMetrics: updateReferralMetrics } = useReferralStore();
  const { addNotification } = useNotificationStore();
  const { updateDailyStats, updateWeeklyGoals } = usePerformanceStore();
  const { addInvestmentReturn, addReferralCommission } = useBalanceStore();

  // Bakiye güncellemelerini dinle
  useEffect(() => {
    const balanceUpdateSubscription = eventBus.subscribe('balance-update', (data) => {
      addNotification({
        title: 'Bakiye Güncellendi',
        message: `${data.amount} USDT ${
          data.type === 'investment_return' ? 'yatırım getirisi' :
          data.type === 'commission' ? 'referans komisyonu' :
          data.type === 'reward' ? 'başarı ödülü' : ''
        } hesabınıza eklendi.`,
        type: 'success'
      });
    });

    // Yatırım getirilerini dinle
    const investmentReturnSubscription = eventBus.subscribe('investment-return', (data) => {
      addInvestmentReturn(data.userId, data.amount);
    });

    // Referans komisyonlarını dinle
    const referralCommissionSubscription = eventBus.subscribe('referral-commission', (data) => {
      addReferralCommission(data.userId, data.amount);
    });

    return () => {
      balanceUpdateSubscription();
      investmentReturnSubscription();
      referralCommissionSubscription();
    };
  }, []);

  // Günlük istatistikleri güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      updateDailyStats({
        investments: Math.floor(Math.random() * 5),
        referrals: Math.floor(Math.random() * 3),
        revenue: Math.floor(Math.random() * 10000),
        commission: Math.floor(Math.random() * 1000)
      });
    }, 60000); // Her dakika

    return () => clearInterval(interval);
  }, []);

  // Haftalık hedefleri güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      updateWeeklyGoals({
        current: Math.floor(Math.random() * 8000),
        target: 10000
      });
    }, 300000); // Her 5 dakika

    return () => clearInterval(interval);
  }, []);

  // Admin metriklerini güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      updateAdminMetrics({
        totalInvestments: Math.floor(Math.random() * 1000000),
        activeInvestments: Math.floor(Math.random() * 100),
        totalReferrals: Math.floor(Math.random() * 500),
        successfulReferrals: Math.floor(Math.random() * 300),
        totalRevenue: Math.floor(Math.random() * 2000000),
        monthlyGrowth: Math.random() * 20
      });
    }, 120000); // Her 2 dakika

    return () => clearInterval(interval);
  }, []);

  // Referans metriklerini güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      updateReferralMetrics({
        totalReferrals: Math.floor(Math.random() * 200),
        successfulReferrals: Math.floor(Math.random() * 150),
        totalCommission: Math.floor(Math.random() * 50000),
        monthlyGrowth: Math.random() * 15,
        conversionRate: Math.random() * 100,
        activeLeads: Math.floor(Math.random() * 20)
      });
    }, 180000); // Her 3 dakika

    return () => clearInterval(interval);
  }, []);

  // Başarı kontrolü
  useEffect(() => {
    const interval = setInterval(() => {
      const achievements = [
        { id: 'investment-master', title: 'Yatırım Uzmanı', threshold: 1000000 },
        { id: 'referral-king', title: 'Referans Kralı', threshold: 50 },
        { id: 'goal-hunter', title: 'Hedef Avcısı', threshold: 12 }
      ];

      achievements.forEach(achievement => {
        if (Math.random() > 0.9) { // %10 şans
          eventBus.publish('achievement-unlocked', {
            id: achievement.id,
            title: achievement.title,
            reward: Math.floor(Math.random() * 1000)
          });
        }
      });
    }, 300000); // Her 5 dakika

    return () => clearInterval(interval);
  }, []);

  // Sistem sağlığı kontrolü
  useEffect(() => {
    const checkSystemHealth = () => {
      const metrics = {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        activeUsers: Math.floor(Math.random() * 1000),
        responseTime: Math.random() * 500
      };

      if (metrics.cpuUsage > 90 || metrics.memoryUsage > 90) {
        addNotification({
          title: 'Sistem Uyarısı',
          message: 'Yüksek kaynak kullanımı tespit edildi.',
          type: 'warning'
        });
      }

      if (metrics.responseTime > 400) {
        addNotification({
          title: 'Performans Uyarısı',
          message: 'Sistem yanıt süreleri yükseldi.',
          type: 'warning'
        });
      }
    };

    const interval = setInterval(checkSystemHealth, 600000); // Her 10 dakika
    return () => clearInterval(interval);
  }, []);

  // Otomatik yatırım getirisi hesaplama
  useEffect(() => {
    const calculateReturns = () => {
      const activeInvestments = [
        { userId: '1', amount: 1000, rate: 0.15 },
        { userId: '2', amount: 2000, rate: 0.12 },
        { userId: '3', amount: 5000, rate: 0.18 }
      ];

      activeInvestments.forEach(investment => {
        const dailyReturn = (investment.amount * investment.rate) / 365;
        eventBus.publish('investment-return', {
          userId: investment.userId,
          amount: dailyReturn
        });
      });
    };

    const interval = setInterval(calculateReturns, 86400000); // Her 24 saat
    return () => clearInterval(interval);
  }, []);
}