import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/lib/adminStore';
import { useToast } from '@/components/ui/use-toast';
import { Wallet, QrCode, Save } from 'lucide-react';

export function PaymentSettings() {
  const { paymentDetails, updatePaymentDetails } = useAdminStore();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState(paymentDetails.walletAddress);
  const [qrFile, setQrFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: any = { walletAddress };

    if (qrFile) {
      // QR kodu base64'e çevir
      const reader = new FileReader();
      reader.readAsDataURL(qrFile);
      reader.onload = () => {
        updatePaymentDetails({
          ...updates,
          qrCode: reader.result as string
        });
      };
    } else {
      updatePaymentDetails(updates);
    }

    toast({
      title: "Başarılı",
      description: "Ödeme detayları güncellendi.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ödeme Ayarları</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>USDT Cüzdan Adresi (TRC20)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="pl-10"
                  placeholder="TRC20 cüzdan adresi"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>QR Kod</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                />
              </div>
              {paymentDetails.qrCode && (
                <img
                  src={paymentDetails.qrCode}
                  alt="Current QR Code"
                  className="w-16 h-16 rounded border"
                />
              )}
            </div>
          </div>

          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}