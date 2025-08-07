'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 pt-4 sm:pt-4 ios-modal-fix">
      <Card className="w-full max-w-md sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">
        <CardHeader className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              <span>Record Payment</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <p className="font-medium text-gray-800">{personalDebt.name}</p>
            <p className="text-sm text-gray-600">
              Remaining: {personalDebt.remainingAmount.toLocaleString()} VND
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
                disabled={isSubmitting || !formattedAmount || parseFormattedNumber(formattedAmount) === 0}
              >
                {isSubmitting ? 'Recording...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
