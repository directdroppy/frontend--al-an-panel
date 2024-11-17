import { motion } from 'framer-motion';
import { GamifiedDashboard } from '@/components/dashboard/GamifiedDashboard';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export function DashboardPage() {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "min-h-screen w-full p-2 sm:p-6 relative",
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
        theme === 'dark' 
          ? "from-slate-900 via-purple-900/20 to-slate-900" 
          : "from-blue-50 via-blue-100/20 to-white"
      )}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

      {/* Glass Morphism Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl sm:rounded-3xl blur-3xl" />
        <div className="relative backdrop-blur-xl bg-background/80 rounded-xl sm:rounded-3xl border border-border/50 shadow-2xl">
          <GamifiedDashboard />
        </div>
      </div>
    </motion.div>
  );
}