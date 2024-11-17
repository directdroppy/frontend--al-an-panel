export interface CreateInvestmentDTO {
  amount: number;
  countryCode: string;
  duration: string;
  walletAddress: string;
  proofOfPayment?: File;
}

export interface ApproveInvestmentDTO {
  adminId: string;
  adminName: string;
  notes?: string;
}

export interface RejectInvestmentDTO {
  adminId: string;
  adminName: string;
  reason: string;
}

export interface CreateReferralDTO {
  clientName: string;
  email: string;
  phone: string;
  relationship: string;
  notes?: string;
}

export interface AddBalanceDTO {
  userId: string;
  amount: number;
  type: 'investment_return' | 'referral_commission' | 'withdrawal' | 'reward';
}

export interface CreateWithdrawalDTO {
  amount: number;
  walletAddress: string;
}