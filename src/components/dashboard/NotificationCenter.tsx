import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, TrendingUp, Users, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { eventBus } from '@/lib/eventBus';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'investment' | 'achievement' | 'referral';
  read: boolean;
}

const typeConfig = {
  investment: {
    icon: TrendingUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  achievement: {
    icon: Trophy,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  referral: {
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  }
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Event dinleyicileri
    const handleInvestmentUpdate = (data: any) => {
      addNotification({
        title: 'Yatırım Güncellemesi',
        message: `${data.amount} USDT değerinde yatırım ${data.status}`,
        type: 'investment'
      });
    };

    const handleReferralUpdate = (data: any) => {
      addNotification({
        title: 'Yeni Referans',
        message: `${data.clientName} referansınızla katıldı`,
        type: 'referral'
      });
    };

    const handleAchievement = (data: any) => {
      addNotification({
        title: 'Yeni Başarı',
        message: `"${data.title}" başarısını kazandınız!`,
        type: 'achievement'
      });
    };

    // Event'lere abone ol
    const unsubscribeInvestment = eventBus.subscribe('investment-updated', handleInvestmentUpdate);
    const unsubscribeReferral = eventBus.subscribe('referral-updated', handleReferralUpdate);
    const unsubscribeAchievement = eventBus.subscribe('achievement-unlocked', handleAchievement);

    return () => {
      unsubscribeInvestment();
      unsubscribeReferral();
      unsubscribeAchievement();
    };
  }, []);

  const addNotification = ({ title, message, type }: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now(),
      title,
      message,
      time: 'Şimdi',
      type,
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Bildirimler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const Icon = typeConfig[notification.type].icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-lg border",
                    notification.read ? "bg-background" : "bg-primary/5"
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                      "p-2 rounded-full h-fit",
                      typeConfig[notification.type].bgColor
                    )}>
                      <Icon className={cn(
                        "w-4 h-4",
                        typeConfig[notification.type].color
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Badge variant="secondary" className="mt-2">
                          Yeni
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Henüz bildirim bulunmuyor
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}