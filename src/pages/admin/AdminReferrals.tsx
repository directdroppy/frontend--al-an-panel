import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, TrendingUp, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReferralStore } from '@/lib/referralStore';
import { formatCurrency } from '@/lib/utils';
import { ReferralList } from '@/components/referrals/ReferralList';
import { ReferralForm } from '@/components/referrals/ReferralForm';
import { ReferralLevels } from '@/components/referrals/ReferralLevels';

export function AdminReferrals() {
  const [showForm, setShowForm] = useState(false);
  const { referrals = [], stats } = useReferralStore();

  const safeStats = {
    totalReferrals: 0,
    successfulReferrals: 0,
    totalCommission: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    activeLeads: 0,
    ...stats
  };

  const metrics = [
    {
      title: 'Toplam Referanslar',
      value: safeStats.totalReferrals,
      icon: Users,
      change: `+${safeStats.monthlyGrowth?.toFixed(1) || '0.0'}%`,
      description: 'Son 30 gün'
    },
    {
      title: 'Başarılı Dönüşümler',
      value: `${safeStats.conversionRate?.toFixed(1) || '0.0'}%`,
      icon: Target,
      change: `${safeStats.activeLeads} aktif aday`,
      description: 'Dönüşüm oranı'
    },
    {
      title: 'Toplam Komisyon',
      value: formatCurrency(safeStats.totalCommission),
      icon: TrendingUp,
      change: `${safeStats.successfulReferrals} başarılı`,
      description: 'Bu ay'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Referans Yönetimi</h1>
          <p className="text-muted-foreground">
            Tüm referans işlemlerini buradan yönetin
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Referans
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-500">{metric.change}</span>
                    <span className="text-muted-foreground ml-2">{metric.description}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Referans Listesi</TabsTrigger>
          <TabsTrigger value="levels">Seviye Sistemi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Referans Listesi</CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralList referrals={Array.isArray(referrals) ? referrals : []} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="levels" className="mt-6">
          <ReferralLevels
            currentLevel={Math.floor(safeStats.totalReferrals / 5)}
            totalReferrals={safeStats.totalReferrals}
          />
        </TabsContent>
      </Tabs>

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
    </div>
  );
}