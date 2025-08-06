import { Transaction, Task, User, Loan, LoanPayment } from '@/types';

// Keep user data as it might be needed for profile
export const mockUser: User = {
  id: '1',
  name: 'Anh Duc',
  email: 'anhduc@example.com',
  monthlySalary: 24800000,
};

// Categories and configuration that might still be needed
export const categories = {
  income: ['salary', 'bonus', 'freelance', 'investment', 'other'],
  expense: ['food', 'coffee', 'oil', 'family', 'debt', 'shopping', 'entertainment', 'transportation', 'utilities', 'health', 'other']
};

export const categoryConfig = {
  income: {
    salary: { label: 'Salary', color: 'green', icon: '💰' },
    bonus: { label: 'Bonus', color: 'emerald', icon: '🎁' },
    freelance: { label: 'Freelance', color: 'teal', icon: '💻' },
    investment: { label: 'Investment', color: 'cyan', icon: '📈' },
    other: { label: 'Other Income', color: 'blue', icon: '💎' },
  },
  expense: {
    food: { label: 'Food & Dining', color: 'orange', icon: '🍽️' },
    coffee: { label: 'Coffee & Cafes', color: 'amber', icon: '☕' },
    oil: { label: 'Gas & Fuel', color: 'red', icon: '⛽' },
    family: { label: 'Family', color: 'pink', icon: '👨‍👩‍👧‍👦' },
    debt: { label: 'Debt Payment', color: 'purple', icon: '💳' },
    shopping: { label: 'Shopping', color: 'indigo', icon: '🛍️' },
    entertainment: { label: 'Entertainment', color: 'violet', icon: '🎭' },
    transportation: { label: 'Transportation', color: 'slate', icon: '🚗' },
    utilities: { label: 'Utilities', color: 'gray', icon: '💡' },
    health: { label: 'Health & Medical', color: 'emerald', icon: '🏥' },
    other: { label: 'Other Expenses', color: 'neutral', icon: '📦' },
  },
};

// Export empty arrays for any remaining references
export const mockTransactions: Transaction[] = [];
export const mockTasks: Task[] = [];
export const mockLoans: Loan[] = [];
export const mockLoanPayments: LoanPayment[] = [];
