import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { eventBus } from './eventBus';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  trend: 'up' | 'down' | 'neutral';
  department: string;
  performance: number;
  lastWeekRank: number;
  streak: number;
  level: number;
  badges: string[];
  lastUpdated: string;
  weeklyPoints: number;
  monthlyPoints: number;
  achievements: number;
  isSimulated?: boolean;
}

interface PerformanceMetrics {
  dailyStats: {
    investments: number;
    referrals: number;
    revenue: number;
    commission: number;
  };
  weeklyGoals: {
    target: number;
    current: number;
    progress: number;
  };
  achievements: {
    unlocked: string[];
    inProgress: Array<{
      id: string;
      progress: number;
      target: number;
    }>;
  };
  leaderboard: LeaderboardUser[];
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  updateDailyStats: (stats: Partial<PerformanceMetrics['dailyStats']>) => void;
  updateWeeklyGoals: (goals: Partial<PerformanceMetrics['weeklyGoals']>) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  updateLeaderboard: (users: LeaderboardUser[]) => void;
  generateSimulatedUsers: (count: number) => void;
}

const DEPARTMENTS = ['Finans', 'Yatırım', 'Satış', 'Müşteri İlişkileri'];
const NAMES = [
  'Ahmet Yılmaz', 'Mehmet Demir', 'Ali Öztürk', 'Ayşe Kaya', 'Fatma Şahin',
  'Zeynep Çelik', 'Can Yıldız', 'Ece Demir', 'Burak Aydın', 'Deniz Kara'
];

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    (set, get) => ({
      metrics: {
        dailyStats: {
          investments: 0,
          referrals: 0,
          revenue: 0,
          commission: 0
        },
        weeklyGoals: {
          target: 10000,
          current: 0,
          progress: 0
        },
        achievements: {
          unlocked: [],
          inProgress: []
        },
        leaderboard: []
      },

      updateDailyStats: (stats) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            dailyStats: {
              ...state.metrics.dailyStats,
              ...stats
            }
          }
        }));
        eventBus.publish('daily-stats-updated', stats);
      },

      updateWeeklyGoals: (goals) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            weeklyGoals: {
              ...state.metrics.weeklyGoals,
              ...goals,
              progress: (goals.current || state.metrics.weeklyGoals.current) / 
                       (goals.target || state.metrics.weeklyGoals.target) * 100
            }
          }
        }));
        eventBus.publish('weekly-goals-updated', goals);
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            achievements: {
              ...state.metrics.achievements,
              unlocked: [...state.metrics.achievements.unlocked, achievementId],
              inProgress: state.metrics.achievements.inProgress.filter(
                (a) => a.id !== achievementId
              )
            }
          }
        }));
        eventBus.publish('achievement-unlocked', { achievementId });
      },

      updateAchievementProgress: (achievementId, progress) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            achievements: {
              ...state.metrics.achievements,
              inProgress: state.metrics.achievements.inProgress.map((a) =>
                a.id === achievementId ? { ...a, progress } : a
              )
            }
          }
        }));
        eventBus.publish('achievement-progress-updated', { achievementId, progress });
      },

      updateLeaderboard: (users) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            leaderboard: users
          }
        }));
        eventBus.publish('leaderboard-updated', { users });
      },

      generateSimulatedUsers: (count) => {
        const simulatedUsers: LeaderboardUser[] = Array.from({ length: count }, (_, i) => ({
          id: `sim_${i}`,
          name: NAMES[Math.floor(Math.random() * NAMES.length)],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=sim_${i}`,
          points: 10000 - Math.floor(Math.random() * 2000),
          rank: 0,
          trend: 'neutral',
          department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
          performance: 70 + Math.floor(Math.random() * 30),
          lastWeekRank: 0,
          streak: Math.floor(Math.random() * 10),
          level: Math.floor(Math.random() * 20) + 1,
          badges: ['🌟', '🏆', '💎'].slice(0, Math.floor(Math.random() * 3) + 1),
          lastUpdated: new Date().toISOString(),
          weeklyPoints: Math.floor(Math.random() * 1000),
          monthlyPoints: Math.floor(Math.random() * 5000),
          achievements: Math.floor(Math.random() * 10),
          isSimulated: true
        }));

        set((state) => ({
          metrics: {
            ...state.metrics,
            leaderboard: simulatedUsers
          }
        }));
      }
    }),
    {
      name: 'performance-store'
    }
  )
);