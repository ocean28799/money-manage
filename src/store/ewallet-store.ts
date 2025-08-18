import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EWalletConnection, SyncResult } from '@/types';
import { eWalletService } from '@/lib/ewallet-service';

interface EWalletStore {
  connections: EWalletConnection[];
  isLoading: boolean;
  syncResults: Record<string, SyncResult>;
  
  // Actions
  addConnection: (connection: EWalletConnection) => void;
  removeConnection: (connectionId: string) => void;
  updateConnection: (connectionId: string, updates: Partial<EWalletConnection>) => void;
  setSyncResult: (connectionId: string, result: SyncResult) => void;
  setLoading: (loading: boolean) => void;
  
  // E-wallet operations
  connectMoMo: (phoneNumber: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  syncWallet: (connectionId: string) => Promise<SyncResult>;
  syncAllWallets: () => Promise<void>;
  disconnectWallet: (connectionId: string) => Promise<boolean>;
  
  // Helper methods
  getActiveConnections: () => EWalletConnection[];
  getConnectionByProvider: (provider: string) => EWalletConnection | undefined;
  getTotalSyncedTransactions: () => number;
}

export const useEWalletStore = create<EWalletStore>()(
  persist(
    (set, get) => ({
      connections: [],
      isLoading: false,
      syncResults: {},

      addConnection: (connection) =>
        set((state) => ({
          connections: [...state.connections, connection],
        })),

      removeConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== connectionId),
        })),

      updateConnection: (connectionId, updates) =>
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === connectionId ? { ...c, ...updates } : c
          ),
        })),

      setSyncResult: (connectionId, result) =>
        set((state) => ({
          syncResults: {
            ...state.syncResults,
            [connectionId]: result,
          },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      connectMoMo: async (phoneNumber, otp) => {
        set({ isLoading: true });
        try {
          const result = await eWalletService.connectMoMo(phoneNumber, otp);
          
          if (result.success && result.connection) {
            get().addConnection(result.connection);
            return { success: true };
          } else {
            return { success: false, error: result.error };
          }
        } catch (error) {
          console.error('Failed to connect to MoMo:', error);
          return { success: false, error: 'Connection failed' };
        } finally {
          set({ isLoading: false });
        }
      },

      syncWallet: async (connectionId) => {
        set({ isLoading: true });
        try {
          const connection = get().connections.find(c => c.id === connectionId);
          if (!connection) {
            throw new Error('Connection not found');
          }

          let result: SyncResult;
          
          switch (connection.provider) {
            case 'momo':
              result = await eWalletService.syncMoMoTransactions(connectionId);
              break;
            default:
              result = {
                success: false,
                transactionsFound: 0,
                transactionsImported: 0,
                duplicatesSkipped: 0,
                errors: ['Provider not supported'],
                lastSyncAt: new Date(),
              };
          }

          get().setSyncResult(connectionId, result);
          
          // Update last sync time
          get().updateConnection(connectionId, { lastSyncAt: result.lastSyncAt });
          
          return result;
        } catch (error) {
          const errorResult: SyncResult = {
            success: false,
            transactionsFound: 0,
            transactionsImported: 0,
            duplicatesSkipped: 0,
            errors: [String(error)],
            lastSyncAt: new Date(),
          };
          
          get().setSyncResult(connectionId, errorResult);
          return errorResult;
        } finally {
          set({ isLoading: false });
        }
      },

      syncAllWallets: async () => {
        set({ isLoading: true });
        try {
          const activeConnections = get().getActiveConnections();
          
          for (const connection of activeConnections) {
            await get().syncWallet(connection.id);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      disconnectWallet: async (connectionId) => {
        try {
          const success = await eWalletService.disconnectWallet(connectionId);
          if (success) {
            get().updateConnection(connectionId, { isActive: false });
          }
          return success;
        } catch (error) {
          console.error('Failed to disconnect wallet:', error);
          return false;
        }
      },

      getActiveConnections: () => {
        return get().connections.filter(c => c.isActive);
      },

      getConnectionByProvider: (provider) => {
        return get().connections.find(c => c.provider === provider && c.isActive);
      },

      getTotalSyncedTransactions: () => {
        const { syncResults } = get();
        return Object.values(syncResults).reduce((total, result) => {
          return total + result.transactionsImported;
        }, 0);
      },
    }),
    {
      name: 'ewallet-store',
      partialize: (state) => ({
        connections: state.connections,
        syncResults: state.syncResults,
      }),
      version: 1,
    }
  )
);
