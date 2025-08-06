import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Debt, DebtPayment, DebtSummary } from '@/types';

interface DebtStore {
  debts: Debt[];
  payments: DebtPayment[];
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addPayment: (payment: Omit<DebtPayment, 'id'>) => void;
  getDebtSummary: () => DebtSummary;
  getDebtById: (id: string) => Debt | undefined;
  calculatePayoffSchedule: (debtId: string) => Array<{
    month: number;
    payment: number;
    monthlyInterest: number;
    principal: number;
    balance: number;
  }>;
  calculateRemainingAmount: (monthlyPayment: number, remainingMonths: number) => number;
  makePayment: (debtId: string) => void;
  getUpcomingPayments: () => DebtPayment[];
}

export const useDebtStore = create<DebtStore>()(
  persist(
    (set, get) => ({
      debts: [], // Start with empty debts array
      payments: [],

  addDebt: (debt) => {
    const remainingAmount = get().calculateRemainingAmount(debt.monthlyPayment, debt.remainingMonths);
    set((state) => ({
      debts: [
        ...state.debts,
        {
          ...debt,
          id: Date.now().toString(),
          remainingAmount,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }));
  },

  updateDebt: (id, updatedDebt) =>
    set((state) => ({
      debts: state.debts.map((debt) =>
        debt.id === id
          ? {
              ...debt,
              ...updatedDebt,
              updatedAt: new Date(),
            }
          : debt
      ),
    })),

  deleteDebt: (id) =>
    set((state) => ({
      debts: state.debts.filter((debt) => debt.id !== id),
    })),

  addPayment: (payment) =>
    set((state) => ({
      payments: [
        ...state.payments,
        {
          ...payment,
          id: Date.now().toString(),
        },
      ],
    })),

  getDebtSummary: (): DebtSummary => {
    const debts = get().debts;
    const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
    const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
    const totalInterestPerMonth = debts.reduce((sum, debt) => {
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      return sum + (debt.remainingAmount * monthlyInterestRate);
    }, 0);
    const averagePayoffMonths = debts.length > 0 
      ? debts.reduce((sum, debt) => sum + debt.remainingMonths, 0) / debts.length 
      : 0;

    return {
      totalDebt,
      totalMonthlyPayments,
      totalInterestPerMonth,
      averagePayoffMonths,
      nextMonthPayments: [],
      thisMonthPayments: [],
    };
  },

  getDebtById: (id) => {
    return get().debts.find((debt) => debt.id === id);
  },

  calculatePayoffSchedule: (debtId) => {
    const debt = get().getDebtById(debtId);
    if (!debt) return [];

    const schedule = [];
    let balance = debt.remainingAmount;
    const monthlyInterestRate = debt.interestRate / 100 / 12;
    
    for (let month = 1; month <= debt.remainingMonths && balance > 0; month++) {
      const monthlyInterest = balance * monthlyInterestRate;
      const principal = Math.min(debt.monthlyPayment - monthlyInterest, balance);
      balance -= principal;
      
      schedule.push({
        month,
        payment: debt.monthlyPayment,
        monthlyInterest,
        principal,
        balance: Math.max(0, balance),
      });
    }

    return schedule;
  },

  calculateRemainingAmount: (monthlyPayment, remainingMonths) => {
    return monthlyPayment * remainingMonths;
  },

  makePayment: (debtId) => {
    const debt = get().getDebtById(debtId);
    if (!debt) return;

    const monthlyInterestRate = debt.interestRate / 100 / 12;
    const monthlyInterest = debt.remainingAmount * monthlyInterestRate;
    const principal = debt.monthlyPayment - monthlyInterest;
    const newRemainingAmount = Math.max(0, debt.remainingAmount - principal);
    const newRemainingMonths = Math.max(0, debt.remainingMonths - 1);

    get().updateDebt(debtId, {
      remainingAmount: newRemainingAmount,
      remainingMonths: newRemainingMonths,
    });

    get().addPayment({
      debtId,
      amount: debt.monthlyPayment,
      paymentDate: new Date(),
      principalAmount: principal,
      interestAmount: monthlyInterest,
      remainingBalance: newRemainingAmount,
    });
  },

  getUpcomingPayments: () => {
    const debts = get().debts;
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    return debts.map((debt) => ({
      id: `upcoming-${debt.id}`,
      debtId: debt.id,
      amount: debt.monthlyPayment,
      paymentDate: nextMonth,
      principalAmount: 0,
      interestAmount: 0,
      remainingBalance: debt.remainingAmount,
    }));
  },
}),
{
  name: 'debt-store',
  partialize: (state) => ({
    debts: state.debts,
    payments: state.payments,
  }),
}
));
