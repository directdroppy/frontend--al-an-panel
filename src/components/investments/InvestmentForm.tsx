import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Calculator, Upload } from 'lucide-react';
import { Country, InvestmentFormData } from '@/types/investment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InvestmentFormProps {
  country: Country;
  onSubmit: (data: InvestmentFormData) => Promise<void>;
  onClose: () => void;
}

const durations = [
  { value: '3d', label: '3 Gün', rate: 1.5 },
  { value: '7d', label: '7 Gün', rate: 4 },
  { value: '15d', label: '15 Gün', rate: 9 },
  { value: '30d', label: '30 Gün', rate: 20 }
];

export function InvestmentForm({ country, onSubmit, onClose }: InvestmentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InvestmentFormData>({
    amount: country.minInvestment,
    duration: '7d',
    walletAddress: ''
  });
  const [loading, setLoading] = useState(false);

  const selectedDuration = durations.find(d => d.value === formData.duration);
  const expectedReturn = selectedDuration ? 
    (formData.amount * (country.interestRate / 100) * (parseInt(formData.duration) / 365)) +
    (formData.amount * (selectedDuration.rate / 100)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yatırım talebi gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Hata",
          description: "Dosya boyutu 5MB'dan küçük olmalıdır.",
          variant: "destructive",
        });
        return;
      }

      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        toast({
          title: "Hata",
          description: "Sadece JPG, PNG veya PDF dosyaları yükleyebilirsiniz.",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({ ...prev, proofOfPayment: file }));
      toast({
        title: "Başarılı",
        description: "Dekont başarıyla yüklendi.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Yatırım Tutarı (USDT)</Label>
          <Input
            type="number"
            min={country.minInvestment}
            max={country.maxInvestment}
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              amount: parseFloat(e.target.value) 
            }))}
            required
          />
          <p className="text-sm text-muted-foreground">
            Min: {country.minInvestment} USDT - Max: {country.maxInvestment} USDT
          </p>
        </div>

        <div className="space-y-2">
          <Label>Vade Süresi</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vade süresi seçin" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label} - %{duration.rate} ek getiri
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>USDT Cüzdan Adresi (TRC20)</Label>
          <Input
            value={formData.walletAddress}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              walletAddress: e.target.value 
            }))}
            placeholder="Örn: TWd2yzw5yFc5W8Tq6CuRRsqJxgEH2h8DBE"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Ödeme Dekontu</Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Dekont yüklemek için tıklayın</span>
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG veya PDF (max 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>

        {expectedReturn > 0 && (
          <Alert className="bg-primary/5 border-primary/10">
            <Calculator className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Yatırım Tutarı:</span>
                  <span className="font-medium">
                    {formData.amount.toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Beklenen Getiri:</span>
                  <span className="font-medium text-primary">
                    {expectedReturn.toFixed(2)} USDT
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Vade Sonunda:</span>
                    <span className="font-bold text-primary">
                      {(formData.amount + expectedReturn).toFixed(2)} USDT
                    </span>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          İptal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Yatırım Yap'}
        </Button>
      </div>
    </form>
  );
}