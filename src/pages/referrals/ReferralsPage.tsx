import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { ReferralList } from '@/components/referrals/ReferralList';
import { ReferralStats } from '@/components/referrals/ReferralStats';
import { ReferralChart } from '@/components/referrals/ReferralChart';
import { ReferralForm } from '@/components/referrals/ReferralForm';
import { ReferralRewards } from '@/components/referrals/ReferralRewards';
import { mockReferrals, mockReferralStats } from '@/data/referrals';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ReferralsPage() {
  const [showForm, setShowForm] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6 pb-16 lg:pb-0"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Referanslar</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Referans ağınızı genişletin ve kazanın
          </p>
        </div>
        <Button 
          className="w-full sm:w-auto gap-2" 
          onClick={() => setShowForm(true)}
          size={isMobile ? "sm" : "default"}
        >
          <Plus className="w-4 h-4" />
          Yeni Referans
        </Button>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-0">
        <ReferralStats stats={mockReferralStats} />
      </div>

      {/* Charts and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Referans Performansı
              </CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-2" : "p-6"}>
              <ReferralChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Hızlı İstatistikler</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3" : "p-6"}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Başarılı Referanslar</span>
                  <span className="text-base sm:text-lg font-bold text-green-500">
                    {mockReferralStats.successfulReferrals}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dönüşüm Oranı</span>
                  <span className="text-base sm:text-lg font-bold text-primary">
                    %{mockReferralStats.conversionRate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Aktif Adaylar</span>
                  <span className="text-base sm:text-lg font-bold text-blue-500">
                    {mockReferralStats.activeLeads}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rewards */}
      <div className="px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ReferralRewards />
        </motion.div>
      </div>

      {/* Referral List */}
      <div className="px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Referans Listesi</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-2" : "p-6"}>
              <ReferralList referrals={mockReferrals} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-2xl">
            <ReferralForm onClose={() => setShowForm(false)} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}