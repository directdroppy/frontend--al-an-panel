import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Steps } from '@/components/ui/steps';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Country } from '@/types/investment';
import { PaymentDetails } from './PaymentDetails';
import { InvestmentSummary } from './InvestmentSummary';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface InvestmentStepsProps {
  country: Country;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

const durationOptions = [
  { value: '3d', label: '3 Gün', days: 3, rate: 8.9 },
  { value: '7d', label: '7 Gün', rate: 20.7, days: 7 },
  { value: '15d', label: '15 Gün', rate: 44.4, days: 15 },
  { value: '30d', label: '30 Gün', rate: 59.3, days: 30 }
];

export function InvestmentSteps({ country, onSubmit, onClose }: InvestmentStepsProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    clientName: '',
    amount: country.minInvestment,
    duration: '7d',
  });

  const [returns, setReturns] = useState({
    countryReturn: 0,
    durationReturn: 0,
    totalReturn: 0
  });

  // Getiri hesaplama
  useEffect(() => {
    const selectedDuration = durationOptions.find(d => d.value === formData.duration);
    if (!selectedDuration) return;

    // Ülke faizi getirisi (yıllık faiz oranını günlük faize çevirip süreyle çarpıyoruz)
    const dailyCountryRate = country.interestRate / 365;
    const countryReturn = formData.amount * (dailyCountryRate * selectedDuration.days) / 100;

    // Vade süresine özel ek getiri
    const durationReturn = formData.amount * (selectedDuration.rate / 100);

    // Toplam getiri
    const totalReturn = countryReturn + durationReturn;

    setReturns({
      countryReturn,
      durationReturn,
      totalReturn
    });
  }, [formData.amount, formData.duration, country.interestRate]);

  const steps = [
    {
      title: 'Müşteri Bilgileri',
      description: 'Yatırımcı bilgileri ve tutar'
    },
    {
      title: 'Ödeme Talimatları',
      description: 'Ödeme detayları ve talimatlar'
    },
    {
      title: 'Onay',
      description: 'Yatırım özeti ve onay'
    }
  ];

  const handleNext = () => {
    if (currentStep === 0 && !formData.clientName) {
      toast({
        title: "Hata",
        description: "Lütfen müşteri adını girin",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    await onSubmit({
      ...formData,
      returns
    });
  };

  return (
    <div className="space-y-6">
      <Steps 
        steps={steps} 
        currentStep={currentStep} 
        className="mb-8"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Müşteri Adı</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    clientName: e.target.value 
                  }))}
                  placeholder="Müşteri adı ve soyadı"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Yatırım Tutarı (USDT)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    amount: parseFloat(e.target.value) 
                  }))}
                  min={country.minInvestment}
                  max={country.maxInvestment}
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
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    duration: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vade süresi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} - %{option.rate} ek getiri
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Anlık Getiri Hesaplama */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ülke Getirisi:</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(returns.countryReturn)} USDT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vade Getirisi:</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(returns.durationReturn)} USDT
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">Toplam Getiri:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(returns.totalReturn)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-muted-foreground">Vade Sonu Toplam:</span>
                        <span className="font-bold">
                          {formatCurrency(formData.amount + returns.totalReturn)} USDT
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 1 && (
            <PaymentDetails
              amount={formData.amount}
            />
          )}

          {currentStep === 2 && (
            <InvestmentSummary
              country={country}
              formData={formData}
              returns={returns}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end gap-4 mt-8">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Geri
          </Button>
        )}

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>
            İleri
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Yatırımı Tamamla
          </Button>
        )}
      </div>
    </div>
  );
}