import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, Eye, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAdminStore } from '@/lib/adminStore';

export function InvestmentApprovalProcess() {
  const { investments, approveInvestment, rejectInvestment } = useAdminStore();
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showProofDialog, setShowProofDialog] = useState(false);
  const { toast } = useToast();

  const pendingInvestments = investments.filter(inv => inv.status === 'pending');

  const handleApprove = (investment: any) => {
    approveInvestment(investment.id, 'admin1', 'Admin', 'Yatırım onaylandı');
    setSelectedInvestment(null);
  };

  const handleReject = (investment: any, reason: string) => {
    rejectInvestment(investment.id, 'admin1', 'Admin', reason);
    setShowRejectDialog(false);
    setSelectedInvestment(null);
    setRejectionReason('');
  };

  const riskLevelStyles = {
    low: 'bg-green-500/10 text-green-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    high: 'bg-red-500/10 text-red-500'
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {pendingInvestments.map((investment, index) => (
          <motion.div
            key={investment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{investment.userName}</h3>
                      <Badge className={riskLevelStyles[investment.riskLevel]}>
                        {investment.riskLevel === 'low' && 'Düşük Risk'}
                        {investment.riskLevel === 'medium' && 'Orta Risk'}
                        {investment.riskLevel === 'high' && 'Yüksek Risk'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {investment.country} • {investment.duration} • %{investment.returnRate} Getiri
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Başvuru: {format(new Date(investment.createdAt), 'PPp', { locale: tr })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {investment.amount.toLocaleString('en-US')} USDT
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {investment.walletAddress?.slice(0, 6)}...{investment.walletAddress?.slice(-6)}
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
                        onClick={() => handleApprove(investment)}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

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
                onClick={() => selectedInvestment && handleReject(selectedInvestment, rejectionReason)}
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

      {/* Detay Dialog */}
      <Dialog 
        open={selectedInvestment !== null && !showRejectDialog && !showProofDialog} 
        onOpenChange={() => setSelectedInvestment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yatırım Detayları</DialogTitle>
          </DialogHeader>
          
          {selectedInvestment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Kullanıcı</Label>
                  <p className="font-medium">{selectedInvestment.userName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Tutar</Label>
                  <p className="font-medium">
                    {selectedInvestment.amount.toLocaleString('en-US')} USDT
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
                  <Label className="text-sm text-muted-foreground">Risk Seviyesi</Label>
                  <Badge className={riskLevelStyles[selectedInvestment.riskLevel]}>
                    {selectedInvestment.riskLevel === 'low' && 'Düşük Risk'}
                    {selectedInvestment.riskLevel === 'medium' && 'Orta Risk'}
                    {selectedInvestment.riskLevel === 'high' && 'Yüksek Risk'}
                  </Badge>
                </div>
              </div>

              {selectedInvestment.walletAddress && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Cüzdan Adresi</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-muted rounded-md">
                      {selectedInvestment.walletAddress}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedInvestment.walletAddress);
                        toast({
                          title: 'Kopyalandı',
                          description: 'Cüzdan adresi panoya kopyalandı.'
                        });
                      }}
                    >
                      Kopyala
                    </Button>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvestment(null)}
                >
                  Kapat
                </Button>
              </DialogFooter>
            </div>
          )}
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
    </div>
  );
}