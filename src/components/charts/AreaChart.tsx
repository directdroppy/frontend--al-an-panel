import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';

interface ChartLine {
  dataKey: string;
  name: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

interface AreaChartProps {
  title: string;
  data: any[];
  xAxisKey: string;
  lines: ChartLine[];
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
}

export function AreaChart({
  title,
  data,
  xAxisKey,
  lines,
  xAxisFormatter = (value) => value,
  yAxisFormatter = (value) => value.toString(),
}: AreaChartProps) {
  const commonAxisProps = {
    stroke: "hsl(var(--muted-foreground))",
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={data}>
              <defs>
                {lines.map((line) => (
                  <linearGradient
                    key={`gradient-${line.dataKey}`}
                    id={`gradient-${line.dataKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={line.gradientFrom}
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor={line.gradientTo}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                {...commonAxisProps}
                dataKey={xAxisKey}
                tickFormatter={xAxisFormatter}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                {...commonAxisProps}
                tickFormatter={yAxisFormatter}
                width={80}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    payload={payload}
                    label={label}
                    formatter={yAxisFormatter}
                  />
                )}
              />
              {lines.map((line) => (
                <Area
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.color}
                  fill={`url(#gradient-${line.dataKey})`}
                  strokeWidth={2}
                />
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}