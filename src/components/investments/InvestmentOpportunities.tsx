import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, TrendingUp, Clock, Shield, Info } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { useSimulationStore } from '@/lib/simulationStore';
import { useInvestmentStore } from '@/lib/investmentStore';
import { formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InvestmentSteps } from './InvestmentSteps';
import { countries } from '@/data/countries';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/lib/auth';

export function InvestmentOpportunities() {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showInvestmentDialog, setShowInvestmentDialog] = useState(false);
  const { metrics } = useAdminStore();
  const { isEnabled: simulationEnabled } = useSimulationStore();
  const { addInvestment } = useInvestmentStore();
  const { toast } = useToast();

  // Admin panelinden gelen metrikler
  const [investmentStats, setInvestmentStats] = useState({
    totalInvestments: metrics?.totalInvestments || 0,
    activeInvestments: metrics?.activeInvestments || 0,
    averageReturn: metrics?.monthlyGrowth || 0,
    successRate: metrics?.successfulInvestments ? 
      (metrics.successfulInvestments / metrics.totalInvestments) * 100 : 95.5
  });

  // Metrikleri güncelle
  useEffect(() => {
    if (metrics) {
      setInvestmentStats({
        totalInvestments: metrics.totalInvestments || 0,
        activeInvestments: metrics.activeInvestments || 0,
        averageReturn: metrics.monthlyGrowth || 0,
        successRate: metrics.successfulInvestments ? 
          (metrics.successfulInvestments / metrics.totalInvestments) * 100 : 95.5
      });
    }
  }, [metrics]);

  // Yatırım işlemi
  const handleInvestment = async (formData) => {
    try {
      const investment = {
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user?.id,
        userName: user?.name
      };

      await addInvestment(investment);
      
      toast({
        title: "Yatırım talebi gönderildi",
        description: "Yatırımınız incelemeye alındı. Onay durumunu yatırımlarım sayfasından takip edebilirsiniz.",
      });

      setShowInvestmentDialog(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yatırım talebi gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Yatırım İstatistikleri */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Yatırım İstatistikleri</CardTitle>
            {simulationEnabled && (
              <Badge variant="secondary" className="animate-pulse">
                Canlı Veriler
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                Toplam Yatırım
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(investmentStats.totalInvestments)} USDT
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                Aktif Yatırımlar
              </div>
              <div className="text-2xl font-bold">
                {investmentStats.activeInvestments}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                Ortalama Getiri
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                %{investmentStats.averageReturn.toFixed(1)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Shield className="h-4 w-4" />
                Başarı Oranı
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                %{investmentStats.successRate.toFixed(1)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ülke Seçenekleri */}
      <Card>
        <CardHeader>
          <CardTitle>Güncel Yatırım Fırsatları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country, index) => {
              const expectedReturn = (country.interestRate / 100) * 100000;
              const occupancyRate = metrics?.countryStats?.[country.code]?.occupancyRate || 
                Math.floor(Math.random() * 30) + 70;
              
              return (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">{country.flag}</div>
                        <div>
                          <h3 className="font-medium">{country.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-emerald-500 font-medium">
                              %{country.interestRate} yıllık
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>100,000 USDT yatırım için yıllık<br />
                                  {formatCurrency(expectedReturn)} USDT beklenen getiri</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Minimum Yatırım</span>
                          <span>{formatCurrency(country.minInvestment)} USDT</span>
                        </div>

                        <div className="flex justify-between text-sm">
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

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Doluluk Oranı</span>
                            <span>%{occupancyRate}</span>
                          </div>
                          <Progress value={occupancyRate} className="h-1" />
                        </div>

                        <Button 
                          className="w-full gap-2 group-hover:gap-4 transition-all"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowInvestmentDialog(true);
                          }}
                        >
                          Yatırım Yap
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Yatırım Adımları Dialog */}
      <Dialog 
        open={showInvestmentDialog} 
        onOpenChange={setShowInvestmentDialog}
      >
        <DialogContent className="max-w-2xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCountry ? `${selectedCountry.name} - Yeni Yatırım` : 'Yeni Yatırım'}
            </DialogTitle>
          </DialogHeader>
          {selectedCountry && (
            <InvestmentSteps
              country={selectedCountry}
              onSubmit={handleInvestment}
              onClose={() => setShowInvestmentDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}