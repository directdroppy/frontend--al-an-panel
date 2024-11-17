import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy } from 'lucide-react';

interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string;
  points: number;
  rank: number;
}

export function LiveLeaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      avatar: "https://i.pravatar.cc/150?u=1",
      points: 12500,
      rank: 1
    },
    {
      id: 2,
      name: "Mehmet Demir",
      avatar: "https://i.pravatar.cc/150?u=2",
      points: 11200,
      rank: 2
    },
    {
      id: 3,
      name: "Ayşe Kaya",
      avatar: "https://i.pravatar.cc/150?u=3",
      points: 10800,
      rank: 3
    },
    {
      id: 4,
      name: "Fatma Şahin",
      avatar: "https://i.pravatar.cc/150?u=4",
      points: 9500,
      rank: 4
    },
    {
      id: 5,
      name: "Ali Öztürk",
      avatar: "https://i.pravatar.cc/150?u=5",
      points: 9200,
      rank: 5
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers => {
        return prevUsers.map(user => ({
          ...user,
          points: user.points + Math.floor(Math.random() * 100)
        }))
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">{rank}</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liderlik Tablosu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                {getRankIcon(user.rank)}
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('tr-TR').format(user.points)} puan
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}