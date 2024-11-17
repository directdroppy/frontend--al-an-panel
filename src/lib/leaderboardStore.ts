import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';
import { eventBus } from '@/lib/eventBus';

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

interface LeaderboardState {
  users: LeaderboardUser[];
  simulatedUsers: LeaderboardUser[];
  lastUpdateTime: string;
  updateFrequency: number;
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<LeaderboardUser>) => void;
  generateSimulatedUsers: (count: number) => void;
  updateSimulatedUsers: () => void;
  getLeaderboard: () => LeaderboardUser[];
}

const DEPARTMENTS = ['Finans', 'Yatırım', 'Satış', 'Müşteri İlişkileri'];
const NAMES = [
  'Ahmet Yılmaz', 'Mehmet Demir', 'Ali Öztürk', 'Ayşe Kaya', 'Fatma Şahin',
  'Zeynep Çelik', 'Can Yıldız', 'Ece Demir', 'Burak Aydın', 'Deniz Kara',
  'Emre Kılıç', 'Selin Yıldırım', 'Mustafa Çetin', 'Elif Arslan', 'Oğuz Şahin'
];

const WEIGHTS = {
  weeklyPoints: 0.4,
  monthlyPoints: 0.3,
  achievements: 0.2,
  streak: 0.1
};

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes
const SIGNIFICANT_CHANGE_THRESHOLD = 100;

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      users: [],
      simulatedUsers: [],
      lastUpdateTime: new Date().toISOString(),
      updateFrequency: UPDATE_INTERVAL,

      addUser: (user) => {
        const leaderboardUser: LeaderboardUser = {
          id: user.id,
          name: user.name,
          avatar: user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          points: 0,
          rank: 0,
          trend: 'neutral',
          department: user.department,
          performance: 0,
          lastWeekRank: 0,
          streak: 0,
          level: 1,
          badges: [],
          lastUpdated: new Date().toISOString(),
          weeklyPoints: 0,
          monthlyPoints: 0,
          achievements: 0
        };

        set(state => ({
          users: [...state.users, leaderboardUser]
        }));

        eventBus.publish('leaderboard-user-added', { user: leaderboardUser });
      },

      updateUser: (id, data) => {
        set(state => ({
          users: state.users.map(user => 
            user.id === id ? { ...user, ...data } : user
          )
        }));
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

        set({ simulatedUsers });
      },

      updateSimulatedUsers: () => {
        const now = new Date();
        const { lastUpdateTime, simulatedUsers } = get();
        const timeSinceLastUpdate = now.getTime() - new Date(lastUpdateTime).getTime();

        if (timeSinceLastUpdate < UPDATE_INTERVAL) return;

        const updatedUsers = simulatedUsers.map(user => {
          if (Math.random() > 0.3) return user;

          const pointChange = Math.floor(Math.random() * 200) - 50;
          if (Math.abs(pointChange) < SIGNIFICANT_CHANGE_THRESHOLD) return user;

          return {
            ...user,
            points: Math.max(0, user.points + pointChange),
            weeklyPoints: user.weeklyPoints + Math.floor(pointChange * 0.2),
            monthlyPoints: user.monthlyPoints + Math.floor(pointChange * 0.1),
            lastUpdated: now.toISOString()
          };
        });

        set({
          simulatedUsers: updatedUsers,
          lastUpdateTime: now.toISOString()
        });

        eventBus.publish('leaderboard-updated', { timestamp: now.toISOString() });
      },

      getLeaderboard: () => {
        const { users, simulatedUsers } = get();
        const allUsers = [...users, ...simulatedUsers];

        const calculateScore = (user: LeaderboardUser) => {
          return (
            user.weeklyPoints * WEIGHTS.weeklyPoints +
            user.monthlyPoints * WEIGHTS.monthlyPoints +
            user.achievements * WEIGHTS.achievements +
            user.streak * WEIGHTS.streak
          );
        };

        return allUsers
          .sort((a, b) => calculateScore(b) - calculateScore(a))
          .map((user, index) => ({
            ...user,
            rank: index + 1,
            trend: user.rank === 0 ? 'neutral' :
                   index + 1 < user.rank ? 'up' :
                   index + 1 > user.rank ? 'down' : 'neutral',
            lastWeekRank: user.rank || index + 1
          }));
      }
    }),
    {
      name: 'leaderboard-store',
      partialize: (state) => ({
        users: state.users,
        lastUpdateTime: state.lastUpdateTime
      })
    }
  )
);