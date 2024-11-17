import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: 'investment' | 'user' | 'system';
  action: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
  metadata?: {
    amount?: number;
    username?: string;
    country?: string;
  };
}

const generateRandomActivity = (): Activity => {
  const types = ['investment', 'user', 'system'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  
  const activities = {
    investment: {
      actions: ['Yeni Yatırım', 'Yatırım Onayı', 'Yatırım İptali'],
      descriptions: ['yatırım talebi oluşturuldu', 'yatırımı onaylandı', 'yatırımı iptal edildi']
    },
    user: {
      actions: ['Yeni Kullanıcı', 'Kullanıcı Girişi', 'Profil Güncelleme'],
      descriptions: ['sisteme katıldı', 'giriş yaptı', 'profilini güncelledi']
    },
    system: {
      actions: ['Sistem Güncellemesi', 'Performans İyileştirmesi', 'Güvenlik Kontrolü'],
      descriptions: ['tamamlandı', 'başarıyla uygulandı', 'gerçekleştirildi']
    }
  };

  const actionIndex = Math.floor(Math.random() * 3);
  const action = activities[type].actions[actionIndex];
  const description = activities[type].descriptions[actionIndex];

  return {
    id: Date.now().toString(),
    type,
    action,
    description,
    timestamp: new Date().toISOString(),
    status: ['success', 'warning', 'error'][Math.floor(Math.random() * 3)] as 'success' | 'warning' | 'error',
    metadata: type === 'investment' ? {
      amount: Math.floor(Math.random() * 10000) + 1000,
      username: `user${Math.floor(Math.random() * 1000)}`,
      country: ['🇹🇷 Türkiye', '🇺🇸 ABD', '🇬🇧 İngiltere'][Math.floor(Math.random() * 3)]
    } : undefined
  };
};

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // İlk yükleme için aktiviteler
    setActivities(Array.from({ length: 5 }, generateRandomActivity));

    // Her 3-7 saniyede bir yeni aktivite ekle
    const interval = setInterval(() => {
      setActivities(prev => [generateRandomActivity(), ...prev.slice(0, 9)]);
    }, Math.random() * 4000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Son Aktiviteler</span>
          <Badge variant="outline" className="animate-pulse">
            Canlı
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-lg border bg-card/50"
                >
                  <div className="flex gap-3">
                    <ActivityIcon activity={activity} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{activity.action}</p>
                        <time className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.metadata?.username && `@${activity.metadata.username} `}
                        {activity.description}
                      </p>
                      {activity.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {activity.metadata.amount && (
                            <Badge variant="secondary">
                              {formatCurrency(activity.metadata.amount)} USDT
                            </Badge>
                          )}
                          {activity.metadata.country && (
                            <Badge variant="secondary">
                              {activity.metadata.country}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ActivityIcon({ activity }: { activity: Activity }) {
  const iconProps = {
    className: cn(
      "w-5 h-5",
      activity.type === 'investment' && "text-blue-500",
      activity.type === 'user' && "text-green-500",
      activity.type === 'system' && "text-yellow-500"
    )
  };

  switch (activity.type) {
    case 'investment':
      return <TrendingUp {...iconProps} />;
    case 'user':
      return <Users {...iconProps} />;
    case 'system':
      return <AlertCircle {...iconProps} />;
    default:
      return null;
  }
}