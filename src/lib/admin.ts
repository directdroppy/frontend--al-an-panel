import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee } from '@/types/employee';

// Initial employees data
const defaultEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    position: 'Finans Uzmanı',
    department: 'Finans',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    bio: 'Finans sektöründe 10+ yıl deneyim',
    email: 'ahmet.yilmaz@tefaiz.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ahmetyilmaz',
      twitter: 'https://twitter.com/ahmetyilmaz'
    },
    skills: ['Finansal Analiz', 'Risk Yönetimi', 'Portföy Yönetimi'],
    startDate: '2020-01-15'
  },
  {
    id: '2',
    name: 'Ayşe Kaya',
    position: 'Kıdemli Yatırım Danışmanı',
    department: 'Yatırım',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    bio: 'Yatırım danışmanlığında uzman',
    email: 'ayse.kaya@tefaiz.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aysekaya'
    },
    skills: ['Yatırım Danışmanlığı', 'Portföy Yönetimi', 'Risk Analizi'],
    startDate: '2021-03-01'
  }
];

interface AdminState {
  employees: Employee[];
  simulationSpeed: number;
  simulationEnabled: boolean;
  systemSettings: {
    darkMode: boolean;
    language: string;
    notifications: boolean;
  };
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  setSimulationSpeed: (speed: number) => void;
  toggleSimulation: () => void;
  updateSystemSettings: (settings: Partial<AdminState['systemSettings']>) => void;
}

const initialState = {
  employees: defaultEmployees,
  simulationSpeed: 1,
  simulationEnabled: true,
  systemSettings: {
    darkMode: true,
    language: 'tr',
    notifications: true,
  },
};

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      ...initialState,
      
      addEmployee: (employee) => {
        set((state) => ({
          employees: [...state.employees, employee]
        }));
      },

      updateEmployee: (id, data) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...data } : emp
          )
        }));
      },

      removeEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id)
        }));
      },

      setSimulationSpeed: (speed) => {
        set({ simulationSpeed: speed });
      },

      toggleSimulation: () => {
        set((state) => ({ simulationEnabled: !state.simulationEnabled }));
      },

      updateSystemSettings: (settings) => {
        set((state) => ({
          systemSettings: {
            ...state.systemSettings,
            ...settings
          }
        }));
      },
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        systemSettings: state.systemSettings,
        simulationSpeed: state.simulationSpeed,
        simulationEnabled: state.simulationEnabled,
      }),
    }
  )
);