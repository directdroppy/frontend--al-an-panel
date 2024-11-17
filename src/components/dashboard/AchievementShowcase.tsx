import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  icon: any;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: 1,
    title: 'Yatırım Uzmanı',
    description: '₺1M değerinde yatırım yönetimi',
    progress: 75,
    icon: Award,
    color: 'from-blue-500 to-blue-600',
    rarity: 'epic',
    points: 1000,
    unlocked: false
  },
  {
    id: 2,
    title: 'Referans Kralı',
    description: '50 başarılı referans',
    progress: 60,
    icon: Star,
    color: 'from-amber-500 to-amber-600',
    rarity: 'rare',
    points: 800,
    unlocked: false
  },
  {
    id: 3,
    title: 'Hedef Avcısı',
    description: '12 ay üst üste hedef tutturma',
    progress: 90,
    icon: Target,
    color: 'from-green-500 to-green-600',
    rarity: 'legendary',
    points: 1200,
    unlocked: false
  },
  {
    id: 4,
    title: 'Performans Yıldızı',
    description: '%20 üzeri ortalama getiri',
    progress: 45,
    icon: Trophy,
    color: 'from-purple-500 to-purple-600',
    rarity: 'common',
    points: 500,
    unlocked: false
  }
];

const rarityConfig = {
  common: {
    border: 'border-slate-400',
    glow: 'shadow-slate-500/20',
    badge: 'bg-slate-500'
  },
  rare: {
    border: 'border-blue-400',
    glow: 'shadow-blue-500/20',
    badge: 'bg-blue-500'
  },
  epic: {
    border: 'border-purple-400',
    glow: 'shadow-purple-500/20',
    badge: 'bg-purple-500'
  },
  legendary: {
    border: 'border-amber-400',
    glow: 'shadow-amber-500/20',
    badge: 'bg-amber-500'
  }
};

export function AchievementShowcase() {
  const [achievementList, setAchievementList] = useState(achievements);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAchievementList(prev => {
        const newList = prev.map(achievement => ({
          ...achievement,
          progress: Math.min(100, achievement.progress + (Math.random() > 0.7 ? Math.random() * 5 : 0))
        }));

        // Başarı açma kontrolü
        const unlockedNow = newList.find(a => !a.unlocked && a.progress >= 100);
        if (unlockedNow) {
          setRecentlyUnlocked(unlockedNow.id);
          setTimeout(() => setRecentlyUnlocked(null), 3000);
          return newList.map(a => a.id === unlockedNow.id ? { ...a, unlocked: true } : a);
        }

        return newList;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence>
        {achievementList.map((achievement, index) => {
          const Icon = achievement.icon;
          const isRecent = recentlyUnlocked === achievement.id;
          const config = rarityConfig[achievement.rarity];

          return (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isRecent ? 1.05 : 1,
                y: isRecent ? -10 : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className={cn(
                "overflow-hidden transition-all duration-300 group",
                achievement.unlocked && `${config.border} ${config.glow}`,
                isRecent && "ring-2 ring-primary"
              )}>
                <CardHeader className="relative">
                  {/* Parıltı Efekti */}
                  {achievement.unlocked && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                      animate={{
                        x: [-500, 500],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 5
                      }}
                    />
                  )}

                  <div className="flex items-center gap-3 z-10">
                    <motion.div
                      className={cn(
                        "p-2 rounded-lg",
                        `bg-gradient-to-r ${achievement.color} opacity-10`
                      )}
                      animate={isRecent ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={cn(
                        "w-5 h-5",
                        `text-gradient-to-r ${achievement.color}`
                      )} />
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full text-white",
                          config.badge
                        )}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>

                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">İlerleme</span>
                      <span className="font-medium">{Math.floor(achievement.progress)}%</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={achievement.progress} 
                        className={cn(
                          "h-2",
                          isRecent && "animate-pulse"
                        )}
                      />
                      {isRecent && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <motion.div
                        animate={isRecent ? {
                          scale: [1, 1.2, 1],
                          color: ['#000', '#FFD700', '#000']
                        } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-sm font-medium text-primary"
                      >
                        {achievement.points} XP
                      </motion.div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs text-emerald-500 font-medium"
                        >
                          Kazanıldı! 🎉
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}