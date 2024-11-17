export interface Investment {
  id: string;
  userId: string;
  userName?: string;
  amount: number;
  countryCode: string;
  country: string;
  type: 'fixed' | 'flexible' | 'special';
  status: 'pending' | 'active' | 'completed' | 'rejected';
  returnRate: number;
  startDate: string;
  endDate?: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  walletAddress?: string;
  transactionHash?: string;
  proofOfPayment?: string;
  notes?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  interestRate: number;
  currency: string;
  minInvestment: number;
  maxInvestment: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface InvestmentFormData {
  amount: number;
  duration: string;
  walletAddress: string;
  proofOfPayment?: File;
}