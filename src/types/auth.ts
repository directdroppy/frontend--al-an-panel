export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  department: string;
  position: string;
  imageUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}