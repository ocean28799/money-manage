import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalDebt, PersonalDebtPayment } from '@/types';

interface PersonalDebtStore {
  personalDebts: PersonalDebt[];
  personalDebtPayments: PersonalDebtPayment[];
  
  // Personal Debt Management
  addPersonalDebt: (debt: Omit<PersonalDebt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePersonalDebt: (id: string, debt: Partial<PersonalDebt>) => void;
  deletePersonalDebt: (id: string) => void;
  
  // Payment Management
  addPersonalDebtPayment: (payment: Omit<PersonalDebtPayment, 'id'>) => void;
  getPersonalDebtPayments: (personalDebtId: string) => PersonalDebtPayment[];
  
  // Getters
  getPersonalDebtById: (id: string) => PersonalDebt | undefined;
  getPersonalDebtSummary: () => {
    totalPersonalDebt: number;
    totalPaidAmount: number;
    activeDebtsCount: number;
    paidOffDebtsCount: number;
  };
}

export const usePersonalDebtStore = create<PersonalDebtStore>()(
  persist(
    (set, get) => ({
      personalDebts: [],
      personalDebtPayments: [],

      addPersonalDebt: (debt) => {
        const newDebt: PersonalDebt = {
          ...debt,
          id: Date.now().toString(),
          remainingAmount: debt.totalAmount,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          personalDebts: [...state.personalDebts, newDebt],
        }));
      },

      updatePersonalDebt: (id, updatedDebt) =>
        set((state) => ({
          personalDebts: state.personalDebts.map((debt) =>
            debt.id === id
              ? {
                  ...debt,
                  ...updatedDebt,
                  updatedAt: new Date(),
                }
              : debt
          ),
        })),

      deletePersonalDebt: (id) =>
        set((state) => ({
          personalDebts: state.personalDebts.filter((debt) => debt.id !== id),
          personalDebtPayments: state.personalDebtPayments.filter(
            (payment) => payment.personalDebtId !== id
          ),
        })),

      addPersonalDebtPayment: (payment) => {
        const personalDebt = get().personalDebts.find(d => d.id === payment.personalDebtId);
        if (!personalDebt) return;

        const newRemainingBalance = Math.max(0, personalDebt.remainingAmount - payment.amount);
        
        const newPayment: PersonalDebtPayment = {
          ...payment,
          id: Date.now().toString(),
          remainingBalance: newRemainingBalance,
        };

        // Update the personal debt's remaining amount
        get().updatePersonalDebt(payment.personalDebtId, {
          remainingAmount: newRemainingBalance,
          isActive: newRemainingBalance > 0,
        });

        set((state) => ({
          personalDebtPayments: [...state.personalDebtPayments, newPayment],
        }));
      },

      getPersonalDebtPayments: (personalDebtId) => {
        return get().personalDebtPayments
          .filter(payment => payment.personalDebtId === personalDebtId)
          .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
      },

      getPersonalDebtById: (id) => {
        return get().personalDebts.find((debt) => debt.id === id);
      },

      getPersonalDebtSummary: () => {
        const debts = get().personalDebts;
        const payments = get().personalDebtPayments;
        
        const totalPersonalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
        const totalPaidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const activeDebtsCount = debts.filter(debt => debt.isActive).length;
        const paidOffDebtsCount = debts.filter(debt => !debt.isActive).length;

        return {
          totalPersonalDebt,
          totalPaidAmount,
          activeDebtsCount,
          paidOffDebtsCount,
        };
      },
    }),
    {
      name: 'personal-debt-storage',
    }
  )
);
