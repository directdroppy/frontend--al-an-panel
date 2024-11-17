import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSimulationStore } from '@/lib/simulationStore';
import { 
  Play, Pause, RefreshCw, Users, TrendingUp, Clock, Settings, 
  Target, UserPlus, ArrowUpRight, ArrowDownRight, Percent 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export function SimulationControls() {
  const {
    isEnabled,
    speed,
    metrics: storeMetrics,
    toggleSimulation,
    setSpeed,
    updateMetrics
  } = useSimulationStore();

  const [localSpeed, setLocalSpeed] = useState(speed);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Initialize metrics with default values
  const [manualMetrics, setManualMetrics] = useState({
    userCount: storeMetrics?.userCount?.toString() || '0',
    activeUsers: storeMetrics?.activeUsers?.toString() || '0',
    investmentRate: storeMetrics?.investmentRate?.toString() || '0',
    volatility: '5',
    totalVolume: storeMetrics?.totalVolume?.toString() || '0',
    activeInvestments: storeMetrics?.activeInvestments?.toString() || '0',
    monthlyGrowth: storeMetrics?.monthlyGrowth?.toString() || '0',
    totalReferrals: storeMetrics?.totalReferrals?.toString() || '0',
    activeReferrals: storeMetrics?.activeReferrals?.toString() || '0',
    referralRate: storeMetrics?.referralRate?.toString() || '0',
    conversionRate: storeMetrics?.conversionRate?.toString() || '0',
    averageInvestment: storeMetrics?.averageInvestment?.toString() || '0',
    dailyTransactions: storeMetrics?.dailyTransactions?.toString() || '0',
    successRate: storeMetrics?.successRate?.toString() || '0'
  });

  // Update manualMetrics when store metrics change
  useEffect(() => {
    if (storeMetrics) {
      setManualMetrics(prev => ({
        ...prev,
        userCount: storeMetrics.userCount?.toString() || prev.userCount,
        activeUsers: storeMetrics.activeUsers?.toString() || prev.activeUsers,
        investmentRate: storeMetrics.investmentRate?.toString() || prev.investmentRate,
        totalVolume: storeMetrics.totalVolume?.toString() || prev.totalVolume,
        activeInvestments: storeMetrics.activeInvestments?.toString() || prev.activeInvestments,
        monthlyGrowth: storeMetrics.monthlyGrowth?.toString() || prev.monthlyGrowth,
        totalReferrals: storeMetrics.totalReferrals?.toString() || prev.totalReferrals,
        activeReferrals: storeMetrics.activeReferrals?.toString() || prev.activeReferrals,
        referralRate: storeMetrics.referralRate?.toString() || prev.referralRate,
        conversionRate: storeMetrics.conversionRate?.toString() || prev.conversionRate,
        averageInvestment: storeMetrics.averageInvestment?.toString() || prev.averageInvestment,
        dailyTransactions: storeMetrics.dailyTransactions?.toString() || prev.dailyTransactions,
        successRate: storeMetrics.successRate?.toString() || prev.successRate
      }));
    }
  }, [storeMetrics]);

  // Handle auto-adjustment simulation
  useEffect(() => {
    if (!autoAdjust || !isEnabled) return;

    const interval = setInterval(() => {
      const volatility = parseFloat(manualMetrics.volatility);
      const baseInvestmentRate = parseFloat(manualMetrics.investmentRate);
      const randomFactor = (Math.random() * 2 - 1) * volatility;
      const adjustedRate = baseInvestmentRate + randomFactor;

      const updates = {
        investmentRate: Math.max(0, adjustedRate),
        monthlyGrowth: adjustedRate * 0.8,
        totalVolume: parseFloat(manualMetrics.totalVolume) * (1 + (randomFactor / 100)),
        activeInvestments: Math.floor(parseFloat(manualMetrics.userCount) * (adjustedRate / 100)),
        activeUsers: Math.floor(parseFloat(manualMetrics.userCount) * 0.8),
        referralRate: Math.max(0, parseFloat(manualMetrics.referralRate) + (randomFactor * 0.5)),
        conversionRate: Math.min(100, Math.max(0, parseFloat(manualMetrics.conversionRate) + (randomFactor * 0.3))),
        dailyTransactions: Math.max(0, Math.floor(parseFloat(manualMetrics.dailyTransactions) * (1 + (randomFactor / 200)))),
        successRate: Math.min(100, Math.max(0, parseFloat(manualMetrics.successRate) + (randomFactor * 0.1)))
      };

      updateMetrics(updates);
    }, 3000 / speed);

    return () => clearInterval(interval);
  }, [isEnabled, speed, autoAdjust, manualMetrics]);

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setLocalSpeed(newSpeed);
    setSpeed(newSpeed);
  };

  const handleMetricChange = (key: string, value: string) => {
    if (!autoAdjust) {
      setManualMetrics(prev => ({ ...prev, [key]: value }));
      
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        updateMetrics({ [key]: numValue });
      }
    }
  };

  const handleManualUpdate = () => {
    if (!autoAdjust) {
      const updates: Record<string, number> = {};
      
      Object.entries(manualMetrics).forEach(([key, value]) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          updates[key] = numValue;
        }
      });

      updateMetrics(updates);
      
      toast({
        title: "Değerler Güncellendi",
        description: "Manuel değerler başarıyla uygulandı."
      });
    }
  };

  const quickStats = [
    {
      title: 'Aktif Kullanıcılar',
      value: parseInt(manualMetrics.userCount) || 0,
      icon: Users,
      secondaryValue: `${Math.round(((parseInt(manualMetrics.activeUsers) || 0) / (parseInt(manualMetrics.userCount) || 1)) * 100)}% aktif`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Yatırım Oranı',
      value: `%${parseFloat(manualMetrics.investmentRate).toFixed(1)}`,
      icon: TrendingUp,
      secondaryValue: `${manualMetrics.activeInvestments} aktif yatırım`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Simülasyon Hızı',
      value: `${speed}x`,
      icon: Clock,
      secondaryValue: 'Gerçek zamanlı',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const metricInputs = [
    { key: 'userCount', label: 'Toplam Kullanıcı', min: '1', max: '10000' },
    { key: 'activeUsers', label: 'Aktif Kullanıcı', min: '0' },
    { key: 'investmentRate', label: 'Yatırım Oranı (%)', min: '0', max: '100' },
    { key: 'volatility', label: 'Volatilite (%)', min: '0', max: '100' },
    { key: 'totalVolume', label: 'Toplam Hacim (USDT)', min: '0' },
    { key: 'activeInvestments', label: 'Aktif Yatırımlar', min: '0' },
    { key: 'monthlyGrowth', label: 'Aylık Büyüme (%)', min: '-100', max: '100' },
    { key: 'totalReferrals', label: 'Toplam Referanslar', min: '0' },
    { key: 'activeReferrals', label: 'Aktif Referanslar', min: '0' },
    { key: 'referralRate', label: 'Referans Oranı (%)', min: '0', max: '100' },
    { key: 'conversionRate', label: 'Dönüşüm Oranı (%)', min: '0', max: '100' },
    { key: 'averageInvestment', label: 'Ortalama Yatırım (USDT)', min: '0' },
    { key: 'dailyTransactions', label: 'Günlük İşlem', min: '0' },
    { key: 'successRate', label: 'Başarı Oranı (%)', min: '0', max: '100' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Simülasyon Kontrol Paneli</span>
          <motion.div
            animate={{ scale: isEnabled ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1, repeat: isEnabled ? Infinity : 0 }}
            className={cn(
              "px-2 py-1 rounded-full text-sm",
              isEnabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            {isEnabled ? 'Aktif' : 'Pasif'}
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <div>
                      <span className="text-sm font-medium">{stat.title}</span>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.secondaryValue}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="settings">Detaylı Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Otomatik Ayarlama</Label>
              <Switch
                checked={autoAdjust}
                onCheckedChange={setAutoAdjust}
              />
            </div>

            <div className="space-y-2">
              <Label>Simülasyon Hızı ({localSpeed}x)</Label>
              <Slider
                value={[localSpeed]}
                min={0.5}
                max={5}
                step={0.5}
                onValueChange={handleSpeedChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kullanıcı Sayısı</Label>
                <Input
                  type="number"
                  value={manualMetrics.userCount}
                  onChange={(e) => handleMetricChange('userCount', e.target.value)}
                  min="1"
                  max="10000"
                  disabled={autoAdjust}
                />
              </div>

              <div className="space-y-2">
                <Label>Yatırım Oranı (%)</Label>
                <Input
                  type="number"
                  value={manualMetrics.investmentRate}
                  onChange={(e) => handleMetricChange('investmentRate', e.target.value)}
                  min="0"
                  max="100"
                  disabled={autoAdjust}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Aktif Yatırımlar</span>
                <span>{manualMetrics.activeInvestments}</span>
              </div>
              <Progress value={(parseInt(manualMetrics.activeInvestments) / parseInt(manualMetrics.userCount)) * 100} />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dönüşüm Oranı</span>
                <span>%{parseFloat(manualMetrics.conversionRate).toFixed(1)}</span>
              </div>
              <Progress value={parseFloat(manualMetrics.conversionRate)} />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Başarı Oranı</span>
                <span>%{parseFloat(manualMetrics.successRate).toFixed(1)}</span>
              </div>
              <Progress value={parseFloat(manualMetrics.successRate)} />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metricInputs.map((input) => (
                <div key={input.key} className="space-y-2">
                  <Label>{input.label}</Label>
                  <Input
                    type="number"
                    value={manualMetrics[input.key as keyof typeof manualMetrics]}
                    onChange={(e) => handleMetricChange(input.key, e.target.value)}
                    min={input.min}
                    max={input.max}
                    disabled={autoAdjust}
                  />
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={handleManualUpdate}
              disabled={autoAdjust}
            >
              <Settings className="w-4 h-4 mr-2" />
              Değerleri Uygula
            </Button>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Toplam Hacim:</span>
            <span>{formatCurrency(parseFloat(manualMetrics.totalVolume))} USDT</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Günlük İşlem:</span>
            <span>{manualMetrics.dailyTransactions}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Son Güncelleme:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant={isEnabled ? "default" : "outline"}
            onClick={toggleSimulation}
            className={cn(
              "gap-2",
              !isEnabled && "text-yellow-500 hover:text-yellow-600"
            )}
          >
            {isEnabled ? (
              <>
                <Pause className="h-4 w-4" />
                Duraklat
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Başlat
              </>
            )}
          </Button>

          <motion.div
            animate={{ rotate: isEnabled ? 360 : 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}