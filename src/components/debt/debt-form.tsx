'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebtStore } from '@/store/debt-store';
import { CreditCard, X } from 'lucide-react';

const debtSchema = z.object({
  name: z.string().min(1, 'Debt name is required'),
  totalAmount: z.number().min(1, 'Total amount must be greater than 0'),
  monthlyPayment: z.number().min(1, 'Monthly payment must be greater than 0'),
  interestRate: z.number().min(0).max(100, 'Interest rate must be between 0-100%'),
  totalMonths: z.number().min(1, 'Total months must be greater than 0'),
  remainingMonths: z.number().min(1, 'Remaining months must be greater than 0'),
  category: z.enum(['credit_card', 'loan', 'mortgage', 'personal', 'other']),
  description: z.string().optional(),
}).refine((data) => data.remainingMonths <= data.totalMonths, {
  message: "Remaining months cannot be greater than total months",
  path: ["remainingMonths"],
});

type DebtFormData = z.infer<typeof debtSchema>;

interface DebtFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DebtForm({ onClose, onSuccess }: DebtFormProps) {
  const { addDebt } = useDebtStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
  });

  const onSubmit = async (data: DebtFormData) => {
    setIsSubmitting(true);
    try {
      addDebt({
        ...data,
        startDate: new Date(),
        isActive: true,
        userId: '1',
      });

      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding debt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'credit_card', label: 'Credit Card', icon: '💳' },
    { value: 'loan', label: 'Personal Loan', icon: '🏦' },
    { value: 'mortgage', label: 'Mortgage', icon: '🏠' },
    { value: 'personal', label: 'Personal Debt', icon: '👤' },
    { value: 'other', label: 'Other', icon: '📄' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] bg-white shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <CreditCard className="h-5 w-5 text-red-500" />
              <span>Add New Debt</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {/* Debt Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Debt Name *
              </label>
              <Input
                {...register('name')}
                placeholder="e.g., Credit Card Debt"
                className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full h-12 px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select category</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Total Amount */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Total Amount (VND) *
              </label>
              <Input
                {...register('totalAmount', { valueAsNumber: true })}
                type="number"
                inputMode="numeric"
                placeholder="15000000"
                className={`h-12 text-base ${errors.totalAmount ? 'border-red-500' : ''}`}
              />
              {errors.totalAmount && (
                <p className="text-red-500 text-xs mt-1">{errors.totalAmount.message}</p>
              )}
            </div>

            {/* Monthly Payment */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Monthly Payment (VND) * <span className="text-xs text-gray-500">(includes interest)</span>
              </label>
              <Input
                {...register('monthlyPayment', { valueAsNumber: true })}
                type="number"
                inputMode="numeric"
                placeholder="1500000"
                className={`h-12 text-base ${errors.monthlyPayment ? 'border-red-500' : ''}`}
              />
              {errors.monthlyPayment && (
                <p className="text-red-500 text-xs mt-1">{errors.monthlyPayment.message}</p>
              )}
            </div>

            {/* Total Months */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Total Months *
              </label>
              <Input
                {...register('totalMonths', { valueAsNumber: true })}
                type="number"
                inputMode="numeric"
                placeholder="24"
                className={`h-12 text-base ${errors.totalMonths ? 'border-red-500' : ''}`}
              />
              {errors.totalMonths && (
                <p className="text-red-500 text-xs mt-1">{errors.totalMonths.message}</p>
              )}
            </div>

            {/* Remaining Months */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Remaining Months *
              </label>
              <Input
                {...register('remainingMonths', { valueAsNumber: true })}
                type="number"
                inputMode="numeric"
                placeholder="12"
                className={`h-12 text-base ${errors.remainingMonths ? 'border-red-500' : ''}`}
              />
              {errors.remainingMonths && (
                <p className="text-red-500 text-xs mt-1">{errors.remainingMonths.message}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Annual Interest Rate (%) *
              </label>
              <Input
                {...register('interestRate', { valueAsNumber: true })}
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="18.5"
                className={`h-12 text-base ${errors.interestRate ? 'border-red-500' : ''}`}
              />
              {errors.interestRate && (
                <p className="text-red-500 text-xs mt-1">{errors.interestRate.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                placeholder="Additional notes about this debt..."
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 text-base touch-manipulation"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1 h-12 text-base touch-manipulation"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Debt'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
