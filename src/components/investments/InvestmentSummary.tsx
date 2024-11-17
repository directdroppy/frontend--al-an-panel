import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, AlertCircle } from 'lucide-react';
import { Country } from '@/types/investment';
import { formatCurrency } from '@/lib/utils';

interface InvestmentSummaryProps {
  country: Country;
  formData: {
    amount: number;
    duration: string;
    clientName: string;
  };
  returns: {
    countryReturn: number;
    durationReturn: number;
    totalReturn: number;
  };
}

const durationMap = {
  '3d': '3 Gün',
  '7d': '7 Gün',
  '15d': '15 Gün',
  '30d': '30 Gün'
};

export function InvestmentSummary({ country, formData, returns }: InvestmentSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Lütfen yatırım detaylarınızı kontrol edin ve onaylayın.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Müşteri</span>
            <span className="font-medium">{formData.clientName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ülke</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{country.flag}</span>
              <span className="font-medium">{country.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Yatırım Tutarı</span>
            <span className="font-medium">{formatCurrency(formData.amount)} USDT</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Vade Süresi</span>
            <span className="font-medium">{durationMap[formData.duration]}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Yıllık Getiri Oranı</span>
            <Badge variant="secondary">%{country.interestRate}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Risk Seviyesi</span>
            <Badge variant={
              country.riskLevel === 'low' ? 'secondary' :
              country.riskLevel === 'medium' ? 'outline' :
              'destructive'
            }>
              {country.riskLevel === 'low' && 'Düşük'}
              {country.riskLevel === 'medium' && 'Orta'}
              {country.riskLevel === 'high' && 'Yüksek'}
            </Badge>
          </div>

          <div className="pt-4 border-t space-y-2">
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
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(returns.totalReturn)} USDT
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Vade Sonu Toplam:</span>
                <span className="text-xl font-bold">
                  {formatCurrency(formData.amount + returns.totalReturn)} USDT
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 p-4 bg-muted rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Yatırımınız onaylandıktan sonra getiri hesaplaması başlayacaktır.
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}