import { Investment } from '@/types/investment';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { InvestmentListItem } from './InvestmentListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InvestmentListProps {
  investments: Investment[];
}

const filterOptions = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Aktif Yatırımlar' },
  { id: 'pending', label: 'Bekleyenler' },
  { id: 'completed', label: 'Tamamlananlar' }
] as const;

export function InvestmentList({ investments }: InvestmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesFilter = filter === 'all' || investment.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Yatırımcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {filterOptions.map(({ id, label }) => (
              <DropdownMenuItem 
                key={id}
                onClick={() => setFilter(id as 'all' | 'active' | 'pending' | 'completed')}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`investment-list-${filter}-${searchTerm}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          {filteredInvestments.length > 0 ? (
            filteredInvestments.map((investment) => (
              <InvestmentListItem
                key={investment.id}
                investment={investment}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Yatırım bulunmuyor
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}