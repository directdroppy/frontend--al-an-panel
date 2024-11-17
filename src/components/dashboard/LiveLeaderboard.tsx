import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy, TrendingUp, TrendingDown, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useLeaderboardStore } from '@/lib/leaderboardStore';
import { useAuth } from '@/lib/auth';

interface LiveLeaderboardProps {
  fullWidth?: boolean;
}

export function LiveLeaderboard({ fullWidth = false }: LiveLeaderboardProps) {
  const { user } = useAuth();
  const { getLeaderboard, generateSimulatedUsers, updateSimulatedUsers } = useLeaderboardStore();
  const [highlightedUser, setHighlightedUser] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());

  useEffect(() => {
    generateSimulatedUsers(82);
  }, [generateSimulatedUsers]);

  useEffect(() => {
    const updateLeaderboard = () => {
      updateSimulatedUsers();
      const updatedLeaderboard = getLeaderboard();
      setLeaderboard(updatedLeaderboard);

      if (user && Math.random() > 0.7) {
        setHighlightedUser(user.id);
        setTimeout(() => setHighlightedUser(null), 2000);
      }
    };

    updateLeaderboard();
    const interval = setInterval(updateLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [updateSimulatedUsers, getLeaderboard, user]);

  const displayData = fullWidth ? leaderboard : leaderboard.slice(0, 10);

  return (
    <Card className={cn("w-full overflow-hidden", fullWidth && "max-w-5xl mx-auto")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Liderlik Tablosu
          <span className="text-sm text-muted-foreground ml-2">
            ({leaderboard.length} Yarışmacı)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {displayData.map((leaderboardUser) => (
                <motion.div
                  key={leaderboardUser.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    backgroundColor: highlightedUser === leaderboardUser.id ? 'var(--primary-50)' : 'transparent',
                    transition: { duration: 0.3 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "p-4 rounded-lg border bg-card transition-colors",
                    highlightedUser === leaderboardUser.id && "border-primary shadow-lg",
                    leaderboardUser.isSimulated && "opacity-75"
                  )}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex items-center gap-4">
                        {leaderboardUser.rank <= 3 ? (
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-8 h-8 flex items-center justify-center"
                          >
                            {leaderboardUser.rank === 1 && <Crown className="h-6 w-6 text-yellow-500" />}
                            {leaderboardUser.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                            {leaderboardUser.rank === 3 && <Trophy className="h-5 w-5 text-amber-600" />}
                          </motion.div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                            {leaderboardUser.rank}
                          </div>
                        )}
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={leaderboardUser.avatar} />
                          <AvatarFallback>{leaderboardUser.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {leaderboardUser.name}
                            {leaderboardUser.id === user?.id && " (Sen)"}
                          </span>
                          {leaderboardUser.streak > 2 && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="flex items-center gap-1 text-primary text-sm"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{leaderboardUser.streak} gün</span>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate">{leaderboardUser.department}</span>
                          <span>•</span>
                          <span>Seviye {leaderboardUser.level}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                      <div className="text-right">
                        <div className="font-medium">
                          {new Intl.NumberFormat('tr-TR').format(Math.floor(leaderboardUser.points))} puan
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={leaderboardUser.performance} className="w-20 h-1.5" />
                          <span className="text-xs text-muted-foreground">
                            %{leaderboardUser.performance.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="w-16 flex items-center justify-end">
                        {leaderboardUser.trend === 'up' && (
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-1 text-emerald-500"
                          >
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs">
                              +{Math.abs(leaderboardUser.rank - leaderboardUser.lastWeekRank)}
                            </span>
                          </motion.div>
                        )}
                        {leaderboardUser.trend === 'down' && (
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-1 text-red-500"
                          >
                            <TrendingDown className="h-4 w-4" />
                            <span className="text-xs">
                              -{Math.abs(leaderboardUser.rank - leaderboardUser.lastWeekRank)}
                            </span>
                          </motion.div>
                        )}
                        {leaderboardUser.trend === 'neutral' && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <ArrowRight className="h-4 w-4" />
                            <span className="text-xs">0</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}