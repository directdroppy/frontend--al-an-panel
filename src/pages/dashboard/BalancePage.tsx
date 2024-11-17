import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { useBalanceStore } from '@/lib/balanceStore';
import { useAuth } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function BalancePage() {
  const { user } = useAuth();
  const { getUserBalance, createWithdrawalRequest, getUserTransactions } = useBalanceStore();
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  const balance = user ? getUserBalance(user.id) : 0;
  const transactions = user ? getUserTransactions(user.id) : [];

  const handleWithdraw = () => {
    if (!user) return;

    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Geçersiz Tutar',
        description: 'Lütfen geçerli bir tutar girin.',
        variant: 'destructive'
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: 'Cüzdan Adresi Gerekli',
        description: 'Lütfen USDT cüzdan adresinizi girin.',
        variant: 'destructive'
      });
      return;
    }

    createWithdrawalRequest({
      userId: user.id,
      amount,
      walletAddress
    });

    setShowWithdrawDialog(false);
    setWithdrawalAmount('');
    setWalletAddress('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bakiye</h1>
        <Button onClick={() => setShowWithdrawDialog(true)}>Para Çek</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Bakiye
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance)} USDT
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kazanç
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {formatCurrency(
                transactions
                  .filter(t => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )} USDT
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Çekim
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(
                Math.abs(
                  transactions
                    .filter(t => t.amount < 0)
                    .reduce((sum, t) => sum + t.amount, 0)
                )
              )} USDT
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İşlem Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    transaction.amount > 0 ? "bg-emerald-500/10" : "bg-red-500/10"
                  )}>
                    {transaction.amount > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "font-medium",
                  transaction.amount > 0 ? "text-emerald-500" : "text-red-500"
                )}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)} USDT
                </div>
              </motion.div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Henüz işlem bulunmuyor.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Para Çekme</DialogTitle>
            <DialogDescription>
              Lütfen çekmek istediğiniz tutarı ve USDT cüzdan adresinizi girin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Çekilecek Tutar (USDT)</Label>
              <Input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>USDT Cüzdan Adresi (TRC20)</Label>
              <Input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="TRC20 cüzdan adresi"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawDialog(false)}
              >
                İptal
              </Button>
              <Button onClick={handleWithdraw}>
                Para Çek
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}