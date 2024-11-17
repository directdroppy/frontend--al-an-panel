import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBalanceStore } from '@/lib/balanceStore';
import { useAuth } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BalanceHeader() {
  const { user } = useAuth();
  const { getUserBalance, getUserTransactions } = useBalanceStore();
  const navigate = useNavigate();

  const balance = user ? getUserBalance(user.id) : 0;
  const transactions = user ? getUserTransactions(user.id) : [];

  const totalEarnings = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 border-b"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between bg-primary/5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Toplam Bakiye</p>
            <p className="text-2xl font-bold">{formatCurrency(balance)} USDT</p>
          </div>
          <Wallet className="h-8 w-8 text-primary opacity-50" />
        </Card>

        <Card className="p-4 flex items-center justify-between bg-emerald-500/5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Toplam Kazanç</p>
            <p className="text-2xl font-bold text-emerald-500">
              +{formatCurrency(totalEarnings)} USDT
            </p>
          </div>
          <ArrowUpRight className="h-8 w-8 text-emerald-500 opacity-50" />
        </Card>

        <Card className="p-4 flex items-center justify-between bg-red-500/5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Toplam Çekim</p>
            <p className="text-2xl font-bold text-red-500">
              -{formatCurrency(totalWithdrawals)} USDT
            </p>
          </div>
          <ArrowDownRight className="h-8 w-8 text-red-500 opacity-50" />
        </Card>

        <Card className="p-4 flex items-center justify-between bg-blue-500/5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Aktif Getiri</p>
            <p className="text-2xl font-bold text-blue-500">%15.5</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" />
        </Card>
      </div>

      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate('/balance')}
        >
          <Wallet className="w-4 h-4" />
          Bakiye Detayları
        </Button>
      </div>
    </motion.div>
  );
}