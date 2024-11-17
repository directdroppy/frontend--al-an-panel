import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked?: boolean;
}

const rarityConfig = {
  common: {
    gradient: 'from-slate-400 to-slate-500',
    border: 'border-slate-400/20',
    glow: 'shadow-slate-500/20',
  },
  rare: {
    gradient: 'from-blue-400 to-indigo-500',
    border: 'border-blue-400/20',
    glow: 'shadow-blue-500/20',
  },
  epic: {
    gradient: 'from-purple-400 to-pink-500',
    border: 'border-purple-400/20',
    glow: 'shadow-purple-500/20',
  },
  legendary: {
    gradient: 'from-amber-400 to-orange-500',
    border: 'border-amber-400/20',
    glow: 'shadow-amber-500/20',
  },
};

export function AchievementCard({
  title,
  description,
  icon,
  progress,
  rarity,
  points,
  unlocked,
}: AchievementCardProps) {
  const config = rarityConfig[rarity];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border p-4 transition-all',
        config.border,
        unlocked && `shadow-lg ${config.glow}`
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'rounded-lg p-2',
            unlocked ? `bg-gradient-to-br ${config.gradient}` : 'bg-muted'
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            <span
              className={cn(
                'text-sm',
                unlocked ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {points} XP
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <Progress value={progress} className="mt-3" />
        </div>
      </div>
    </div>
  );
}