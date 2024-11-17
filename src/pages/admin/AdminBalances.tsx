import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Check, X, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useBalanceStore } from '@/lib/balanceStore';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { z } from 'zod';

const emailSchema = z.string().email('Geçerli bir e-posta adresi giriniz');

export function AdminBalances() {
  const { user } = useAuth();
  const { 
    balances,
    getWithdrawalsByStatus,
    approveWithdrawal,
    rejectWithdrawal,
    addBalance,
    findUserByEmail
  } = useBalanceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAddBalanceDialog, setShowAddBalanceDialog] = useState(false);
  const [addBalanceForm, setAddBalanceForm] = useState({
    email: '',
    amount: '',
    type: 'investment_return' as const
  });
  const [emailError, setEmailError] = useState('');

  const pendingWithdrawals = getWithdrawalsByStatus('pending');
  const { toast } = useToast();

  const handleApprove = (request: any) => {
    if (!user) return;
    approveWithdrawal(request.id, user.id);
  };

  const handleReject = (request: any) => {
    if (!user || !rejectionReason) return;
    rejectWithdrawal(request.id, user.id, rejectionReason);
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedRequest(null);
  };

  const validateEmail = async (email: string) => {
    try {
      emailSchema.parse(email);
      const foundUser = await findUserByEmail(email);
      if (!foundUser) {
        setEmailError('Bu e-posta adresine sahip kullanıcı bulunamadı');
        return false;
      }
      setEmailError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError('Geçerli bir e-posta adresi giriniz');
      }
      return false;
    }
  };

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addBalanceForm.email || !addBalanceForm.amount) return;

    const isValid = await validateEmail(addBalanceForm.email);
    if (!isValid) return;

    try {
      await addBalance(
        addBalanceForm.email,
        parseFloat(addBalanceForm.amount),
        addBalanceForm.type
      );

      setShowAddBalanceDialog(false);
      setAddBalanceForm({
        email: '',
        amount: '',
        type: 'investment_return'
      });

      toast({
        title: "Bakiye Eklendi",
        description: "Kullanıcı bakiyesi başarıyla güncellendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bakiye eklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bakiye Yönetimi</h1>
          <p className="text-muted-foreground">
            Kullanıcı bakiyelerini ve çekim taleplerini yönetin
          </p>
        </div>
        <Button onClick={() => setShowAddBalanceDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Bakiye Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Çekim Talepleri */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bekleyen Çekim Talepleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingWithdrawals.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{request.userEmail}</h3>
                      <p className="text-sm text-muted-foreground">
                        Cüzdan: {request.walletAddress}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Talep: {format(new Date(request.createdAt), 'PPp', { locale: tr })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{request.amount} USDT</p>
                        <Badge>Beklemede</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500"
                          onClick={() => handleApprove(request)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectDialog(true);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {pendingWithdrawals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Bekleyen çekim talebi bulunmuyor.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kullanıcı Bakiyeleri */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Kullanıcı Bakiyeleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="space-y-4">
              {Object.entries(balances)
                .filter(([email]) => email.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(([email, balance]) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{email}</h3>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{balance} USDT</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reddetme Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Çekim Talebini Reddet</DialogTitle>
            <DialogDescription>
              Lütfen red sebebini belirtin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Red Sebebi</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Red sebebini açıklayın..."
                required
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
              >
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedRequest && handleReject(selectedRequest)}
                disabled={!rejectionReason}
              >
                Reddet
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bakiye Ekleme Dialog */}
      <Dialog open={showAddBalanceDialog} onOpenChange={setShowAddBalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bakiye Ekle</DialogTitle>
            <DialogDescription>
              Kullanıcıya bakiye ekleyin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddBalance} className="space-y-4">
            <div className="space-y-2">
              <Label>Kullanıcı E-posta</Label>
              <Input
                type="email"
                value={addBalanceForm.email}
                onChange={(e) => setAddBalanceForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                placeholder="ornek@email.com"
                required
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tutar (USDT)</Label>
              <Input
                type="number"
                value={addBalanceForm.amount}
                onChange={(e) => setAddBalanceForm(prev => ({
                  ...prev,
                  amount: e.target.value
                }))}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddBalanceDialog(false)}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={!addBalanceForm.email || !addBalanceForm.amount}
              >
                Ekle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}