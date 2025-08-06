import { create } from 'zustand';
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

// Mock debt data
const mockDebts: Debt[] = [
  {
    id: '1',
    userId: '1',
    name: 'Credit Card Debt',
    totalAmount: 15000000, // 15M VND
    remainingAmount: 9000000, // Calculated from remaining months
    monthlyPayment: 1500000, // 1.5M VND (includes interest)
    interestRate: 18, // 18% annual
    totalMonths: 12, // 1 year loan
    remainingMonths: 6, // 6 months left
    startDate: new Date('2024-01-01'),
    category: 'credit_card',
    description: 'Main credit card debt',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    name: 'Personal Loan',
    totalAmount: 50000000, // 50M VND
    remainingAmount: 21000000, // Calculated from remaining months
    monthlyPayment: 3000000, // 3M VND (includes interest)
    interestRate: 12, // 12% annual
    totalMonths: 24, // 2 years loan
    remainingMonths: 7, // 7 months left
    startDate: new Date('2023-06-01'),
    targetPayoffDate: new Date('2025-06-01'),
    category: 'personal',
    description: 'Emergency personal loan',
    isActive: true,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date(),
  },
];

export const useDebtStore = create<DebtStore>((set, get) => ({
  debts: mockDebts,
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
          ? { ...debt, ...updatedDebt, updatedAt: new Date() }
          : debt
      ),
    })),

  deleteDebt: (id) =>
    set((state) => ({
      debts: state.debts.filter((debt) => debt.id !== id),
      payments: state.payments.filter((payment) => payment.debtId !== id),
    })),

  addPayment: (payment) => {
    const { debts, updateDebt } = get();
    const debt = debts.find(d => d.id === payment.debtId);
    
    if (debt) {
      // Reduce remaining months by 1 and recalculate remaining amount
      const newRemainingMonths = Math.max(0, debt.remainingMonths - 1);
      const newRemainingAmount = get().calculateRemainingAmount(debt.monthlyPayment, newRemainingMonths);
      
      updateDebt(debt.id, { 
        remainingMonths: newRemainingMonths,
        remainingAmount: newRemainingAmount,
        isActive: newRemainingMonths > 0
      });
    }

    set((state) => ({
      payments: [
        ...state.payments,
        { ...payment, id: Date.now().toString() },
      ],
    }));
  },

  calculateRemainingAmount: (monthlyPayment, remainingMonths) => {
    return monthlyPayment * remainingMonths;
  },

  makePayment: (debtId) => {
    const { debts, addPayment } = get();
    const debt = debts.find(d => d.id === debtId);
    
    if (debt && debt.remainingMonths > 0) {
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      const interestAmount = debt.remainingAmount * monthlyInterestRate;
      const principalAmount = debt.monthlyPayment - interestAmount;
      
      addPayment({
        debtId: debt.id,
        amount: debt.monthlyPayment,
        paymentDate: new Date(),
        principalAmount: Math.max(0, principalAmount),
        interestAmount,
        remainingBalance: Math.max(0, debt.remainingAmount - principalAmount),
      });
    }
  },

  getDebtById: (id) => {
    const { debts } = get();
    return debts.find(debt => debt.id === id);
  },

  calculatePayoffSchedule: (debtId) => {
    const { debts } = get();
    const debt = debts.find(d => d.id === debtId);
    
    if (!debt) return [];

    const schedule = [];
    let remainingBalance = debt.remainingAmount;
    const monthlyInterestRate = debt.interestRate / 100 / 12;
    let month = 1;

    for (let i = 0; i < debt.remainingMonths && remainingBalance > 0.01; i++) {
      const monthlyInterest = remainingBalance * monthlyInterestRate;
      const principalPayment = debt.monthlyPayment - monthlyInterest;
      
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      schedule.push({
        month,
        payment: debt.monthlyPayment,
        monthlyInterest,
        principal: principalPayment,
        balance: remainingBalance,
      });

      month++;
    }

    return schedule;
  },

  getUpcomingPayments: () => {
    const { debts } = get();
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    return debts
      .filter(debt => debt.isActive)
      .map(debt => {
        const monthlyInterestRate = debt.interestRate / 100 / 12;
        const interestAmount = debt.remainingAmount * monthlyInterestRate;
        const principalAmount = debt.monthlyPayment - interestAmount;

        return {
          id: `upcoming-${debt.id}`,
          debtId: debt.id,
          amount: debt.monthlyPayment,
          paymentDate: nextMonth,
          principalAmount: Math.max(0, principalAmount),
          interestAmount,
          remainingBalance: debt.remainingAmount - principalAmount,
        };
      });
  },

  getDebtSummary: () => {
    const { debts } = get();
    const activeDebts = debts.filter(debt => debt.isActive);

    const totalDebt = activeDebts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
    const totalMonthlyPayments = activeDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
    
    const totalInterestPerMonth = activeDebts.reduce((sum, debt) => {
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      return sum + (debt.remainingAmount * monthlyInterestRate);
    }, 0);

    const averagePayoffMonths = activeDebts.length > 0 
      ? activeDebts.reduce((sum, debt) => sum + debt.remainingMonths, 0) / activeDebts.length
      : 0;

    const upcomingPayments = get().getUpcomingPayments();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalDebt,
      totalMonthlyPayments,
      totalInterestPerMonth,
      averagePayoffMonths,
      nextMonthPayments: upcomingPayments,
      thisMonthPayments: upcomingPayments.map(payment => ({
        ...payment,
        paymentDate: thisMonth,
      })),
    };
  },
}));
