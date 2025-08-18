import { EWalletConnection, SyncResult, Transaction } from '@/types';

// Mock API responses for demonstration (in real implementation, these would be actual API calls)
interface MoMoTransaction {
  id: string;
  amount: number;
  description: string;
  transTime: string;
  transType: 'DEBIT' | 'CREDIT';
  partnerName?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

interface MoMoAuthResponse {
  errorCode: number;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

// Category mapping for automatic categorization
const CATEGORY_MAPPING: Record<string, string> = {
  // Food & Beverage
  'cong ca phe': 'coffee',
  'highlands coffee': 'coffee',
  'starbucks': 'coffee',
  'phuc long': 'coffee',
  'grab food': 'food',
  'now food': 'food',
  'shopee food': 'food',
  'gojek food': 'food',
  'lotteria': 'food',
  'mcdonalds': 'food',
  'kfc': 'food',
  'pizza': 'food',
  'com tam': 'food',
  'bun bo': 'food',
  'pho': 'food',
  
  // Transportation
  'grab': 'transportation',
  'be': 'transportation',
  'gojek': 'transportation',
  'uber': 'transportation',
  'petrolimex': 'oil',
  'petro': 'oil',
  'shell': 'oil',
  'chevron': 'oil',
  
  // Shopping
  'shopee': 'shopping',
  'lazada': 'shopping',
  'tiki': 'shopping',
  'sendo': 'shopping',
  'vinmart': 'shopping',
  'circle k': 'shopping',
  'family mart': 'shopping',
  'gs25': 'shopping',
  
  // Entertainment
  'cgv': 'entertain',
  'lotte cinema': 'entertain',
  'galaxy cinema': 'entertain',
  'netflix': 'entertain',
  'spotify': 'entertain',
  
  // Utilities
  'evn': 'utilities',
  'saigon water': 'utilities',
  'viettel': 'utilities',
  'mobifone': 'utilities',
  'vinaphone': 'utilities',
  
  // Income indicators
  'luong': 'salary',
  'salary': 'salary',
  'thuong': 'bonus',
  'bonus': 'bonus',
};

export class EWalletService {
  private static instance: EWalletService;
  private connections: Map<string, EWalletConnection> = new Map();

  static getInstance(): EWalletService {
    if (!EWalletService.instance) {
      EWalletService.instance = new EWalletService();
    }
    return EWalletService.instance;
  }

  // Initialize with stored connections
  async initialize(): Promise<void> {
    try {
      const stored = localStorage.getItem('ewallet-connections');
      if (stored) {
        const connections: EWalletConnection[] = JSON.parse(stored);
        connections.forEach(conn => {
          this.connections.set(conn.id, {
            ...conn,
            createdAt: new Date(conn.createdAt),
            updatedAt: new Date(conn.updatedAt),
            lastSyncAt: conn.lastSyncAt ? new Date(conn.lastSyncAt) : undefined,
            expiresAt: conn.expiresAt ? new Date(conn.expiresAt) : undefined,
          });
        });
      }
    } catch (error) {
      console.error('Failed to initialize e-wallet connections:', error);
    }
  }

  // Save connections to storage
  private saveConnections(): void {
    try {
      const connections = Array.from(this.connections.values());
      localStorage.setItem('ewallet-connections', JSON.stringify(connections));
    } catch (error) {
      console.error('Failed to save e-wallet connections:', error);
    }
  }

