import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface ReferralStatusProps {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalCommission: number;
  monthlyTarget: number;
  nextLevelThreshold: number;
}

export function ReferralStatus({
  totalReferrals,
  successfulReferrals,
  pendingReferrals,
  totalCommission,
  monthlyTarget,
  nextLevelThreshold,
}: ReferralStatusProps) {
  const progress = (totalReferrals / monthlyTarget) * 100;
  const levelProgress = (totalReferrals / nextLevelThreshold) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referans Durumu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aylık Hedef */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span>Aylık Hedef</span>
            <span className="font-medium">{totalReferrals} / {monthlyTarget}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Aylık hedefinize ulaşmaya {monthlyTarget - totalReferrals} referans kaldı
          </p>
        </motion.div>

        {/* Seviye İlerlemesi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span>Sonraki Seviye</span>
            <span className="font-medium">{totalReferrals} / {nextLevelThreshold}</span>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Bir sonraki seviyeye {nextLevelThreshold - totalReferrals} referans kaldı
          </p>
        </motion.div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-1"
          >
            <span className="text-sm text-muted-foreground">Başarılı</span>
            <div className="flex items-center gap-2">
              <Badge variant="success">{successfulReferrals}</Badge>
              <span className="text-sm font-medium">referans</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1"
          >
            <span className="text-sm text-muted-foreground">Bekleyen</span>
            <div className="flex items-center gap-2">
              <Badge variant="warning">{pendingReferrals}</Badge>
              <span className="text-sm font-medium">referans</span>
            </div>
          </motion.div>
        </div>

        {/* Toplam Komisyon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4 border-t"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Toplam Komisyon</span>
            <span className="text-2xl font-bold">
              {formatCurrency(totalCommission)}
            </span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}