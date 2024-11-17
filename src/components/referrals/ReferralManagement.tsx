import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralForm } from './ReferralForm';
import { ReferralStatus } from './ReferralStatus';
import { ReferralLevels } from './ReferralLevels';
import { ReferralList } from './ReferralList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ReferralManagement() {
  const [showForm, setShowForm] = useState(false);

  // Örnek veriler (gerçek uygulamada API'den gelecek)
  const stats = {
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 7,
    totalCommission: 0,
    monthlyTarget: 0,
    nextLevelThreshold: 0,
    currentLevel: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Referans Yönetimi</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Referans
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2"
        >
          <ReferralStatus {...stats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Başarı Oranı</span>
                  <span className="text-lg font-bold text-green-500">
                    {((stats.successfulReferrals / stats.totalReferrals) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Aylık Hedef</span>
                  <span className="text-lg font-bold">
                    {stats.totalReferrals}/{stats.monthlyTarget}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bekleyen Onaylar</span>
                  <span className="text-lg font-bold text-yellow-500">
                    {stats.pendingReferrals}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Referans Listesi</TabsTrigger>
          <TabsTrigger value="levels">Seviye Sistemi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <ReferralList />
        </TabsContent>
        
        <TabsContent value="levels" className="mt-6">
          <ReferralLevels
            currentLevel={stats.currentLevel}
            totalReferrals={stats.totalReferrals}
          />
        </TabsContent>
      </Tabs>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl p-6">
            <ReferralForm onClose={() => setShowForm(false)} />
          </div>
        </motion.div>
      )}
    </div>
  );
}