import { SimpleAreaChart } from '@/components/charts/SimpleAreaChart';

const data = [
  { label: 'Oca', value: 0 },
  { label: 'Şub', value: 0 },
  { label: 'Mar', value: 0 },
  { label: 'Nis', value: 0 },
  { label: 'May', value: 0 },
  { label: 'Haz', value: 0 },
];

export function ReferralChart() {
  return (
    <SimpleAreaChart 
      data={data.map(d => ({
        label: d.label,
        value: d.value
      }))}
      height={300}
    />
  );
}