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

export function AdminDashboard() {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Taraf - Simülasyon ve İstatistikler */}
        <div className="space-y-6">
          <SimulationControls />
          
          <Card>
            <CardHeader>
              <CardTitle>Onay Bekleyen Yatırımlar</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestmentApprovalProcess />
            </CardContent>
          </Card>
        </div>

        {/* Sağ Taraf - Aktiviteler ve Diğer Bilgiler */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivities />
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
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Bekleyen Yatırımlar</TabsTrigger>
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