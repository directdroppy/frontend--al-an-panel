import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

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

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'investment',
    action: 'Yeni Yatırım Onayı',
    description: 'ahmet123 kullanıcısının yatırımı onaylandı',
    timestamp: '2024-03-20T10:30:00',
    status: 'success',
    metadata: {
      amount: 1000,
      username: 'ahmet123',
      country: '🇹🇷 Türkiye'
    }
  },
  {
    id: '2',
    type: 'user',
    action: 'Kullanıcı Kaydı',
    description: 'Yeni kullanıcı kaydı yapıldı',
    timestamp: '2024-03-20T09:45:00',
    status: 'success',
    metadata: {
      username: 'mehmet456'
    }
  },
  {
    id: '3',
    type: 'investment',
    action: 'Yatırım İptali',
    description: 'Yatırım talebi reddedildi',
    timestamp: '2024-03-20T09:30:00',
    status: 'error',
    metadata: {
      amount: 500,
      username: 'ayse789',
      country: '🇹🇷 Türkiye'
    }
  },
  {
    id: '4',
    type: 'system',
    action: 'Sistem Uyarısı',
    description: 'Yüksek işlem hacmi tespit edildi',
    timestamp: '2024-03-20T09:15:00',
    status: 'warning'
  }
];

const typeConfig = {
  investment: {
    icon: TrendingUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  user: {
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  system: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  }
};

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-green-500'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-500'
  },
  error: {
    icon: XCircle,
    color: 'text-red-500'
  }
};

export function RecentActivities() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {mockActivities.map((activity, index) => {
          const TypeIcon = typeConfig[activity.type].icon;
          const StatusIcon = activity.status ? statusConfig[activity.status].icon : null;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex gap-4">
                <div className={cn(
                  "p-2 rounded-lg h-fit",
                  typeConfig[activity.type].bgColor
                )}>
                  <TypeIcon className={cn(
                    "w-4 h-4",
                    typeConfig[activity.type].color
                  )} />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{activity.action}</h4>
                      {activity.status && (
                        <StatusIcon className={cn(
                          "w-4 h-4",
                          statusConfig[activity.status].color
                        )} />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>

                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activity.metadata.username && (
                        <Badge variant="secondary">
                          @{activity.metadata.username}
                        </Badge>
                      )}
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
          );
        })}
      </div>
    </ScrollArea>
  );
}