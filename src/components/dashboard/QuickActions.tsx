import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, TrendingUp, Users, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Hızlı İşlemler
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate('/investments')}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Yeni Yatırım
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/referrals')}>
          <Users className="w-4 h-4 mr-2" />
          Referans Ekle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/achievements')}>
          <Trophy className="w-4 h-4 mr-2" />
          Başarılar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}