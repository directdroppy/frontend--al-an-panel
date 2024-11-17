import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const api = axios.create({
  baseURL: 'https://panel.tefaiz.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }

    toast({
      title: "Hata",
      description: message,
      variant: "destructive"
    });

    return Promise.reject(error);
  }
);

export { api };