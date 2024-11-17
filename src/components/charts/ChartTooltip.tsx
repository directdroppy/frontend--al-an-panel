import { Card, CardContent } from '@/components/ui/card';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
  formatter?: (value: any) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter = (value) => value.toString(),
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-2">
        <div className="text-sm font-medium mb-1">{label}</div>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}:
              </span>
              <span className="text-sm font-medium">
                {formatter(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}