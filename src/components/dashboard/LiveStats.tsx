import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Wallet, Target, Users, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LiveStatsProps {
  data: {
    totalPortfolio: number;
    monthlyTarget: {
      current: number;
      total: number;
    };
    activeInvestments: number;
    averageReturn: number;
  };
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const LiveStats = memo(function LiveStats({ data }: LiveStatsProps) {
  const targetProgress = (data.monthlyTarget.current / data.monthlyTarget.total) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Portföy
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(data.totalPortfolio)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                +12.5%
              </span>
              Bu ay
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Aylık Hedef
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(data.monthlyTarget.total)}
            </div>
            <Progress value={targetProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              %{targetProgress.toFixed(1)} tamamlandı
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Yatırımlar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.activeInvestments}
            </div>
            <p className="text-xs text-muted-foreground">
              Aktif portföy sayısı
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ortalama Getiri
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              %{data.averageReturn}
            </div>
            <p className="text-xs text-muted-foreground">
              Yıllık ortalama
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
});