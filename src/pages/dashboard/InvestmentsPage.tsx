import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvestmentList } from '@/components/investments/InvestmentList';
import { InvestmentChart } from '@/components/investments/InvestmentChart';
import { mockInvestments, mockInvestmentStats, mockChartData } from '@/data/investments';

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yatırımlar</h1>
      
      <InvestmentChart data={mockChartData} />
      
      <Card>
        <CardHeader>
          <CardTitle>Yatırım Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <InvestmentList investments={mockInvestments} />
        </CardContent>
      </Card>
    </div>
  );
}