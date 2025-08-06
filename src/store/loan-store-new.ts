import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLoanStore = create<LoanStore>()(
  persist(
    (set, get) => ({
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

      updateLoan: (id, updates) =>
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === id
              ? {
                  ...loan,
                  ...updates,
                  remainingAmount: (updates.totalAmount || loan.totalAmount) - (updates.amountPaid || loan.amountPaid),
                  updatedAt: new Date(),
                }
              : loan
          ),
        })),

      deleteLoan: (id) =>
        set((state) => ({
          loans: state.loans.filter((loan) => loan.id !== id),
          loanPayments: state.loanPayments.filter((payment) => payment.loanId !== id),
        })),

      makePayment: (loanId, amount, description = '') => {
        const loan = get().getLoanById(loanId);
        if (!loan) return;

        const newPayment: LoanPayment = {
          id: Date.now().toString(),
          loanId,
          amount,
          paymentDate: new Date(),
          description,
        };

        set((state) => ({
          loanPayments: [...state.loanPayments, newPayment],
          loans: state.loans.map((l) =>
            l.id === loanId
              ? {
                  ...l,
                  amountPaid: l.amountPaid + amount,
                  remainingAmount: l.remainingAmount - amount,
                  updatedAt: new Date(),
                }
              : l
          ),
        }));
      },

      getLoanById: (id) => {
        return get().loans.find((loan) => loan.id === id);
      },

      getLoanSummary: (): LoanSummary => {
        const loans = get().loans;
        
        const totalLoaned = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
        const totalPaid = loans.reduce((sum, loan) => sum + loan.amountPaid, 0);
        const totalRemaining = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
        const monthlyPayments = loans.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0);

        return {
          totalLoans: totalLoaned,
          totalPaid,
          totalRemaining,
          totalMonthlyPayments: monthlyPayments,
          averagePayoffMonths: 0, // Simplified calculation since Loan interface doesn't have duration field
        };
      },

      getLoanPayments: (loanId) => {
        return get().loanPayments
          .filter((payment) => payment.loanId === loanId)
          .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'loan-store',
      partialize: (state) => ({
        loans: state.loans,
        loanPayments: state.loanPayments,
      }),
    }
  )
);
