import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceOverview } from './PerformanceOverview';
import { LiveLeaderboard } from './LiveLeaderboard';
import { AchievementShowcase } from './AchievementShowcase';
import { NotificationCenter } from './NotificationCenter';
import { QuickActions } from './QuickActions';
import { InvestmentOpportunities } from '@/components/investments/InvestmentOpportunities';
import { useAuth } from '@/lib/auth';
import { BalanceHeader } from './BalanceHeader';

export function GamifiedDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6">
      {/* Bakiye Gösterimi */}
      <BalanceHeader />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hoş Geldiniz, {user?.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Güncel performansınızı ve yatırımlarınızı takip edin
          </p>
        </div>
        <QuickActions />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="investments">Yatırımlar</TabsTrigger>
          <TabsTrigger value="leaderboard">Sıralama</TabsTrigger>
          <TabsTrigger value="achievements">Başarılar</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <PerformanceOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveLeaderboard />
              <NotificationCenter />
            </div>
          </TabsContent>

          <TabsContent value="investments">
            <InvestmentOpportunities />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LiveLeaderboard fullWidth />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementShowcase />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}