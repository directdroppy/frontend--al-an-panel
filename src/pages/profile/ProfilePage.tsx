import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Building, Briefcase, Calendar, Edit2, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleImageUpload = () => {
    // Profil resmi yükleme işlemi
    toast({
      title: "Yakında",
      description: "Profil resmi yükleme özelliği yakında eklenecektir.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Başarılı",
      description: "Profil bilgileriniz güncellendi.",
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-muted-foreground">
          Kişisel bilgilerinizi görüntüleyin ve düzenleyin
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profil Kartı */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="text-4xl">
                      {user?.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0"
                    onClick={handleImageUpload}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="mt-4 text-xl font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">{user?.role === 'admin' ? 'Yönetici' : 'Çalışan'}</Badge>
                  <Badge variant="outline">{user?.department}</Badge>
                </div>

                <div className="mt-6 w-full space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Departman:</span>
                    <span className="font-medium">{user?.department}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Pozisyon:</span>
                    <span className="font-medium">{user?.position}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Katılım:</span>
                    <span className="font-medium">
                      {format(new Date(), 'PP', { locale: tr })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profil Düzenleme */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-primary" />
                Profil Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Ad Soyad</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        defaultValue={user?.name}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        defaultValue={user?.email}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Departman</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        defaultValue={user?.department}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pozisyon</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        defaultValue={user?.position}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    onClick={handleSave}
                  >
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}