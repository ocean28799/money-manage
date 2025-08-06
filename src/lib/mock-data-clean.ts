import { Transaction, Task, User, Loan, LoanPayment } from '@/types';

// Keep user data as it might be needed for profile
export const mockUser: User = {
  id: '1',
  name: 'Anh Duc',
  email: 'anhduc@example.com',
  monthlySalary: 24800000,
};

// Export empty arrays for any remaining references
export const mockTransactions: Transaction[] = [];
export const mockTasks: Task[] = [];
export const mockLoans: Loan[] = [];
export const mockLoanPayments: LoanPayment[] = [];
