import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, FinanceSummary } from '@/types';

// Simple ID generator for client-side
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Helper to ensure date objects are properly handled
const ensureDate = (date: Date | string): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

// Helper to validate and sanitize transaction with enhanced backward compatibility
const sanitizeTransaction = (transaction: unknown): Transaction | null => {
  try {
    if (!transaction || typeof transaction !== 'object') return null;
    
    const t = transaction as Record<string, unknown>;
    
    // Handle legacy date formats and ensure proper date handling
    let transactionDate: Date;
    if (t.date instanceof Date) {
      transactionDate = t.date;
    } else if (typeof t.date === 'string') {
      transactionDate = new Date(t.date);
      // If invalid date, use current date
      if (isNaN(transactionDate.getTime())) {
        transactionDate = new Date();
      }
    } else if (typeof t.date === 'number') {
      transactionDate = new Date(t.date);
    } else {
      transactionDate = new Date();
    }
    
    // Handle legacy amount formats
    let amount = 0;
    if (typeof t.amount === 'number' && !isNaN(t.amount)) {
      amount = t.amount;
    } else if (typeof t.amount === 'string') {
      const parsed = parseFloat(t.amount);
      amount = !isNaN(parsed) ? parsed : 0;
    }
    
    return {
      id: typeof t.id === 'string' && t.id ? t.id : generateId(),
      userId: typeof t.userId === 'string' ? t.userId : '1', // Default userId for backward compatibility
      date: transactionDate,
      amount: amount,
      type: t.type === 'income' || t.type === 'expense' ? t.type as 'income' | 'expense' : 'expense',
      category: typeof t.category === 'string' && t.category ? t.category : 'other',
      description: typeof t.description === 'string' ? t.description : '',
    };
  } catch (error) {
    console.warn('Error sanitizing transaction:', error);
    return null;
  }
};

