import { create } from 'zustand';
import { Loan, LoanPayment, LoanSummary } from '@/types';

interface LoanStore {
  loans: Loan[];
  loanPayments: LoanPayment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  makePayment: (loanId: string, amount: number, description?: string) => void;
  getLoanById: (id: string) => Loan | undefined;
  getLoanSummary: () => LoanSummary;
  getLoanPayments: (loanId: string) => LoanPayment[];
  initializeMockData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLoanStore = create<LoanStore>((set, get) => ({
  loans: [],
  loanPayments: [],
  isLoading: false,
  error: null,

  addLoan: (loanData) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      remainingAmount: loanData.totalAmount - loanData.amountPaid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      loans: [...state.loans, newLoan],
    }));
  },

  updateLoan: (id, updates) => {
    set((state) => ({
      loans: state.loans.map((loan) => {
        if (loan.id === id) {
          const updatedLoan = { 
            ...loan, 
            ...updates, 
            updatedAt: new Date() 
          };
          // Recalculate remaining amount if totalAmount or amountPaid changed
          if (updates.totalAmount !== undefined || updates.amountPaid !== undefined) {
            updatedLoan.remainingAmount = updatedLoan.totalAmount - updatedLoan.amountPaid;
          }
          return updatedLoan;
        }
        return loan;
      }),
    }));
  },

  deleteLoan: (id) => {
    set((state) => ({
      loans: state.loans.filter((loan) => loan.id !== id),
      loanPayments: state.loanPayments.filter((payment) => payment.loanId !== id),
    }));
  },

  makePayment: (loanId, amount, description) => {
    const loan = get().getLoanById(loanId);
    if (!loan) return;

    const payment: LoanPayment = {
      id: Date.now().toString(),
      loanId,
      amount,
      paymentDate: new Date(),
      description,
    };

    set((state) => ({
      loanPayments: [...state.loanPayments, payment],
      loans: state.loans.map((loan) => {
        if (loan.id === loanId) {
          const newAmountPaid = loan.amountPaid + amount;
          return {
            ...loan,
            amountPaid: newAmountPaid,
            remainingAmount: loan.totalAmount - newAmountPaid,
            updatedAt: new Date(),
          };
        }
        return loan;
      }),
    }));
  },

  getLoanById: (id) => {
    return get().loans.find((loan) => loan.id === id);
  },

  getLoanSummary: () => {
    const { loans } = get();
    const activeLoans = loans.filter((loan) => loan.isActive);

    const totalLoans = activeLoans.reduce((sum, loan) => sum + loan.totalAmount, 0);
    const totalPaid = activeLoans.reduce((sum, loan) => sum + loan.amountPaid, 0);
    const totalRemaining = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
    const totalMonthlyPayments = activeLoans.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0);

    // Calculate average payoff months (simplified calculation)
    const averagePayoffMonths = activeLoans.length > 0 
      ? activeLoans.reduce((sum, loan) => {
          if (loan.monthlyPayment && loan.monthlyPayment > 0) {
            return sum + (loan.remainingAmount / loan.monthlyPayment);
          }
          return sum;
        }, 0) / activeLoans.filter(loan => loan.monthlyPayment && loan.monthlyPayment > 0).length || 0
      : 0;

    return {
      totalLoans,
      totalPaid,
      totalRemaining,
      totalMonthlyPayments,
      averagePayoffMonths: Math.round(averagePayoffMonths),
    };
  },

  getLoanPayments: (loanId) => {
    return get().loanPayments
      .filter((payment) => payment.loanId === loanId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  },

  // Initialize with mock data (you can remove this in production)
  initializeMockData: () => {
    const mockLoans = [
      {
        id: '1',
        userId: '1',
        title: 'Car Loan',
        totalAmount: 25000,
        amountPaid: 5000,
        remainingAmount: 20000,
        monthlyPayment: 450,
        interestRate: 3.5,
        startDate: new Date('2024-01-15'),
        targetPayoffDate: new Date('2029-01-15'),
        category: 'auto' as const,
        description: 'Honda Civic 2024 financing',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-08-01'),
      },
      {
        id: '2',
        userId: '1',
        title: 'Student Loan',
        totalAmount: 45000,
        amountPaid: 12000,
        remainingAmount: 33000,
        monthlyPayment: 320,
        interestRate: 4.2,
        startDate: new Date('2020-09-01'),
        targetPayoffDate: new Date('2030-09-01'),
        category: 'student' as const,
        description: 'Master\'s degree tuition loan',
        isActive: true,
        createdAt: new Date('2020-09-01'),
        updatedAt: new Date('2025-08-01'),
      },
      {
        id: '3',
        userId: '1',
        title: 'Personal Loan',
        totalAmount: 10000,
        amountPaid: 8500,
        remainingAmount: 1500,
        monthlyPayment: 300,
        interestRate: 6.8,
        startDate: new Date('2023-06-01'),
        targetPayoffDate: new Date('2026-06-01'),
        category: 'personal' as const,
        description: 'Home improvement loan',
        isActive: true,
        createdAt: new Date('2023-06-01'),
        updatedAt: new Date('2025-08-01'),
      },
    ];

    const mockPayments = [
      {
        id: '1',
        loanId: '1',
        amount: 450,
        paymentDate: new Date('2025-07-15'),
        description: 'Monthly payment',
      },
      {
        id: '2',
        loanId: '1',
        amount: 450,
        paymentDate: new Date('2025-06-15'),
        description: 'Monthly payment',
      },
      {
        id: '3',
        loanId: '2',
        amount: 320,
        paymentDate: new Date('2025-07-01'),
        description: 'Monthly payment',
      },
      {
        id: '4',
        loanId: '3',
        amount: 300,
        paymentDate: new Date('2025-07-10'),
        description: 'Monthly payment',
      },
      {
        id: '5',
        loanId: '3',
        amount: 500,
        paymentDate: new Date('2025-06-10'),
        description: 'Extra payment to reduce principal',
      },
    ];

    set({ loans: mockLoans, loanPayments: mockPayments });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
