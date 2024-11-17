import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Target, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ReferralStatsProps {
  stats: {
    totalReferrals: number;
    successfulReferrals: number;
    totalCommission: number;
    monthlyGrowth: number;
    conversionRate: number;
    activeLeads: number;
  };
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  const items = [
    {
      title: 'Toplam Referanslar',
      value: stats.totalReferrals.toString(),
      icon: Users,
      description: 'Son 30 günde',
      trend: '0%',
      color: 'text-primary'
    },
    {
      title: 'Başarılı Referanslar',
      value: stats.successfulReferrals.toString(),
      icon: Target,
      description: 'Dönüşüm oranı',
      trend: `%${stats.conversionRate}`,
      color: 'text-green-500'
    },
    {
      title: 'Toplam Komisyon',
      value: formatCurrency(stats.totalCommission),
      icon: Award,
      description: 'Bu ay',
      trend: `%${stats.monthlyGrowth}`,
      color: 'text-blue-500'
    },
    {
      title: 'Aktif Adaylar',
      value: stats.activeLeads.toString(),
      icon: TrendingUp,
      description: 'Değerlendirmede',
      trend: 'Aktif',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <h3 className="text-lg sm:text-2xl font-bold">{item.value}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs sm:text-sm font-medium ${item.color}`}>
                      {item.trend}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}