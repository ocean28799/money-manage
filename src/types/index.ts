export interface User {
  id: string;
  name: string;
  email: string;
  monthlySalary: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  source?: 'manual' | 'momo' | 'zalopay' | 'viettelpay' | 'banking' | 'cash';
  sourceTransactionId?: string;
  sourceData?: Record<string, unknown>; // Raw data from the source
  isVerified?: boolean;
  location?: string;
  merchant?: string;
}

// E-wallet integration types
export interface EWalletConnection {
  id: string;
  userId: string;
  provider: 'momo' | 'zalopay' | 'viettelpay' | 'banking';
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  lastSyncAt?: Date;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EWalletTransaction {
  id: string;
  transactionId: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  merchant?: string;
  location?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  category?: string;
  rawData: Record<string, unknown>;
}

export interface SyncResult {
  success: boolean;
  transactionsFound: number;
  transactionsImported: number;
  duplicatesSkipped: number;
  errors: string[];
  lastSyncAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'daily' | 'monthly';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  remainingMoney: number;
  monthlyBudget: number;
}

export interface Debt {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number; // This includes interest already
  interestRate: number; // Annual percentage
  totalMonths: number; // Total duration of the debt in months
  remainingMonths: number; // How many months left to pay
  startDate: Date;
  targetPayoffDate?: Date;
  category: 'credit_card' | 'loan' | 'mortgage' | 'personal' | 'other';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalDebt {
  id: string;
  userId: string;
  name: string; // Name of the person (friend, family member)
  description?: string; // What the debt is for
  totalAmount: number;
  remainingAmount: number;
  startDate: Date;
  category: 'friend' | 'family' | 'colleague' | 'other';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  paymentDate: Date;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
}

export interface PersonalDebtPayment {
  id: string;
  personalDebtId: string;
  amount: number;
  paymentDate: Date;
  description?: string;
  remainingBalance: number;
}

export interface DebtSummary {
  totalDebt: number;
  totalMonthlyPayments: number;
  totalInterestPerMonth: number;
  averagePayoffMonths: number;
  nextMonthPayments: DebtPayment[];
  thisMonthPayments: DebtPayment[];
}

export interface Loan {
  id: string;
  userId: string;
  title: string;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  monthlyPayment?: number;
  interestRate?: number;
  startDate: Date;
  targetPayoffDate?: Date;
  category: 'personal' | 'auto' | 'home' | 'student' | 'business' | 'other';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: Date;
  description?: string;
}

export interface LoanSummary {
  totalLoans: number;
  totalPaid: number;
  totalRemaining: number;
  totalMonthlyPayments: number;
  averagePayoffMonths: number;
}

export interface DashboardStats {
  finance: FinanceSummary;
  tasks: {
    completed: number;
    pending: number;
    overdue: number;
  };
}
