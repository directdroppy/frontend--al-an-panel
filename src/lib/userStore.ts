import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department: string;
  position: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
  imageUrl?: string;
}

interface UserStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@company.com',
    role: 'employee',
    department: 'Satış',
    position: 'Satış Uzmanı',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: new Date().toISOString(),
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
  },
  {
    id: '2',
    name: 'Ayşe Kaya',
    email: 'ayse.kaya@company.com',
    role: 'admin',
    department: 'Yönetim',
    position: 'Bölge Müdürü',
    status: 'active',
    joinDate: '2023-11-01',
    lastActive: new Date().toISOString(),
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
  }
];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: initialUsers,

      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user]
        })),

      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...data } : user
          )
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id)
        })),

      toggleUserStatus: (id) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
              : user
          )
        })),
    }),
    {
      name: 'user-store',
    }
  )
);