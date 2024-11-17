import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Referral } from '@/types/referral';

interface ReferralListProps {
  referrals?: Referral[];
}

const filterOptions = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Aktif' },
  { id: 'pending', label: 'Bekleyen' },
  { id: 'completed', label: 'Tamamlanan' }
] as const;

export function ReferralList({ referrals = [] }: ReferralListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  const safeReferrals = Array.isArray(referrals) ? referrals : [];
  
  const filteredReferrals = safeReferrals.filter(referral => {
    const matchesSearch = referral.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || referral.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Referans ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {filterOptions.map(option => (
              <DropdownMenuItem 
                key={option.id}
                onClick={() => setFilter(option.id as typeof filter)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {filteredReferrals.map((referral, index) => (
          <motion.div
            key={referral.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-lg border p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{referral.clientName}</h4>
                  <Badge className={cn(
                    referral.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    referral.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-blue-500/10 text-blue-500'
                  )}>
                    {referral.status === 'pending' ? 'Beklemede' :
                     referral.status === 'active' ? 'Aktif' :
                     'Tamamlandı'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(referral.date), 'PPp', { locale: tr })}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  {referral.amount > 0 && (
                    <div className="font-medium">
                      {new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(referral.amount)} USDT
                    </div>
                  )}
                  {referral.commission > 0 && (
                    <div className="text-sm text-emerald-500">
                      +{new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(referral.commission)} USDT komisyon
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      Detayları Görüntüle
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      İptal Et
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {referral.notes && (
              <p className="mt-2 text-sm text-muted-foreground">
                {referral.notes}
              </p>
            )}
          </motion.div>
        ))}

        {filteredReferrals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Gösterilecek referans bulunamadı.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}