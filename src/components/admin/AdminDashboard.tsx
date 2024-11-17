import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendingInvestments } from '@/components/admin/PendingInvestments';
import { ActiveInvestments } from '@/components/admin/ActiveInvestments';
import { CompletedInvestments } from '@/components/admin/CompletedInvestments';
import { AdminStats } from '@/components/admin/AdminStats';
import { UserManagement } from '@/components/admin/UserManagement';
import { SimulationControls } from '@/components/admin/SimulationControls';
import { RecentActivities } from '@/components/admin/RecentActivities';
import { InvestmentApprovalProcess } from '@/components/admin/InvestmentApprovalProcess';
import { useAdminStore } from '@/lib/adminStore';

export function AdminDashboard() {
  const { pendingCount } = useAdminStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Paneli</h1>
          <p className="text-muted-foreground">Sistem yönetimi ve kontrolleri</p>
        </div>
      </div>

      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf - Ana İçerik */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Onay Bekleyen Yatırımlar</span>
                {pendingCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {pendingCount} yeni
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InvestmentApprovalProcess />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktif Yatırımlar</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveInvestments />
            </CardContent>
          </Card>
        </div>

        {/* Sağ Taraf - Simülasyon Kontrolleri ve Aktiviteler */}
        <div className="space-y-6">
          <SimulationControls />

          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivities />
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Bekleyen Yatırımlar
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Aktif Yatırımlar</TabsTrigger>
          <TabsTrigger value="completed">Tamamlanan Yatırımlar</TabsTrigger>
          <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingInvestments />
        </TabsContent>

        <TabsContent value="active">
          <ActiveInvestments />
        </TabsContent>

        <TabsContent value="completed">
          <CompletedInvestments />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}