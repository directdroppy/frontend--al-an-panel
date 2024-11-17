export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MetricsResponse {
  metrics: {
    totalInvestments: number;
    activeInvestments: number;
    totalReferrals: number;
    successfulReferrals: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
  countryStats: Record<string, {
    totalInvestment: number;
    activeInvestments: number;
    occupancyRate: number;
    averageReturn: number;
  }>;
}

export interface SystemSettings {
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  referralCommissionRate: number;
  employeeCommissionRate: number;
  paymentDetails: {
    walletAddress: string;
    network: string;
    minAmount: number;
    maxAmount: number;
    processingTime: string;
    confirmations: number;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'employee';
    department: string;
    position: string;
    imageUrl?: string;
  };
}