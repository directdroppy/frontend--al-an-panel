import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentSettings } from '@/components/admin/PaymentSettings';

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
          <p className="text-muted-foreground">Sistem ayarlarını yapılandırın</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="payment">Ödeme</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Minimum Yatırım Tutarı (USDT)</Label>
                <Input type="number" defaultValue="50" />
              </div>

              <div className="space-y-2">
                <Label>Maksimum Yatırım Tutarı (USDT)</Label>
                <Input type="number" defaultValue="100000" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yeni Yatırım Kayıtları</Label>
                  <p className="text-sm text-muted-foreground">
                    Yeni yatırım kayıtlarını geçici olarak durdur
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>İki Faktörlü Doğrulama</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Admin girişlerinde 2FA zorunluluğu
                  </p>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Oturum Süresi (dakika)</Label>
                <Input type="number" defaultValue="60" />
              </div>

              <Button variant="outline" className="w-full">
                Güvenlik Günlüklerini Görüntüle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Yeni Yatırım Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni yatırım talepleri için bildirim al
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kullanıcı Raporları</Label>
                    <p className="text-sm text-muted-foreground">
                      Günlük kullanıcı aktivite raporları
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sistem Uyarıları</Label>
                    <p className="text-sm text-muted-foreground">
                      Kritik sistem uyarılarını al
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}