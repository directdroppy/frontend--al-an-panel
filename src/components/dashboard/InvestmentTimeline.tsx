import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const timelineData = [
  {
    id: 1,
    title: "Yeni Yatırım Fırsatı",
    amount: "₺250,000",
    type: "opportunity",
    time: "10:30",
    status: "active"
  },
  {
    id: 2,
    title: "Kâr Realizasyonu",
    amount: "₺15,000",
    type: "profit",
    time: "09:15",
    status: "completed"
  },
  {
    id: 3,
    title: "Portföy Güncellemesi",
    amount: "₺180,000",
    type: "update",
    time: "Dün",
    status: "pending"
  }
];

const typeConfig = {
  opportunity: {
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    icon: "💎"
  },
  profit: {
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    icon: "💰"
  },
  update: {
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    icon: "📊"
  }
};

export function InvestmentTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yatırım Zaman Çizelgesi</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-border"
              >
                <div className={cn(
                  "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full -translate-x-1/2",
                  typeConfig[item.type as keyof typeof typeConfig].bgColor
                )}>
                  <span className="text-xl">
                    {typeConfig[item.type as keyof typeof typeConfig].icon}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                    typeConfig[item.type as keyof typeof typeConfig].color,
                    typeConfig[item.type as keyof typeof typeConfig].bgColor
                  )}>
                    {item.amount}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}