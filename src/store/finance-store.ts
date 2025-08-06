import { create } from 'zustand';
import { Transaction, FinanceSummary } from '@/types';

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
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addTemplate: (template: Omit<TransactionTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  createTransactionFromTemplate: (templateId: string) => void;
  getFinanceSummary: () => FinanceSummary;
  getTransactionsByCategory: () => Record<string, number>;
  getMonthlyData: () => Array<{ month: string; income: number; expenses: number }>;
  getRecentTransactions: (limit?: number) => Transaction[];
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

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [], // Start with empty transactions array
  templates: defaultTemplates,
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        { ...transaction, id: Date.now().toString() },
      ],
    })),

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
        { ...template, id: Date.now().toString() },
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

  getFinanceSummary: () => {
    const { transactions } = get();
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = transactions
      .filter((t) => 
        t.type === 'income' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter((t) => 
        t.type === 'expense' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
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
  },

  getTransactionsByCategory: () => {
    const { transactions } = get();
    const categoryTotals: Record<string, number> = {};
    
    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        categoryTotals[transaction.category] = 
          (categoryTotals[transaction.category] || 0) + transaction.amount;
      }
    });
    
    return categoryTotals;
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
}));
