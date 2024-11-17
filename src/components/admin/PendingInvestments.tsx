import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Check, X, ExternalLink, FileText } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export function PendingInvestments() {
  const { investments, approveInvestment, rejectInvestment } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showProofDialog, setShowProofDialog] = useState(false);

  const pendingInvestments = investments.filter(
    (inv) => inv.status === 'pending' &&
    (inv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inv.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = () => {
    if (selectedInvestment) {
      approveInvestment(selectedInvestment.id, approvalNotes);
      setSelectedInvestment(null);
      setApprovalNotes('');
    }
  };

  const handleReject = () => {
    if (selectedInvestment && rejectionReason) {
      rejectInvestment(selectedInvestment.id, rejectionReason);
      setShowRejectDialog(false);
      setSelectedInvestment(null);
      setRejectionReason('');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">
          Bekleyen Yatırımlar ({pendingInvestments.length})
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Yatırımcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingInvestments.map((investment) => (
            <motion.div
              key={investment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">{investment.userName}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(investment.amount)} USDT - {investment.country}
                </div>
                <div className="text-sm text-muted-foreground">
                  Süre: {investment.duration} - Getiri: %{investment.returnRate}
                </div>
                <div className="text-sm text-muted-foreground">
                  Başvuru: {format(new Date(investment.createdAt), 'PPp', { locale: tr })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {investment.proofOfPayment && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedInvestment(investment);
                      setShowProofDialog(true);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Dekont
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvestment(investment)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Detaylar
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-500"
                  onClick={() => {
                    setSelectedInvestment(investment);
                    setShowRejectDialog(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Onayla
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500"
                  onClick={() => {
                    setSelectedInvestment(investment);
                    setShowRejectDialog(true);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reddet
                </Button>
              </div>
            </motion.div>
          ))}

          {pendingInvestments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Bekleyen yatırım bulunmuyor.
            </div>
          )}
        </div>
      </CardContent>

      {/* Onaylama Dialog */}
      <Dialog 
        open={selectedInvestment !== null && !showRejectDialog} 
        onOpenChange={() => setSelectedInvestment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yatırım Onayı</DialogTitle>
            <DialogDescription>
              Bu yatırımı onaylamak üzeresiniz. Lütfen detayları kontrol edin.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvestment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Yatırımcı</Label>
                  <p className="font-medium">{selectedInvestment.userName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Tutar</Label>
                  <p className="font-medium">
                    {formatCurrency(selectedInvestment.amount)} USDT
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Ülke</Label>
                  <p className="font-medium">{selectedInvestment.country}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Vade</Label>
                  <p className="font-medium">{selectedInvestment.duration}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Getiri Oranı</Label>
                  <p className="font-medium">%{selectedInvestment.returnRate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Cüzdan Adresi</Label>
                  <p className="font-medium">{selectedInvestment.walletAddress}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Onay Notları</Label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Yatırım ile ilgili notlar ekleyin..."
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvestment(null)}
                >
                  İptal
                </Button>
                <Button
                  onClick={handleApprove}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Onayla
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reddetme Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yatırım Reddi</DialogTitle>
            <DialogDescription>
              Bu yatırımı reddetmek üzeresiniz. Lütfen red sebebini belirtin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Red Sebebi</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Yatırımın reddedilme sebebini açıklayın..."
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
                onClick={handleReject}
                disabled={!rejectionReason}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Reddet
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dekont Görüntüleme Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ödeme Dekontu</DialogTitle>
          </DialogHeader>
          
          {selectedInvestment?.proofOfPayment && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden border">
                <img
                  src={selectedInvestment.proofOfPayment}
                  alt="Ödeme Dekontu"
                  className="w-full h-full object-contain"
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowProofDialog(false)}
                >
                  Kapat
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}