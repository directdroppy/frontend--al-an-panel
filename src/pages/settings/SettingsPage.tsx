import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Shield, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useState } from 'react';

export function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    investments: true,
    referrals: true,
    achievements: true
  });

  const handleSave = () => {
    toast({
      title: "Ayarlar Kaydedildi",
      description: "Tercihleriniz başarıyla güncellendi."
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ayarlar</h1>
          <p className="text-muted-foreground">Hesap ve uygulama tercihlerinizi yönetin</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="appearance">Görünüm</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
        </TabsList>

        {/* Profil Ayarları */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Ad Soyad</Label>
                <Input defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input defaultValue={user?.email} type="email" />
              </div>
              <div className="space-y-2">
                <Label>Departman</Label>
                <Input defaultValue={user?.department} disabled />
              </div>
              <div className="space-y-2">
                <Label>Pozisyon</Label>
                <Input defaultValue={user?.position} disabled />
              </div>
              <Button onClick={handleSave}>Değişiklikleri Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bildirim Ayarları */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Tercihleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>E-posta Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Önemli güncellemeleri e-posta ile alın
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anlık Bildirimler</Label>
                    <p className="text-sm text-muted-foreground">
                      Tarayıcı bildirimleri ile anında haberdar olun
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Yatırım Güncellemeleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Yatırımlarınızla ilgili bildirimler
                    </p>
                  </div>
                  <Switch
                    checked={notifications.investments}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, investments: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Referans Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Referanslarınızla ilgili güncellemeler
                    </p>
                  </div>
                  <Switch
                    checked={notifications.referrals}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, referrals: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Başarı Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni başarılar kazandığınızda bildirim alın
                    </p>
                  </div>
                  <Switch
                    checked={notifications.achievements}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, achievements: checked }))
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Tercihleri Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Görünüm Ayarları */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Görünüm Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Açık veya koyu tema seçin
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Güvenlik Ayarları */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Mevcut Şifre</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Yeni Şifre</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Yeni Şifre (Tekrar)</Label>
                <Input type="password" />
              </div>
              <Button onClick={handleSave}>Şifreyi Güncelle</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}