import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CompletedInvestment {
  id: string;
  username: string;
  amount: number;
  country: string;
  duration: string;
  startDate: string;
  endDate: string;
  returnRate: number;
  earnedAmount: number;
  status: 'completed' | 'cancelled';
}

const mockCompletedInvestments: CompletedInvestment[] = [
  {
    id: '1',
    username: 'ahmet123',
    amount: 1000,
    country: '🇹🇷 Türkiye',
    duration: '15 Gün',
    startDate: '2024-02-25',
    endDate: '2024-03-12',
    returnRate: 44.4,
    earnedAmount: 444,
    status: 'completed'
  },
  // ... daha fazla örnek veri
];

export function CompletedInvestments() {
  const [investments, setInvestments] = useState(mockCompletedInvestments);
  const [selectedInvestment, setSelectedInvestment] = useState<CompletedInvestment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {investments.map((investment) => (
          <motion.div
            key={investment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{investment.username}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{investment.country}</span>
                      <span>•</span>
                      <span>{investment.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(investment.amount)} USDT
                      </div>
                      <div className="text-sm text-emerald-500">
                        +{formatCurrency(investment.earnedAmount)} USDT kazanç
                      </div>
                    </div>

                    <Badge
                      variant={investment.status === 'completed' ? 'default' : 'destructive'}
                      className="ml-2"
                    >
                      {investment.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedInvestment(investment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {investments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tamamlanan yatırım bulunmuyor.
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedInvestment}
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
                  <label className="text-sm text-muted-foreground">Kullanıcı</label>
                  <p className="font-medium">{selectedInvestment.username}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tutar</label>
                  <p className="font-medium">
                    {formatCurrency(selectedInvestment.amount)} USDT
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Başlangıç</label>
                  <p className="font-medium">
                    {new Date(selectedInvestment.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Bitiş</label>
                  <p className="font-medium">
                    {new Date(selectedInvestment.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Getiri Bilgileri</label>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Getiri Oranı:</span>
                    <span className="font-medium">%{selectedInvestment.returnRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kazanılan:</span>
                    <span className="font-medium text-emerald-500">
                      {formatCurrency(selectedInvestment.earnedAmount)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam Değer:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedInvestment.amount + selectedInvestment.earnedAmount)} USDT
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvestment(null)}
                >
                  Kapat
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}