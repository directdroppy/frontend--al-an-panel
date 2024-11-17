import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const achievements = [
  {
    id: 1,
    title: 'Yatırım Uzmanı',
    description: '₺1M değerinde yatırım yönetimi',
    progress: 75,
    icon: Award,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Referans Kralı',
    description: '50 başarılı referans',
    progress: 60,
    icon: Star,
    color: 'from-amber-500 to-amber-600'
  },
  {
    id: 3,
    title: 'Hedef Avcısı',
    description: '12 ay üst üste hedef tutturma',
    progress: 90,
    icon: Target,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    title: 'Performans Yıldızı',
    description: '%20 üzeri ortalama getiri',
    progress: 45,
    icon: Trophy,
    color: 'from-purple-500 to-purple-600'
  }
];

export function AchievementsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {achievements.map((achievement, index) => {
        const Icon = achievement.icon;
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors duration-300",
                    `bg-gradient-to-r ${achievement.color} opacity-10 group-hover:opacity-20`
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      `text-gradient-to-r ${achievement.color}`
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{achievement.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">İlerleme</span>
                    <span className="font-medium">{achievement.progress}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}