import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSimulationStore } from '@/lib/simulationStore';

export function SimulationStats() {
  const { userCount, investmentRate, totalInvestments, activeInvestments, totalVolume } = useSimulationStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Aktif Kullanıcılar</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={userCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              {userCount}
            </motion.div>
            <Progress value={userCount / 100 * 100} className="mt-2" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Yatırım Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={investmentRate}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              %{investmentRate.toFixed(1)}
            </motion.div>
            <Progress value={investmentRate} className="mt-2" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Aktif Yatırımlar</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={activeInvestments}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              {activeInvestments}
            </motion.div>
            <div className="text-sm text-muted-foreground mt-1">
              Toplam: {totalInvestments}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Toplam Hacim</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={totalVolume}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              {totalVolume.toLocaleString()} USDT
            </motion.div>
            <div className="text-sm text-muted-foreground mt-1">
              Ortalama: {(totalVolume / activeInvestments).toFixed(0)} USDT
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}