import { SimpleAreaChart } from '@/components/charts/SimpleAreaChart';
import { InvestmentChartData } from '@/types/investment';
import { formatCurrency } from '@/lib/utils';

interface InvestmentChartProps {
  data: InvestmentChartData[];
}

export function InvestmentChart({ data }: InvestmentChartProps) {
  return (
    <SimpleAreaChart 
      data={data.map(d => ({
        label: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(new Date(d.date)),
        value: d.amount
      }))}
      height={300}
    />
  );
}