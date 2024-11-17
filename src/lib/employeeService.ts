import { api } from './api';
import { Employee } from '@/types/employee';
import { toast } from '@/components/ui/use-toast';

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const { data, error } = await api.get<{ employees: Employee[] }>('/employees');
    if (error) throw new Error(error);
    return data?.employees || [];
  },

  async create(employee: Omit<Employee, 'id'> & { password: string }): Promise<Employee> {
    try {
      const { data, error } = await api.post<{ id: string; message: string }>('/employees', {
        ...employee,
        status: 'active' // Explicitly set status
      });
      
      if (error) throw new Error(error);
      if (!data?.id) throw new Error('No ID returned from server');

      toast({
        title: "Başarılı",
        description: data.message || "Çalışan başarıyla eklendi",
      });

      return {
        ...employee,
        id: data.id,
        status: 'active'
      } as Employee;
    } catch (error) {
      console.error('Employee creation error:', error);
      throw error;
    }
  },

  async update(id: string, employee: Partial<Employee>): Promise<void> {
    try {
      const { error, data } = await api.put(`/employees?id=${id}`, employee);
      if (error) throw new Error(error);

      toast({
        title: "Başarılı",
        description: data?.message || "Çalışan bilgileri güncellendi",
      });
    } catch (error) {
      console.error('Employee update error:', error);
      throw error;
    }
  },

  async updatePassword(id: string, password: string): Promise<void> {
    try {
      const { error, data } = await api.put(`/employees?id=${id}`, { password });
      if (error) throw new Error(error);

      toast({
        title: "Başarılı",
        description: data?.message || "Şifre başarıyla güncellendi",
      });
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error, data } = await api.delete(`/employees?id=${id}`);
      if (error) throw new Error(error);

      toast({
        title: "Başarılı",
        description: data?.message || "Çalışan başarıyla silindi",
      });
    } catch (error) {
      console.error('Employee deletion error:', error);
      throw error;
    }
  }
};