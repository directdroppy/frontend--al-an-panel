import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from '@/components/ui/use-toast';
import { eventBus } from './eventBus';
import { api } from './api';

interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  notes?: string;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'investment_return' | 'referral_commission' | 'withdrawal' | 'reward';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

interface BalanceState {
  balances: Record<string, number>;
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];
  isLoading: boolean;
  error: string | null;
  
  fetchBalance: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  addBalance: (email: string, amount: number, type: Transaction['type'], description?: string) => Promise<void>;
  findUserByEmail: (email: string) => Promise<any>;
  createWithdrawalRequest: (data: { userId: string; amount: number; walletAddress: string }) => Promise<void>;
  approveWithdrawal: (id: string, adminId: string) => Promise<void>;
  rejectWithdrawal: (id: string, adminId: string, reason: string) => Promise<void>;
  getWithdrawalsByStatus: (status: WithdrawalRequest['status']) => WithdrawalRequest[];
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      balances: {},
      transactions: [],
      withdrawalRequests: [],
      isLoading: false,
      error: null,

      fetchBalance: async (userId) => {
        set({ isLoading: true });
        try {
          const response = await api.get(`/balances/${userId}`);
          const { balance, transactions } = response.data;
          
          set(state => ({
            balances: {
              ...state.balances,
              [userId]: balance
            },
            transactions: transactions,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Bakiye bilgisi alınamadı' 
          });
          throw error;
        }
      },

      fetchTransactions: async (userId) => {
        try {
          const response = await api.get(`/balances/${userId}/transactions`);
          set({ transactions: response.data });
        } catch (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }
      },

      findUserByEmail: async (email) => {
        try {
          const response = await api.get(`/users/find?email=${email}`);
          return response.data.user;
        } catch (error) {
          console.error('Error finding user:', error);
          return null;
        }
      },

      addBalance: async (email, amount, type, description) => {
        try {
          const user = await get().findUserByEmail(email);
          if (!user) {
            throw new Error('Kullanıcı bulunamadı');
          }

          const response = await api.post('/balances/add', {
            userId: user.id,
            amount,
            type,
            description
          });

          const { balance, transaction } = response.data;

          set(state => ({
            balances: {
              ...state.balances,
              [user.id]: balance
            },
            transactions: [transaction, ...state.transactions]
          }));

          eventBus.publish('balance-updated', { 
            userId: user.id, 
            amount, 
            type,
            description 
          });

          return response.data;
        } catch (error) {
          console.error('Error adding balance:', error);
          throw error;
        }
      },

      createWithdrawalRequest: async (data) => {
        try {
          const response = await api.post('/balances/withdraw', data);
          const newRequest = response.data;

          set(state => ({
            withdrawalRequests: [...state.withdrawalRequests, newRequest]
          }));

          toast({
            title: 'Çekim Talebi Oluşturuldu',
            description: 'Talebiniz incelemeye alındı.',
          });

          return response.data;
        } catch (error) {
          console.error('Error creating withdrawal request:', error);
          throw error;
        }
      },

      approveWithdrawal: async (id, adminId) => {
        try {
          const response = await api.put(`/balances/withdraw/${id}/approve`, {
            adminId
          });

          const { request, transaction } = response.data;

          set(state => ({
            withdrawalRequests: state.withdrawalRequests.map(w =>
              w.id === id ? request : w
            ),
            transactions: [transaction, ...state.transactions],
            balances: {
              ...state.balances,
              [request.userId]: state.balances[request.userId] - request.amount
            }
          }));

          eventBus.publish('withdrawal-approved', { 
            request,
            adminId
          });

          return response.data;
        } catch (error) {
          console.error('Error approving withdrawal:', error);
          throw error;
        }
      },

      rejectWithdrawal: async (id, adminId, reason) => {
        try {
          const response = await api.put(`/balances/withdraw/${id}/reject`, {
            adminId,
            reason
          });

          const rejectedRequest = response.data;

          set(state => ({
            withdrawalRequests: state.withdrawalRequests.map(w =>
              w.id === id ? rejectedRequest : w
            )
          }));

          eventBus.publish('withdrawal-rejected', {
            request: rejectedRequest,
            adminId,
            reason
          });

          return response.data;
        } catch (error) {
          console.error('Error rejecting withdrawal:', error);
          throw error;
        }
      },

      getWithdrawalsByStatus: (status) => {
        return get().withdrawalRequests.filter(w => w.status === status);
      }
    }),
    {
      name: 'balance-store',
      partialize: (state) => ({
        balances: state.balances,
        withdrawalRequests: state.withdrawalRequests
      })
    }
  )
);