import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminStore } from '@/lib/adminStore';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface PaymentDetailsProps {
  amount: number;
}

export function PaymentDetails({ amount }: PaymentDetailsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { paymentDetails } = useAdminStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentDetails.walletAddress);
    setCopied(true);
    toast({
      title: "Kopyalandı",
      description: "Cüzdan adresi panoya kopyalandı.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Lütfen tam olarak <span className="font-bold">{amount} USDT</span> gönderiniz. 
          Farklı tutarlar işleme alınmayacaktır.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {paymentDetails.qrCode && (
              <img
                src={paymentDetails.qrCode}
                alt="USDT Wallet QR Code"
                className="w-48 h-48 rounded-lg border p-2"
              />
            )}
            
            <div className="w-full space-y-2">
              <div className="text-sm text-muted-foreground">
                USDT Cüzdan Adresi (TRC20)
              </div>
              <div className="flex gap-2">
                <code className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
                  {paymentDetails.walletAddress}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="w-full space-y-4 pt-4 border-t">
              <div className="text-sm font-medium">Ödeme Talimatları:</div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>1. Yukarıdaki QR kodu okutun veya cüzdan adresini kopyalayın</p>
                <p>2. TRC20 ağını kullanarak tam olarak {amount} USDT gönderin</p>
                <p>3. İşlem onayı için 12 blok onayı bekleyin (yaklaşık 5-15 dakika)</p>
                <p>4. Ödeme onaylandıktan sonra yatırımınız aktif olacaktır</p>
              </div>
            </div>

            <div className="w-full pt-4 border-t">
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Önemli: Sadece TRC20 ağını kullanın. Diğer ağlar üzerinden yapılan transferler kaybolabilir.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}