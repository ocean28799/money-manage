import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Loan, LoanPayment, LoanSummary } from '@/types';

interface LoanStore {
  loans: Loan[];
  loanPayments: LoanPayment[];
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  makePayment: (loanId: string, amount: number, description?: string) => void;
  getLoanSummary: () => LoanSummary;
  getLoanPayments: (loanId: string) => LoanPayment[];
}

export const useLoanStore = create<LoanStore>()(
  persist(
    (set, get) => ({
      loans: [],
      loanPayments: [],

      addLoan: (loanData) => {
        const newLoan: Loan = {
          ...loanData,
          id: Date.now().toString(),
          amountPaid: 0,
          remainingAmount: loanData.totalAmount,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          loans: [...state.loans, newLoan],
        }));
      },

      updateLoan: (id, updates) => {
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === id
              ? {
                  ...loan,
                  ...updates,
                  updatedAt: new Date(),
                }
              : loan
          ),
        }));
      },

      deleteLoan: (id) => {
        set((state) => ({
          loans: state.loans.filter((loan) => loan.id !== id),
          loanPayments: state.loanPayments.filter((payment) => payment.loanId !== id),
        }));
      },

      makePayment: (loanId, amount, description) => {
        const { loans } = get();
        const loan = loans.find((l) => l.id === loanId);
        
        if (!loan) return;

        const newPayment: LoanPayment = {
          id: Date.now().toString(),
          loanId,
          amount,
          paymentDate: new Date(),
          description,
        };

        // Update loan amounts
        const updatedAmountPaid = loan.amountPaid + amount;
        const updatedRemainingAmount = loan.totalAmount - updatedAmountPaid;

        set((state) => ({
          loanPayments: [...state.loanPayments, newPayment],
          loans: state.loans.map((l) =>
            l.id === loanId
              ? {
                  ...l,
                  amountPaid: updatedAmountPaid,
                  remainingAmount: updatedRemainingAmount,
                  isActive: updatedRemainingAmount > 0,
                  updatedAt: new Date(),
                }
              : l
          ),
        }));
      },

      getLoanSummary: (): LoanSummary => {
        const { loans } = get();
        
        const totalLoaned = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
        const totalPaid = loans.reduce((sum, loan) => sum + loan.amountPaid, 0);
        const totalRemaining = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
        const monthlyPayments = loans.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0);

        return {
          totalLoans: totalLoaned,
          totalPaid,
          totalRemaining,
          totalMonthlyPayments: monthlyPayments,
          averagePayoffMonths: 0, // Simplified calculation
        };
      },

      getLoanPayments: (loanId) => {
        return get().loanPayments.filter((payment) => payment.loanId === loanId);
      },
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
