import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useSyncStore } from '@/lib/syncStore';

export function SyncIndicator() {
  const { syncInProgress } = useSyncStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (syncInProgress) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [syncInProgress]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Senkronize ediliyor...</span>
      </div>
    </motion.div>
  );
}