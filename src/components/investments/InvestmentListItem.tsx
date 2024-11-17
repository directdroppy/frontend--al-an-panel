import { Investment } from '@/types/investment';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface InvestmentListItemProps {
  investment: Investment;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  active: 'bg-emerald-500/10 text-emerald-500',
  completed: 'bg-blue-500/10 text-blue-500',
  cancelled: 'bg-red-500/10 text-red-500'
} as const;

const typeColors = {
  fixed: 'bg-blue-500/10 text-blue-500',
  flexible: 'bg-purple-500/10 text-purple-500',
  special: 'bg-amber-500/10 text-amber-500'
} as const;

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'PP', { locale: tr });
  } catch (error) {
    return 'Geçersiz tarih';
  }
};

const getTypeLabel = (type: Investment['type']) => {
  switch (type) {
    case 'fixed': return 'Sabit Getirili';
    case 'flexible': return 'Esnek';
    case 'special': return 'Özel Portföy';
    default: return type;
  }
};

const getStatusLabel = (status: Investment['status']) => {
  switch (status) {
    case 'pending': return 'Beklemede';
    case 'active': return 'Aktif';
    case 'completed': return 'Tamamlandı';
    case 'cancelled': return 'İptal';
    default: return status;
  }
};

export function InvestmentListItem({ investment }: InvestmentListItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card rounded-lg border p-4 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{investment.userName}</h4>
            <Badge className={cn(typeColors[investment.type])}>
              {getTypeLabel(investment.type)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span key={`${investment.id}-start`}>
              Başlangıç: {formatDate(investment.startDate)}
            </span>
            {investment.endDate && (
              <span key={`${investment.id}-end`}>
                Bitiş: {formatDate(investment.endDate)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-medium">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'USD'
              }).format(investment.amount)} USDT
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-500">
              <TrendingUp className="h-4 w-4" />
              %{investment.returnRate}
            </div>
          </div>
          <Badge className={cn(statusColors[investment.status])}>
            {getStatusLabel(investment.status)}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem key={`${investment.id}-view`}>
                Detayları Görüntüle
              </DropdownMenuItem>
              <DropdownMenuItem key={`${investment.id}-edit`}>
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem 
                key={`${investment.id}-cancel`}
                className="text-red-500"
              >
                İptal Et
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {investment.notes && (
        <p className="mt-2 text-sm text-muted-foreground">
          {investment.notes}
        </p>
      )}
    </motion.div>
  );
}