import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Gift, Plane, Users, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const milestones = [
  {
    id: 1,
    title: 'Başlangıç Yıldızı',
    description: 'İlk referansını getir',
    target: 1,
    reward: '100 USDT + %10 Komisyon',
    icon: Star,
    color: 'from-blue-500 to-blue-600',
    achieved: false,
    progress: 0
  },
  {
    id: 2,
    title: 'Yükselen Yıldız',
    description: '5 aktif referans',
    target: 5,
    reward: '500 USDT + %15 Komisyon',
    icon: Trophy,
    color: 'from-green-500 to-green-600',
    achieved: false,
    progress: 0
  },
  {
    id: 3,
    title: 'Altın Yıldız',
    description: '15 aktif referans',
    target: 15,
    reward: '1500 USDT + %20 Komisyon',
    icon: Crown,
    color: 'from-yellow-500 to-yellow-600',
    achieved: false,
    progress: 0
  },
  {
    id: 4,
    title: 'Tatil Ödülü',
    description: '30,000 USDT toplam yatırım',
    target: 30000,
    reward: 'Lüks Tatil Paketi + %25 Komisyon',
    icon: Plane,
    color: 'from-purple-500 to-purple-600',
    achieved: false,
    progress: 0
  }
];

export function ReferralRewards() {
  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Referans Ödülleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Aktif Referanslar</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Users className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Toplam Yatırım</p>
                      <p className="text-2xl font-bold">0 USDT</p>
                    </div>
                    <Trophy className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          `bg-gradient-to-r ${milestone.color} opacity-10`
                        )}>
                          <milestone.icon className={cn(
                            "w-5 h-5",
                            `text-gradient-to-r ${milestone.color}`
                          )} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{milestone.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">İlerleme</span>
                              <span>0%</span>
                            </div>
                            <Progress value={0} className="h-2" />
                          </div>

                          <div className="mt-2">
                            <span className="text-sm font-medium text-primary">
                              {milestone.reward}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}