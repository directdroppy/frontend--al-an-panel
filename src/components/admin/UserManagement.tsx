import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth';

interface FormData {
  name: string;
  email: string;
  department: string;
  position: string;
  role: 'admin' | 'employee';
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  department: '',
  position: '',
  role: 'employee',
  password: '',
  confirmPassword: ''
};

const departments = [
  'Finans',
  'Yatırım',
  'Satış',
  'Müşteri İlişkileri',
  'Risk Yönetimi',
  'Portföy Yönetimi'
];

const positions = {
  'Satış': ['Satış Uzmanı', 'Satış Müdürü', 'Satış Temsilcisi'],
  'Yönetim': ['Bölge Müdürü', 'Genel Müdür', 'Operasyon Müdürü'],
  'Finans': ['Finans Uzmanı', 'Finans Müdürü', 'Finansal Analist'],
  'Müşteri İlişkileri': ['Müşteri Temsilcisi', 'CRM Uzmanı', 'Müşteri İlişkileri Müdürü'],
  'Risk Yönetimi': ['Risk Analisti', 'Risk Müdürü', 'Uyum Uzmanı'],
  'Portföy Yönetimi': ['Portföy Yöneticisi', 'Yatırım Danışmanı', 'Portföy Analisti']
};

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();
  const { users, addUser, updateUser, deleteUser } = useAuth();

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingUser) {
        await updateUser(editingUser, {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          position: formData.position,
          role: formData.role
        });
      } else {
        await addUser({
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          department: formData.department,
          position: formData.position,
          role: formData.role,
          status: 'active',
          imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
        }, formData.password);
      }

      setShowForm(false);
      setFormData(initialFormData);
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      department: user.department,
      position: user.position,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setEditingUser(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kullanıcı silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Yeni Kullanıcı
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.position}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Departman:</span>{' '}
                    {user.department}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">E-posta:</span>{' '}
                    {user.email}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowDeleteConfirm(user.id)}
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

      {/* User Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
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
                    {formData.department && positions[formData.department as keyof typeof positions]?.map(pos => (
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

            {!editingUser && (
              <>
                <div className="space-y-2">
                  <Label>Şifre</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required={!editingUser}
                    minLength={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Şifre Tekrar</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required={!editingUser}
                    minLength={8}
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData(initialFormData);
                  setEditingUser(null);
                }}
              >
                İptal
              </Button>
              <Button type="submit">
                {editingUser ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Silme Onayı</DialogTitle>
          </DialogHeader>
          
          <p>Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}