import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendingInvestments } from '@/components/admin/PendingInvestments';
import { motion } from 'framer-motion';

export function AdminInvestments() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Yatırım Yönetimi</h1>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Bekleyen Yatırımlar</TabsTrigger>
          <TabsTrigger value="approved">Onaylanan Yatırımlar</TabsTrigger>
          <TabsTrigger value="rejected">Reddedilen Yatırımlar</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingInvestments />
        </TabsContent>

        <TabsContent value="approved">
          <div className="text-muted-foreground">
            Onaylanan yatırımlar burada listelenecek
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="text-muted-foreground">
            Reddedilen yatırımlar burada listelenecek
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}