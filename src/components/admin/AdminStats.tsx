import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Target, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAdmin } from '@/lib/admin';
import { useEffect, useState } from 'react';

export function AdminStats() {
  const [stats, setStats] = useState({
    totalInvestment: 1250000,
    activeInvestments: 45,
    pendingApprovals: 12,
    totalUsers: 82,
    averageApprovalTime: '2.5 saat',
    dailyVolume: 75000,
    monthlyGrowth: 23.5,
    systemHealth: 98,
    totalUSDT: 2500000,
    activeUSDT: 1500000,
    pendingUSDT: 500000,
    completedUSDT: 500000
  });

  // Simüle edilmiş canlı veri güncellemesi
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalInvestment: prev.totalInvestment + (Math.random() * 10000 - 5000),
        activeInvestments: prev.activeInvestments + (Math.random() > 0.7 ? 1 : 0),
        pendingApprovals: Math.max(0, prev.pendingApprovals + (Math.random() > 0.5 ? 1 : -1)),
        dailyVolume: prev.dailyVolume + (Math.random() * 5000 - 2500),
        systemHealth: Math.min(100, Math.max(0, prev.systemHealth + (Math.random() * 2 - 1))),
        totalUSDT: prev.totalUSDT + (Math.random() * 50000 - 25000),
        activeUSDT: prev.activeUSDT + (Math.random() * 30000 - 15000),
        pendingUSDT: prev.pendingUSDT + (Math.random() * 10000 - 5000)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      title: 'Toplam Yatırım',
      value: `${Math.floor(stats.totalUSDT).toLocaleString()} USDT`,
      change: '+12.5%',
      icon: DollarSign,
      description: 'Son 30 günde'
    },
    {
      title: 'Aktif Yatırımlar',
      value: `${Math.floor(stats.activeUSDT).toLocaleString()} USDT`,
      change: '+8.2%',
      icon: TrendingUp,
      description: 'Bu ay'
    },
    {
      title: 'Bekleyen Onaylar',
      value: `${Math.floor(stats.pendingUSDT).toLocaleString()} USDT`,
      change: '+15.3%',
      icon: Target,
      description: 'Son 24 saat'
    },
    {
      title: 'Sistem Sağlığı',
      value: `%${stats.systemHealth.toFixed(1)}`,
      change: stats.systemHealth > 95 ? 'Normal' : 'Dikkat',
      icon: AlertCircle,
      description: 'Anlık durum',
      showProgress: true,
      progress: stats.systemHealth
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                {item.showProgress ? (
                  <div className="mt-2 space-y-1">
                    <Progress value={item.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    <span className={item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                      {item.change}
                    </span>
                    {' '}{item.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}