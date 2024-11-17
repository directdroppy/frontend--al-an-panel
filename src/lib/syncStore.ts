import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { eventBus } from './eventBus';

interface SyncState {
  lastSync: string;
  syncInProgress: boolean;
  pendingUpdates: number;
  startSync: () => void;
  completeSyncItem: () => void;
  resetSync: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      lastSync: new Date().toISOString(),
      syncInProgress: false,
      pendingUpdates: 0,

      startSync: () => {
        set({ syncInProgress: true });
        eventBus.publish('sync-started', null);
      },

      completeSyncItem: () => {
        const { pendingUpdates } = get();
        if (pendingUpdates <= 1) {
          set({
            syncInProgress: false,
            pendingUpdates: 0,
            lastSync: new Date().toISOString()
          });
          eventBus.publish('sync-completed', null);
        } else {
          set(state => ({ pendingUpdates: state.pendingUpdates - 1 }));
        }
      },

      resetSync: () => {
        set({
          syncInProgress: false,
          pendingUpdates: 0,
          lastSync: new Date().toISOString()
        });
      }
    }),
    {
      name: 'sync-store'
    }
  )
);