export interface ChartData {
  date: string;
  value: number;
}

export interface DashboardStats {
  totalInvestment: number;
  activeInvestments: number;
  totalReferrals: number;
  totalEarnings: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface InvestmentData {
  id: string;
  name: string;
  amount: number;
  status: 'active' | 'completed' | 'pending';
  returnRate: number;
  startDate: string;
  endDate: string;
}

export interface ReferralData {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'pending';
  commission: number;
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  progress: number;
  reward: number;
  icon: string;
}