interface TransactionTemplate {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  isRecurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

interface FinanceStore {
  transactions: Transaction[];
  templates: TransactionTemplate[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addEWalletTransaction: (transaction: Transaction) => void; // New method for e-wallet imports
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addTemplate: (template: Omit<TransactionTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  createTransactionFromTemplate: (templateId: string) => void;
  getFinanceSummary: () => FinanceSummary;
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getFinanceSummaryForPeriod: (transactions: Transaction[]) => FinanceSummary;
  getTransactionsByCategory: () => Record<string, number>;
  getMonthlyData: () => Array<{ month: string; income: number; expenses: number }>;
  getRecentTransactions: (limit?: number) => Transaction[];
  getEWalletTransactions: () => Transaction[]; // New method to get e-wallet transactions
}

// Default templates for common transactions
const defaultTemplates: TransactionTemplate[] = [
  {
    id: '1',
    name: 'Morning Coffee',
    category: 'coffee',
    amount: 25000,
    type: 'expense',
    description: 'Daily coffee',
    isRecurring: true,
    frequency: 'daily',
  },
  {
    id: '2',
    name: 'Lunch',
    category: 'food',
    amount: 50000,
    type: 'expense',
    description: 'Daily lunch',
    isRecurring: true,
    frequency: 'daily',
  },
  {
    id: '3',
    name: 'Gas Fill-up',
    category: 'oil',
    amount: 500000,
    type: 'expense',
    description: 'Weekly gas',
    isRecurring: true,
    frequency: 'weekly',
  },
  {
    id: '4',
    name: 'Grocery Shopping',
    category: 'shopping',
    amount: 800000,
    type: 'expense',
    description: 'Weekly groceries',
    isRecurring: true,
    frequency: 'weekly',
  },
  {
    id: '5',
    name: 'Monthly Salary',
    category: 'salary',
    amount: 24800000,
    type: 'income',
    description: 'Monthly salary',
    isRecurring: true,
    frequency: 'monthly',
  },
];

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: [], // Start with empty transactions array
      templates: defaultTemplates,
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        { ...transaction, id: generateId() },
      ],
    })),

  addEWalletTransaction: (transaction) =>
    set((state) => {
      // Check for duplicates based on sourceTransactionId
      const isDuplicate = state.transactions.some(t => 
        t.sourceTransactionId === transaction.sourceTransactionId && 
        t.source === transaction.source
      );
      
      if (isDuplicate) {
        console.warn('Duplicate e-wallet transaction skipped:', transaction.sourceTransactionId);
        return state;
      }
      
      return {
        transactions: [...state.transactions, transaction],
      };
    }),

  updateTransaction: (id, updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updatedTransaction } : t
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addTemplate: (template) =>
    set((state) => ({
      templates: [
        ...state.templates,
        { ...template, id: generateId() },
      ],
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    })),

  createTransactionFromTemplate: (templateId) => {
    const { templates, addTransaction } = get();
    const template = templates.find(t => t.id === templateId);
    if (template) {
      addTransaction({
        type: template.type,
        category: template.category,
        amount: template.amount,
        description: template.description,
        date: new Date(),
        userId: '1',
      });
    }
  },

  getRecentTransactions: (limit = 10) => {
    const { transactions } = get();
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  getTransactionsByDateRange: (startDate: Date, endDate: Date) => {
    const { transactions } = get();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  },

  getTransactionsByMonth: (month: number, year: number) => {
    const { transactions } = get();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
  },

  getFinanceSummaryForPeriod: (periodTransactions: Transaction[]) => {
    try {
      if (!Array.isArray(periodTransactions)) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          balance: 0,
          monthlyIncome: 0,
          monthlyExpenses: 0,
          remainingMoney: 0,
          monthlyBudget: 0,
        };
      }
      
      const totalIncome = periodTransactions
        .filter((t) => t && t.type === 'income' && typeof t.amount === 'number')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = periodTransactions
        .filter((t) => t && t.type === 'expense' && typeof t.amount === 'number')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses,
        remainingMoney: totalIncome - totalExpenses,
        monthlyBudget: totalIncome,
      };
    } catch (error) {
      console.error('Error in getFinanceSummaryForPeriod:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        remainingMoney: 0,
        monthlyBudget: 0,
      };
    }
  },

  getFinanceSummary: () => {
    try {
      const { transactions } = get();
      
      // Ensure transactions is an array
      if (!Array.isArray(transactions)) {
        console.warn('Transactions is not an array, returning default summary');
        return {
          totalIncome: 0,
          totalExpenses: 0,
          balance: 0,
          monthlyIncome: 0,
          monthlyExpenses: 0,
          remainingMoney: 0,
          monthlyBudget: 0,
        };
      }
      
      const totalIncome = transactions
        .filter((t) => t && t.type === 'income' && typeof t.amount === 'number')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter((t) => t && t.type === 'expense' && typeof t.amount === 'number')
        .reduce((sum, t) => sum + t.amount, 0);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyIncome = transactions
        .filter((t) => {
          try {
            const date = ensureDate(t.date);
            return t && t.type === 'income' && 
                   !isNaN(date.getTime()) &&
                   date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear &&
                   typeof t.amount === 'number';
          } catch {
            return false;
          }
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = transactions
        .filter((t) => {
          try {
            const date = ensureDate(t.date);
            return t && t.type === 'expense' && 
                   !isNaN(date.getTime()) &&
                   date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear &&
                   typeof t.amount === 'number';
          } catch {
            return false;
          }
        })
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate remaining money for this month
      const monthlyBudget = monthlyIncome; // Assuming budget equals monthly income
      const remainingMoney = monthlyBudget - monthlyExpenses;

      return {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        remainingMoney,
        monthlyBudget,
      };
    } catch (error) {
      console.error('Error in getFinanceSummary:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        remainingMoney: 0,
        monthlyBudget: 0,
      };
    }
  },

    getTransactionsByCategory: () => {
    try {
      const { transactions } = get();
      
      if (!Array.isArray(transactions)) {
        return {};
      }
      
      const categoryTotals: Record<string, number> = {};
      
      transactions.forEach((transaction) => {
        try {
          if (transaction && 
              transaction.type === 'expense' && 
              typeof transaction.amount === 'number' && 
              typeof transaction.category === 'string') {
            if (categoryTotals[transaction.category]) {
              categoryTotals[transaction.category] += transaction.amount;
            } else {
              categoryTotals[transaction.category] = transaction.amount;
            }
          }
        } catch (error) {
          console.warn('Error processing transaction:', transaction, error);
        }
      });
      
      return categoryTotals;
    } catch (error) {
      console.error('Error in getTransactionsByCategory:', error);
      return {};
    }
  },

  getMonthlyData: () => {
    const { transactions } = get();
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    
    transactions.forEach((transaction) => {
      const monthKey = transaction.date.toLocaleString('default', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  },

  getEWalletTransactions: () => {
    const { transactions } = get();
    return transactions.filter(t => 
      t.source && t.source !== 'manual' && t.source !== 'cash'
    );
  },
}),
{
  name: 'finance-store',
  // Enhanced error handling and migration for persistence
  onRehydrateStorage: () => (state, error) => {
    if (error) {
      console.error('Error rehydrating finance store:', error);
      // Reset to default state if there's an error
      return {
        transactions: [],
        templates: defaultTemplates,
      };
    }
    
    if (!state) {
      console.warn('No stored state found, using defaults');
      return {
        transactions: [],
        templates: defaultTemplates,
      };
    }
    
    // Enhanced data migration and sanitization after rehydration
    let sanitizedTransactions: Transaction[] = [];
    if (Array.isArray(state.transactions)) {
      sanitizedTransactions = state.transactions
        .map(sanitizeTransaction)
        .filter(Boolean) as Transaction[];
    }
    
    // Ensure templates exist and are valid
    let validTemplates = defaultTemplates;
    if (Array.isArray(state.templates) && state.templates.length > 0) {
      validTemplates = [...defaultTemplates, ...state.templates.filter(template => 
        template && typeof template === 'object' && 
        typeof template.id === 'string' &&
        typeof template.name === 'string'
      )];
    }
    
    console.log(`✅ Rehydrated ${sanitizedTransactions.length} transactions and ${validTemplates.length} templates`);
    
    return {
      ...state,
      transactions: sanitizedTransactions,
      templates: validTemplates,
    };
  },
  // Persist all store data with validation
  partialize: (state) => {
    try {
      return {
        transactions: Array.isArray(state.transactions) ? state.transactions : [],
        templates: Array.isArray(state.templates) ? state.templates : defaultTemplates,
      };
    } catch (error) {
      console.error('Error partializing state:', error);
      return {
        transactions: [],
        templates: defaultTemplates,
      };
    }
  },
  // Add version for migration support
  version: 2, // Increased version for enhanced migration
  migrate: (persistedState: unknown, version: number) => {
    // Migration logic for older versions
    if (version < 2) {
      console.log('Migrating finance store from version', version, 'to 2');
      if (persistedState && typeof persistedState === 'object') {
        const state = persistedState as Record<string, unknown>;
        // Ensure transactions array exists
        if (!Array.isArray(state.transactions)) {
          state.transactions = [];
        }
        // Ensure templates exist
        if (!Array.isArray(state.templates)) {
          state.templates = defaultTemplates;
        }
        // Sanitize all existing transactions
        if (Array.isArray(state.transactions)) {
          state.transactions = state.transactions
            .map(sanitizeTransaction)
            .filter(Boolean);
        }
        return state;
      }
    }
    return persistedState;
  },
}
));
