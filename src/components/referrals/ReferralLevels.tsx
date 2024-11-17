import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Target, Trophy, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferralLevelsProps {
  currentLevel: number;
  totalReferrals: number;
}

const levels = [
  {
    id: 1,
    name: 'Başlangıç',
    icon: Star,
    threshold: 5,
    commission: 3,
    color: 'from-zinc-500 to-zinc-600',
    rewards: {
      bonus: 100,
      features: ['%10 Komisyon', 'Temel Özellikler']
    }
  },
  {
    id: 2,
    name: 'Bronz',
    icon: Target,
    threshold: 15,
    commission: 4,
    color: 'from-amber-500 to-amber-600',
    rewards: {
      bonus: 500,
      features: ['%15 Komisyon', 'Öncelikli Destek', 'Aylık Rapor']
    }
  },
  {
    id: 3,
    name: 'Gümüş',
    icon: Trophy,
    threshold: 30,
    commission: 6,
    color: 'from-slate-400 to-slate-500',
    rewards: {
      bonus: 1500,
      features: ['%20 Komisyon', '7/24 Destek', 'Özel Danışman']
    }
  },
  {
    id: 4,
    name: 'Altın',
    icon: Award,
    threshold: 50,
    commission: 10,
    color: 'from-yellow-500 to-yellow-600',
    rewards: {
      bonus: 5000,
      features: ['%25 Komisyon', 'VIP Destek', 'Özel Etkinlikler', 'Yıllık Bonus']
    }
  }
];

export function ReferralLevels({ currentLevel, totalReferrals }: ReferralLevelsProps) {
  return (
    <div className="space-y-6">
      {levels.map((level, index) => {
        const Icon = level.icon;
        const isCurrentLevel = currentLevel === level.id;
        const isCompleted = totalReferrals >= level.threshold;
        const progress = Math.min(100, (totalReferrals / level.threshold) * 100);

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "relative overflow-hidden transition-all duration-300",
              isCurrentLevel && "ring-2 ring-primary"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg",
                    `bg-gradient-to-br ${level.color} opacity-10`
                  )}>
                    <Icon className={cn(
                      "w-6 h-6",
                      `text-gradient-to-br ${level.color}`
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{level.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {level.threshold} referans gerekli
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">
                          %{level.commission} Komisyon
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {level.rewards.bonus} USDT Bonus
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">İlerleme</span>
                        <span>{Math.floor(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {level.rewards.features.map((feature, i) => (
                        <span
                          key={i}
                          className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            isCompleted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {isCompleted && (
                  <div className="absolute top-2 right-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-emerald-500"
                    >
                      ✓
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}