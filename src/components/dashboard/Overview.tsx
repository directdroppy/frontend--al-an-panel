import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LiveChart } from '@/components/dashboard/LiveChart';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { DashboardData } from '@/types/dashboard';

interface OverviewProps {
  data: DashboardData;
}

export function Overview({ data }: OverviewProps) {
  return (
    <div className="space-y-4">
      <StatsGrid stats={data.stats} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Yatırım Performansı</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveChart data={data.chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hedef Gerçekleştirme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/* Goal Progress Content */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}