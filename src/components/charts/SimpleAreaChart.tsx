import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SimpleAreaChartProps {
  data: { value: number; label: string }[];
  height?: number;
  className?: string;
}

export function SimpleAreaChart({ data, height = 200, className }: SimpleAreaChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1; // Prevent division by zero

  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * 100; // Prevent division by zero
    const y = maxValue === minValue ? 50 : 100 - ((d.value - minValue) / range) * 100; // Default to middle if no range
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className={cn("p-6", className)}>
      <CardContent className="p-0">
        <div style={{ height }} className="relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Area */}
            <path
              d={`M 0,100 L ${points} L 100,100 Z`}
              fill="hsl(var(--primary))"
              fillOpacity={0.1}
            />

            {/* Line */}
            <path
              d={`M ${points}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Points */}
            {data.map((d, i) => {
              const x = (i / Math.max(1, data.length - 1)) * 100;
              const y = maxValue === minValue ? 50 : 100 - ((d.value - minValue) / range) * 100;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="hsl(var(--primary))"
                  className="hover:r-3 transition-all duration-200"
                >
                  <title>{`${d.label}: ${d.value}`}</title>
                </circle>
              );
            })}
          </svg>

          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            {data.map((d, i) => (
              <div key={i} className="text-center">
                {d.label}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}