  // Connect to MoMo (mock implementation)
  async connectMoMo(phoneNumber: string, otp: string): Promise<{ success: boolean; connection?: EWalletConnection; error?: string }> {
    try {
      // Mock OTP validation
      if (otp !== '123456') {
        return { success: false, error: 'Invalid OTP code' };
      }

      // Mock API call to MoMo
      const mockResponse = await this.mockMoMoAuth(phoneNumber, otp);
      
      if (mockResponse.errorCode !== 0) {
        return { success: false, error: mockResponse.message };
      }

      const connection: EWalletConnection = {
        id: `momo_${Date.now()}`,
        userId: '1', // Current user ID
        provider: 'momo',
        accountNumber: phoneNumber,
        accountName: `MoMo Account (${phoneNumber})`,
        isActive: true,
        accessToken: mockResponse.accessToken,
        refreshToken: mockResponse.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.connections.set(connection.id, connection);
      this.saveConnections();

      return { success: true, connection };
    } catch (error) {
      console.error('MoMo connection failed:', error);
      return { success: false, error: 'Connection failed. Please try again.' };
    }
  }

  // Sync transactions from MoMo
  async syncMoMoTransactions(connectionId: string, fromDate?: Date): Promise<SyncResult> {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.provider !== 'momo' || !connection.isActive) {
      return {
        success: false,
        transactionsFound: 0,
        transactionsImported: 0,
        duplicatesSkipped: 0,
        errors: ['Invalid or inactive MoMo connection'],
        lastSyncAt: new Date(),
      };
    }

    try {
      const startDate = fromDate || connection.lastSyncAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const transactions = await this.fetchMoMoTransactions(connection, startDate);
      
      const result: SyncResult = {
        success: true,
        transactionsFound: transactions.length,
        transactionsImported: 0,
        duplicatesSkipped: 0,
        errors: [],
        lastSyncAt: new Date(),
      };

      // Process each transaction
      for (const transaction of transactions) {
        try {
          const converted = this.convertMoMoTransaction(transaction, connectionId);
          
          // Check for duplicates (in real app, this would check against database)
          const isDuplicate = this.checkDuplicate(converted);
          
          if (isDuplicate) {
            result.duplicatesSkipped++;
          } else {
            // Import transaction (in real app, this would save to database)
            await this.importTransaction(converted);
            result.transactionsImported++;
          }
        } catch (error) {
          result.errors.push(`Failed to process transaction ${transaction.id}: ${error}`);
        }
      }

      // Update last sync time
      connection.lastSyncAt = result.lastSyncAt;
      this.connections.set(connectionId, connection);
      this.saveConnections();

      return result;
    } catch (error) {
      console.error('MoMo sync failed:', error);
      return {
        success: false,
        transactionsFound: 0,
        transactionsImported: 0,
        duplicatesSkipped: 0,
        errors: [`Sync failed: ${error}`],
        lastSyncAt: new Date(),
      };
    }
  }

  // Get all connections
  getConnections(): EWalletConnection[] {
    return Array.from(this.connections.values());
  }

  // Remove connection
  async disconnectWallet(connectionId: string): Promise<boolean> {
    try {
      const connection = this.connections.get(connectionId);
      if (connection) {
        connection.isActive = false;
        this.connections.set(connectionId, connection);
        this.saveConnections();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return false;
    }
  }

  // Mock MoMo authentication
  private async mockMoMoAuth(_phoneNumber: string, _otp: string): Promise<MoMoAuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      errorCode: 0,
      message: 'Success',
      accessToken: `momo_token_${Date.now()}`,
      refreshToken: `momo_refresh_${Date.now()}`,
    };
  }

  // Mock MoMo transaction fetching
  private async fetchMoMoTransactions(_connection: EWalletConnection, _fromDate: Date): Promise<MoMoTransaction[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock transaction data
    const mockTransactions: MoMoTransaction[] = [
      {
        id: 'momo_txn_1',
        amount: -45000,
        description: 'Cong Ca Phe Nguyen Du',
        transTime: new Date().toISOString(),
        transType: 'DEBIT',
        partnerName: 'Cong Ca Phe',
        status: 'SUCCESS',
      },
      {
        id: 'momo_txn_2',
        amount: -120000,
        description: 'Grab Food - Com Tam Ba Ghien',
        transTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        transType: 'DEBIT',
        partnerName: 'Grab',
        status: 'SUCCESS',
      },
      {
        id: 'momo_txn_3',
        amount: -300000,
        description: 'Circle K - Snacks and drinks',
        transTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        transType: 'DEBIT',
        partnerName: 'Circle K',
        status: 'SUCCESS',
      },
      {
        id: 'momo_txn_4',
        amount: 500000,
        description: 'Chuyen tien tu ban - Tra no',
        transTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        transType: 'CREDIT',
        status: 'SUCCESS',
      },
    ];

    return mockTransactions;
  }

