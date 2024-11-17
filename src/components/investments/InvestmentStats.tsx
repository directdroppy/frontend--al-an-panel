import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, DollarSign } from 'lucide-react';

interface InvestmentStatsProps {
  stats: {
    totalAmount: number;
    activeInvestments: number;
    monthlyTarget: number;
    targetProgress: number;
    averageReturnRate: number;
    monthlyGrowth: number;
  };
}

const formatUSDT = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('$', '') + ' USDT';
};

export function InvestmentStats({ stats }: InvestmentStatsProps) {
  const items = [
    {
      title: 'Toplam Yatırım',
      value: formatUSDT(stats.totalAmount),
      icon: DollarSign,
      description: `${stats.monthlyGrowth}% artış`,
      color: 'text-green-500'
    },
    {
      title: 'Aktif Yatırımlar',
      value: stats.activeInvestments.toString(),
      icon: TrendingUp,
      description: 'aktif portföy',
      color: 'text-blue-500'
    },
    {
      title: 'Ortalama Getiri',
      value: `${stats.averageReturnRate}%`,
      icon: Clock,
      description: 'yıllık ortalama',
      color: 'text-purple-500'
    },
    {
      title: 'Aylık Hedef',
      value: formatUSDT(stats.monthlyTarget),
      icon: Target,
      description: `${stats.targetProgress}% tamamlandı`,
      color: 'text-amber-500',
      showProgress: true,
      progress: stats.targetProgress
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
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
              <item.icon className={`h-4 w-4 ${item.color}`} />
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
                  {item.description}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}