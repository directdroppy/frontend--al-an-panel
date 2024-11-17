import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      title: 'Toplam Yatırım',
      value: formatCurrency(stats.totalInvestment),
      icon: TrendingUp,
      trend: '+12%'
    },
    {
      title: 'Aktif Yatırımlar',
      value: stats.activeInvestments.toString(),
      icon: Target,
      trend: '+8%'
    },
    {
      title: 'Toplam Referanslar',
      value: stats.totalReferrals.toString(),
      icon: Users,
      trend: '+15%'
    },
    {
      title: 'Toplam Kazanç',
      value: formatCurrency(stats.totalEarnings),
      icon: Award,
      trend: '+10%'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">{item.trend}</span> son 30 gün
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}