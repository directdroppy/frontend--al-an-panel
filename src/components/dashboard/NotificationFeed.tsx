import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const notifications = [
  {
    id: 1,
    title: 'Yeni Yatırım Fırsatı',
    message: 'Yeni bir yatırım fırsatı mevcut. İncelemek ister misiniz?',
    time: '5 dakika önce',
    type: 'investment',
    read: false
  },
  {
    id: 2,
    title: 'Başarı Rozeti Kazandınız',
    message: '"Yatırım Uzmanı" rozetini kazandınız!',
    time: '1 saat önce',
    type: 'achievement',
    read: false
  },
  {
    id: 3,
    title: 'Yeni Referans',
    message: 'Mehmet Demir referansınızla katıldı',
    time: '2 saat önce',
    type: 'referral',
    read: true
  },
  {
    id: 4,
    title: 'Portföy Güncellemesi',
    message: 'Portföyünüz %2.5 değer kazandı',
    time: '3 saat önce',
    type: 'portfolio',
    read: true
  }
];

const typeConfig = {
  investment: {
    icon: TrendingUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  achievement: {
    icon: Bell,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  referral: {
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  portfolio: {
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
};

export function NotificationFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Bildirimler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const Icon = typeConfig[notification.type as keyof typeof typeConfig].icon;
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
                      typeConfig[notification.type as keyof typeof typeConfig].bgColor
                    )}>
                      <Icon className={cn(
                        "w-4 h-4",
                        typeConfig[notification.type as keyof typeof typeConfig].color
                      )} />
                    </div>
                    <div className="space-y-1">
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}