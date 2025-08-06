import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.date(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  type: z.enum(['daily', 'monthly']),
  dueDate: z.date(),
});

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  monthlySalary: z.number().min(0, 'Salary must be positive'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type UserFormData = z.infer<typeof userSchema>;
