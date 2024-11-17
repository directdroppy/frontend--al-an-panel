import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Users, TrendingUp, Settings, Gift, Zap, Crown, Flame, Rocket, Shield, Medal, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import Confetti from 'react-confetti';

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
  'Satış',
  'Yönetim',
  'Finans',
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

export function AchievementsPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Hata",
        description: "Şifre en az 8 karakter olmalıdır.",
        variant: "destructive"
      });
      return;
    }

    // Reset form
    setShowForm(false);
    setFormData(initialFormData);
    setEditingEmployee(null);
  };

  const handlePasswordUpdate = (userId: string) => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      toast({
        title: "Hata",
        description: "Şifre en az 8 karakter olmalıdır.",
        variant: "destructive"
      });
      return;
    }

    setShowForm(false);
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Başarılar</h1>
          <p className="text-muted-foreground">
            Kazandığınız başarıları ve ödülleri görüntüleyin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Başarı İstatistikleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Toplam Başarı</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Aktif Görevler</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Toplam XP</span>
                <span className="text-lg font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Seviye İlerlemesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seviye 1</span>
                <span>0 / 1000 XP</span>
              </div>
              <Progress value={0} />
              <p className="text-sm text-muted-foreground">
                Bir sonraki seviyeye 1000 XP kaldı
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Başarılar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Başarı kartları burada listelenecek */}
            <div className="text-center py-8 text-muted-foreground">
              Henüz başarı kazanılmadı
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Günlük Görevler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Günlük görevler burada listelenecek */}
            <div className="text-center py-8 text-muted-foreground">
              Aktif görev bulunmuyor
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}