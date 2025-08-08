'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
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
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center space-x-2">
          <User className="h-5 w-5 text-purple-500" />
          <span>Add Personal Debt</span>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 order-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Personal Debt'}
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
