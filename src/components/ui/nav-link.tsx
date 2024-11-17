import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export function NavLink({ href, children, icon: Icon, className, iconClassName }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === href || location.pathname === `${href}/`;

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
        className
      )}
    >
      {Icon && <Icon className={cn('h-4 w-4', iconClassName)} />}
      {children}
    </Link>
  );
}