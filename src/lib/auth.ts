import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  department: string;
  position: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAdminAccess: () => boolean;
}

const api = axios.create({
  baseURL: 'https://panel.tefaiz.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.post('/auth/login', {
            email,
            password
          });

          const { token, user } = response.data;

          if (response.data.error) {
            throw new Error(response.data.message || 'Giriş başarısız');
          }

          set({
            user,
            isAuthenticated: true,
            token,
            isLoading: false,
            error: null
          });

          localStorage.setItem('auth-token', token);
          
          // Token'ı axios instance'ına ekle
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Giriş sırasında bir hata oluştu',
            isAuthenticated: false,
            user: null,
            token: null
          });
          
          toast({
            title: "Giriş başarısız",
            description: error instanceof Error ? error.message : 'Giriş sırasında bir hata oluştu',
            variant: "destructive"
          });
          
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token');
        // Token'ı axios instance'ından kaldır
        delete api.defaults.headers.common['Authorization'];
        
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isLoading: false,
          error: null
        });
      },

      checkAdminAccess: () => {
        const state = get();
        return state.isAuthenticated && state.user?.role === 'admin';
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      })
    }
  )
);