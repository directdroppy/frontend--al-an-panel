import { useAdmin } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Settings, Users, Activity } from 'lucide-react';

export function AdminHeader() {
  const { simulationEnabled, toggleSimulation } = useAdmin();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Sistem yönetimi ve kontrolleri</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="w-4 h-4" />
          Çalışanlar
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Activity className="w-4 h-4" />
          Aktivite
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Ayarlar
        </Button>
        <Button
          variant={simulationEnabled ? "default" : "secondary"}
          size="sm"
          onClick={toggleSimulation}
        >
          {simulationEnabled ? 'Simülasyonu Durdur' : 'Simülasyonu Başlat'}
        </Button>
      </div>
    </div>
  );
}