'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePersonalDebtStore } from '@/store/personal-debt-store';
import { User, X } from 'lucide-react';

const personalDebtSchema = z.object({
  name: z.string().min(1, 'Person name is required'),
  description: z.string().optional(),
  totalAmount: z.number().min(1, 'Amount must be greater than 0'),
  category: z.enum(['friend', 'family', 'colleague', 'other']),
});

type PersonalDebtFormData = z.infer<typeof personalDebtSchema>;

interface PersonalDebtFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PersonalDebtForm({ onClose, onSuccess }: PersonalDebtFormProps) {
  const { addPersonalDebt } = usePersonalDebtStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formatted display value for money input
  const [formattedAmount, setFormattedAmount] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PersonalDebtFormData>({
    resolver: zodResolver(personalDebtSchema),
  });

  const onSubmit = async (data: PersonalDebtFormData) => {
    setIsSubmitting(true);
    try {
      addPersonalDebt({
        ...data,
        startDate: new Date(),
        isActive: true,
        userId: '1',
        remainingAmount: data.totalAmount,
      });

      reset();
      setFormattedAmount('');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding personal debt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'friend', label: 'Friend', icon: '👤' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'colleague', label: 'Colleague', icon: '💼' },
    { value: 'other', label: 'Other', icon: '📄' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 ios-modal-fix">
      <div className="w-full max-w-md sm:max-w-lg p-3 sm:p-4 pt-safe">
        <Card className="w-full bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ios-modal-card">
          <CardHeader className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                <span>Add Personal Debt</span>
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
          </CardHeader>

          <div className="ios-modal-content">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Person Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Person Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., John Doe, Mom, etc."
                    {...register('name')}
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Dinner bill, Emergency loan, etc."
                    {...register('description')}
                    className="w-full"
                  />
                </div>

                {/* Total Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Total Amount
                  </label>
                  <Input
                    type="text"
                    placeholder="0"
                    value={formattedAmount}
                    onChange={(e) => {
                      // Remove all non-digit characters
                      const cleaned = e.target.value.replace(/[^\d]/g, '');
                      const number = parseInt(cleaned) || 0;
                      setFormattedAmount(number.toLocaleString());
                      setValue('totalAmount', number);
                    }}
                    className="w-full"
                  />
                  {errors.totalAmount && (
                    <p className="text-red-500 text-xs mt-1">{errors.totalAmount.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Relationship
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {categoryOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 p-3 sm:p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register('category')}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200 pb-safe">
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Personal Debt'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
