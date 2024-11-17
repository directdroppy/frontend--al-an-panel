import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InvestmentListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'all' | 'active' | 'pending' | 'completed') => void;
}

const filterOptions = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Aktif Yatırımlar' },
  { id: 'pending', label: 'Bekleyenler' },
  { id: 'completed', label: 'Tamamlananlar' }
] as const;

export function InvestmentListHeader({
  searchTerm,
  onSearchChange,
  onFilterChange
}: InvestmentListHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Yatırımcı ara..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={() => onFilterChange(id as 'all' | 'active' | 'pending' | 'completed')}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}