import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { useSyncManager } from '@/hooks/useSyncManager';
import { useInvestmentSync } from '@/hooks/useInvestmentSync';
import { useReferralSync } from '@/hooks/useReferralSync';
import { useSimulationManager } from '@/hooks/useSimulationManager';

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Initialize sync managers
  useSyncManager();
  useInvestmentSync();
  useReferralSync();
  useSimulationManager();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
      <Toaster />
    </ThemeProvider>
  );
}