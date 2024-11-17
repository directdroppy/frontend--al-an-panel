import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Edit, Trash2, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { employees } from '@/data/employees';
import { useAdmin } from '@/lib/admin';

interface EmployeeFormData {
  name: string;
  position: string;
  department: string;
  email: string;
  bio: string;
  skills: string[];
}

const initialFormData: EmployeeFormData = {
  name: '',
  position: '',
  department: '',
  email: '',
  bio: '',
  skills: []
};

const departments = [
  'Finans',
  'Yatırım',
  'Satış',
  'Müşteri İlişkileri',
  'Risk Yönetimi',
  'Portföy Yönetimi'
];

const positions = [
  'Finans Uzmanı',
  'Yatırım Danışmanı',
  'Satış Temsilcisi',
  'Müşteri Temsilcisi',
  'Risk Analisti',
  'Portföy Yöneticisi'
];

export function EmployeeManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const { toast } = useToast();
  const { addEmployee, updateEmployee, removeEmployee } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmployee) {
      updateEmployee(editingEmployee, formData);
      toast({
        title: 'Çalışan güncellendi',
        description: 'Çalışan bilgileri başarıyla güncellendi.',
      });
    } else {
      addEmployee({
        ...formData,
        id: Date.now().toString(),
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        startDate: new Date().toISOString(),
      });
      toast({
        title: 'Çalışan eklendi',
        description: 'Yeni çalışan başarıyla eklendi.',
      });
    }

    setShowForm(false);
    setFormData(initialFormData);
    setEditingEmployee(null);
  };

  const handleEdit = (employee: typeof employees[0]) => {
    setFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      bio: employee.bio,
      skills: employee.skills,
    });
    setEditingEmployee(employee.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    removeEmployee(id);
    toast({
      title: 'Çalışan silindi',
      description: 'Çalışan başarıyla silindi.',
      variant: 'destructive',
    });
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Çalışan ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Yeni Çalışan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={employee.imageUrl}
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Departman:</span>{' '}
                    {employee.department}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">E-posta:</span>{' '}
                    {employee.email}
                  </div>
                  <div className="text-sm line-clamp-2">
                    <span className="text-muted-foreground">Bio:</span>{' '}
                    {employee.bio}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Çalışan Düzenle' : 'Yeni Çalışan Ekle'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Ad Soyad</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departman</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Departman seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pozisyon</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pozisyon seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>E-posta</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Input
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData(initialFormData);
                  setEditingEmployee(null);
                }}
              >
                İptal
              </Button>
              <Button type="submit">
                {editingEmployee ? 'Güncelle' : 'Ekle'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}