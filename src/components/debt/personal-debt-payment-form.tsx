'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePersonalDebtStore } from '@/store/personal-debt-store';
import { parseFormattedNumber } from '@/lib/utils';
import { DollarSign, X } from 'lucide-react';

const personalDebtPaymentSchema = z.object({
  amount: z.number().min(1, 'Payment amount must be greater than 0'),
  description: z.string().optional(),
});

type PersonalDebtPaymentFormData = z.infer<typeof personalDebtPaymentSchema>;

interface PersonalDebtPaymentFormProps {
  personalDebtId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PersonalDebtPaymentForm({ 
  personalDebtId, 
  onClose, 
  onSuccess 
}: PersonalDebtPaymentFormProps) {
  const { addPersonalDebtPayment, getPersonalDebtById } = usePersonalDebtStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const personalDebt = getPersonalDebtById(personalDebtId);
  
  // Formatted display value for money input
  const [formattedAmount, setFormattedAmount] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PersonalDebtPaymentFormData>({
    resolver: zodResolver(personalDebtPaymentSchema),
  });

  const onSubmit = async (data: PersonalDebtPaymentFormData) => {
    if (!personalDebt) return;
    
    setIsSubmitting(true);
    try {
      addPersonalDebtPayment({
        personalDebtId,
        amount: data.amount,
        description: data.description,
        paymentDate: new Date(),
        remainingBalance: personalDebt.remainingAmount - data.amount,
      });

      reset();
      setFormattedAmount('');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding personal debt payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!personalDebt) {
    return null;
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <span>Record Payment</span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <p className="font-medium text-gray-800">{personalDebt.name}</p>
        <p className="text-sm text-gray-600">
          Remaining: {personalDebt.remainingAmount.toLocaleString()} VND
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Payment Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Payment Amount
          </label>
          <Input
            type="text"
            placeholder="0"
            value={formattedAmount}
            onChange={(e) => {
              // Remove all non-digit characters
              const cleaned = e.target.value.replace(/[^\d]/g, '');
              const number = parseInt(cleaned) || 0;
              
              // Don't allow payment more than remaining amount
              const maxAmount = personalDebt.remainingAmount;
              const finalAmount = Math.min(number, maxAmount);
              
              setFormattedAmount(finalAmount.toLocaleString());
              setValue('amount', finalAmount);
            }}
            className="w-full"
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
          {formattedAmount && parseFormattedNumber(formattedAmount) > personalDebt.remainingAmount && (
            <p className="text-orange-500 text-xs mt-1">
              Payment amount cannot exceed remaining debt
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Partial payment, Final payment, etc."
            {...register('description')}
            className="w-full"
          />
        </div>

        {/* Payment Summary */}
        {formattedAmount && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Amount:</span>
              <span className="font-medium">
                {parseFormattedNumber(formattedAmount).toLocaleString()} VND
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining After Payment:</span>
              <span className="font-medium text-green-600">
                {Math.max(0, personalDebt.remainingAmount - parseFormattedNumber(formattedAmount)).toLocaleString()} VND
              </span>
            </div>
            {personalDebt.remainingAmount - parseFormattedNumber(formattedAmount) === 0 && (
              <div className="text-center text-green-600 font-medium text-sm mt-2">
                🎉 This will mark the debt as fully paid!
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 order-1"
            disabled={isSubmitting || !formattedAmount || parseFormattedNumber(formattedAmount) === 0}
          >
            {isSubmitting ? 'Recording...' : 'Record Payment'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="order-2 sm:order-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
