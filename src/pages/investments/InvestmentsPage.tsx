import { motion } from 'framer-motion';
import { InvestmentOpportunities } from '@/components/investments/InvestmentOpportunities';
import { InvestmentList } from '@/components/investments/InvestmentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvestmentStore } from '@/lib/investmentStore';

export function InvestmentsPage() {
  const { investments = [] } = useInvestmentStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Yatırım Merkezi</h1>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="opportunities">Yatırım Fırsatları</TabsTrigger>
          <TabsTrigger value="my-investments">Yatırımlarım</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <InvestmentOpportunities />
        </TabsContent>

        <TabsContent value="my-investments">
          <Card>
            <CardHeader>
              <CardTitle>Yatırım Portföyüm</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestmentList investments={investments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}