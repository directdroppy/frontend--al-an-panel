import { NavLink } from '@/components/ui/nav-link';
import { LayoutDashboard, LineChart, Users, Trophy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="h-6 w-6 rounded-full bg-primary" />
        <span className="font-semibold">Tefaiz Dashboard</span>
      </div>
      
      <div className="flex-1 space-y-1 p-4">
        <NavLink href="/dashboard" icon={LayoutDashboard}>
          Dashboard
        </NavLink>
        <NavLink href="/dashboard/investments" icon={LineChart}>
          Yatırımlar
        </NavLink>
        <NavLink href="/dashboard/referrals" icon={Users}>
          Referanslar
        </NavLink>
        <NavLink href="/dashboard/achievements" icon={Trophy}>
          Başarılar
        </NavLink>
      </div>
      
      <div className="border-t p-4">
        <NavLink href="/dashboard/settings" icon={Settings}>
          Ayarlar
        </NavLink>
      </div>
    </div>
  );
}