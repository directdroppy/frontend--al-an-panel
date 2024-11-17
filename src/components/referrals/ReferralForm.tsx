import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Loader2 } from 'lucide-react';
import { useReferralStore } from '@/lib/referralStore';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

interface ReferralFormProps {
  onClose: () => void;
}

const formSchema = z.object({
  clientName: z.string().min(3, 'İsim en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Geçerli bir telefon numarası giriniz'),
  relationship: z.string().min(2, 'İlişki türü belirtilmelidir'),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const initialFormData: FormData = {
  clientName: '',
  email: '',
  phone: '',
  relationship: '',
  notes: ''
};

export function ReferralForm({ onClose }: ReferralFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const { addReferral } = useReferralStore();
  const { user } = useAuth();

  const validateForm = (): boolean => {
    try {
      formSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setLoading(true);
    try {
      const referral = {
        id: Date.now().toString(),
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        status: 'pending' as const,
        amount: 0, // Will be updated when investment is made
        commission: 0, // Will be calculated when completed
        date: new Date().toISOString(),
        employeeId: user.id,
        employeeName: user.name,
        relationship: formData.relationship,
        notes: formData.notes
      };

      await addReferral(referral);
      onClose();
    } catch (error) {
      console.error('Referans eklenirken hata:', error);
      setErrors({ 
        notes: 'Referans eklenirken bir hata oluştu. Lütfen tekrar deneyin.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Yeni Referans Ekle</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Müşteri Adı</Label>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Müşteri adı ve soyadı"
                error={errors.clientName}
                required
              />
              {errors.clientName && (
                <p className="text-sm text-red-500">{errors.clientName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+90"
                error={errors.phone}
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>E-posta</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="ornek@email.com"
                error={errors.email}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>İlişki Türü</Label>
              <Input
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="Örn: Arkadaş, İş Arkadaşı, Aile"
                error={errors.relationship}
                required
              />
              {errors.relationship && (
                <p className="text-sm text-red-500">{errors.relationship}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notlar</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Referans ile ilgili eklemek istediğiniz notlar..."
              rows={4}
              error={errors.notes}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes}</p>
            )}
          </div>

          <Alert>
            <AlertDescription>
              Referans komisyonu, referans ettiğiniz kişinin yatırımları üzerinden otomatik olarak hesaplanacaktır.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Referans Ekle
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </CardContent>
    </Card>
  );
}