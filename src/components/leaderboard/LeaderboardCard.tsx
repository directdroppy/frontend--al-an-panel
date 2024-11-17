import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const leaderboardData = [
  { rank: 1, name: 'Mehmet Yılmaz', points: 2500, avatar: '/avatars/1.jpg' },
  { rank: 2, name: 'Ayşe Kaya', points: 2250, avatar: '/avatars/2.jpg' },
  { rank: 3, name: 'Ahmet Yılmaz', points: 2100, avatar: '/avatars/3.jpg' },
  { rank: 4, name: 'Fatma Demir', points: 1950, avatar: '/avatars/4.jpg' },
  { rank: 5, name: 'Ali Öz', points: 1800, avatar: '/avatars/5.jpg' },
];

export function LeaderboardCard() {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Lider Tablosu
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {leaderboardData.map((item) => (
            <div
              key={item.rank}
              className={cn(
                'flex items-center gap-4 p-4 transition-colors hover:bg-muted/50',
                item.rank === 3 && 'bg-primary-50 dark:bg-primary-950/50'
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                {item.rank === 1 ? (
                  <Trophy className="h-6 w-6 text-amber-500" />
                ) : item.rank === 2 ? (
                  <Medal className="h-6 w-6 text-slate-400" />
                ) : item.rank === 3 ? (
                  <Award className="h-6 w-6 text-amber-700" />
                ) : (
                  <span className="text-lg font-semibold text-muted-foreground">
                    {item.rank}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.points} XP
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                    style={{
                      width: `${(item.points / leaderboardData[0].points) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}