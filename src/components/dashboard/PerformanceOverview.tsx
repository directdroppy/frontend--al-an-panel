import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { eventBus } from '@/lib/eventBus';

export function PerformanceOverview() {
  const { stats } = useAppStore();
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    activeInvestments: 0,
    totalReferrals: 0,
    totalEarnings: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    // Simülasyon verilerini dinle
    const handleSimulationUpdate = (data: any) => {
      updateMetrics(data.metrics);
    };

    // Gerçek verileri dinle
    const handleMetricsUpdate = (data: any) => {
      updateMetrics(data);
    };

    const updateMetrics = (data: any) => {
      setMetrics(prev => ({
        ...prev,
        ...data,
        totalInvestment: data.totalInvestment || prev.totalInvestment,
        activeInvestments: data.activeInvestments || prev.activeInvestments,
        totalReferrals: data.totalReferrals || prev.totalReferrals,
        totalEarnings: data.totalEarnings || prev.totalEarnings,
        monthlyGrowth: data.monthlyGrowth || prev.monthlyGrowth
      }));
    };

    // Event dinleyicileri
    const unsubscribeSim = eventBus.subscribe('simulation-update', handleSimulationUpdate);
    const unsubscribeMetrics = eventBus.subscribe('metrics-update', handleMetricsUpdate);

    // İlk yükleme
    updateMetrics(stats);

    return () => {
      unsubscribeSim();
      unsubscribeMetrics();
    };
  }, [stats]);

  const statsData = [
    {
      title: 'Toplam Yatırım',
      value: `${formatCurrency(metrics.totalInvestment)} USDT`,
      icon: TrendingUp,
      change: `+${metrics.monthlyGrowth.toFixed(1)}%`,
      trend: 'up',
      description: 'Son 30 günde'
    },
    {
      title: 'Aktif Yatırımlar',
      value: metrics.activeInvestments.toString(),
      icon: Target,
      change: '+8.2%',
      trend: 'up',
      description: 'Geçen aya göre'
    },
    {
      title: 'Referanslar',
      value: metrics.totalReferrals.toString(),
      icon: Users,
      change: '+15.3%',
      trend: 'up',
      description: 'Bu ay'
    },
    {
      title: 'Toplam Kazanç',
      value: `${formatCurrency(metrics.totalEarnings)} USDT`,
      icon: Award,
      change: '+10.1%',
      trend: 'up',
      description: 'Son 30 günde'
    }
  ];

  const goals = [
    {
      title: 'Aylık Hedef',
      current: metrics.totalInvestment,
      target: 100000,
      progress: Math.min(100, (metrics.totalInvestment / 100000) * 100),
      format: true
    },
    {
      title: 'Referans Hedefi',
      current: metrics.totalReferrals,
      target: 50,
      progress: Math.min(100, (metrics.totalReferrals / 50) * 100),
      format: false
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className={stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
                  <span className="text-muted-foreground">İlerleme</span>
                  <span>
                    {goal.format 
                      ? `${formatCurrency(goal.current)} / ${formatCurrency(goal.target)} USDT`
                      : `${goal.current} / ${goal.target}`}
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Hedefe ulaşmaya {goal.format 
                    ? `${formatCurrency(Math.max(0, goal.target - goal.current))} USDT`
                    : Math.max(0, goal.target - goal.current)} kaldı
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}