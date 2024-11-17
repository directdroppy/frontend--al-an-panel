import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PerformanceRingProps {
  value: number;
  color: string;
}

export function PerformanceRing({ value, color }: PerformanceRingProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = (100 - value) / 100 * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-muted stroke-current"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="32"
          cy="32"
        />
        <motion.circle
          className={cn("stroke-current", color)}
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="32"
          cy="32"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  );
}