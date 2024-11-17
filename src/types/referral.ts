export interface Referral {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  status: 'pending' | 'active' | 'completed';
  amount: number;
  commission: number;
  date: string;
  completedAt?: string;
  notes?: string;
  employeeId: string;
  employeeName: string;
  relationship: string;
}

export interface ReferralLevel {
  id: number;
  name: string;
  threshold: number;
  commission: number;
  rewards: {
    bonus: number;
    features: string[];
  };
}