  // Convert MoMo transaction to app transaction
  private convertMoMoTransaction(momoTxn: MoMoTransaction, _connectionId: string): Transaction {
    const description = momoTxn.description.toLowerCase();
    let category = 'other';
    
    // Auto-categorize based on description
    for (const [keyword, cat] of Object.entries(CATEGORY_MAPPING)) {
      if (description.includes(keyword)) {
        category = cat;
        break;
      }
    }

    return {
      id: `imported_${momoTxn.id}`,
      userId: '1',
      type: momoTxn.transType === 'CREDIT' ? 'income' : 'expense',
      amount: Math.abs(momoTxn.amount),
      category,
      description: momoTxn.description,
      date: new Date(momoTxn.transTime),
      source: 'momo',
      sourceTransactionId: momoTxn.id,
      sourceData: momoTxn as unknown as Record<string, unknown>,
      isVerified: momoTxn.status === 'SUCCESS',
      merchant: momoTxn.partnerName,
    };
  }

  // Check for duplicate transactions
  private checkDuplicate(transaction: Transaction): boolean {
    // In real implementation, this would check against the database
    // For now, we'll check localStorage
    try {
      const stored = localStorage.getItem('finance-store');
      if (!stored) return false;
      
      const financeStore = JSON.parse(stored);
      if (!financeStore.state?.transactions) return false;
      
      const existingTransactions = financeStore.state.transactions;
      return existingTransactions.some((t: Transaction) => 
        t.sourceTransactionId === transaction.sourceTransactionId && 
        t.source === transaction.source
      );
    } catch {
      return false;
    }
  }

  // Import transaction to the app
  private async importTransaction(transaction: Transaction): Promise<void> {
    // Dispatch to finance store
    // This would be replaced with actual store dispatch in real implementation
    try {
      const event = new CustomEvent('ewallet-transaction-import', {
        detail: transaction
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to import transaction:', error);
      throw error;
    }
  }

  // Auto-sync all active connections
  async autoSyncAll(): Promise<Record<string, SyncResult>> {
    const results: Record<string, SyncResult> = {};
    
    for (const connection of this.connections.values()) {
      if (!connection.isActive) continue;
      
      try {
        let result: SyncResult;
        
        switch (connection.provider) {
          case 'momo':
            result = await this.syncMoMoTransactions(connection.id);
            break;
          case 'zalopay':
            // Implement ZaloPay sync
            result = { success: false, transactionsFound: 0, transactionsImported: 0, duplicatesSkipped: 0, errors: ['ZaloPay not implemented yet'], lastSyncAt: new Date() };
            break;
          case 'viettelpay':
            // Implement ViettelPay sync
            result = { success: false, transactionsFound: 0, transactionsImported: 0, duplicatesSkipped: 0, errors: ['ViettelPay not implemented yet'], lastSyncAt: new Date() };
            break;
          default:
            result = { success: false, transactionsFound: 0, transactionsImported: 0, duplicatesSkipped: 0, errors: ['Unsupported provider'], lastSyncAt: new Date() };
        }
        
        results[connection.id] = result;
      } catch (error) {
        results[connection.id] = {
          success: false,
          transactionsFound: 0,
          transactionsImported: 0,
          duplicatesSkipped: 0,
          errors: [`Auto-sync failed: ${error}`],
          lastSyncAt: new Date(),
        };
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const eWalletService = EWalletService.getInstance();
