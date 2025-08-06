'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormData } from '@/lib/validations';
import { useFinanceStore } from '@/store/finance-store';
import { categories, categoryConfig } from '@/lib/mock-data';
import { parseFormattedNumber, handleNumberInputChange } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, DollarSign, Calendar, Tag, FileText, X } from 'lucide-react';

export default function TransactionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');
  const { addTransaction } = useFinanceStore();
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date(),
    },
  });

  const transactionType = watch('type');
  const selectedCategory = watch('category');

  const onSubmit = async (data: TransactionFormData) => {
    addTransaction({
      ...data,
      userId: '1', // Mock user ID
    });
    reset();
    setFormattedAmount('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="mb-6">
        <Button
          onClick={() => setIsOpen(true)}
          variant="gradient"
          size="lg"
          className="w-full sm:w-auto group"
          glowing
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
          Add Transaction
        </Button>
      </div>
    );
  }

  return (
    <Card variant="glass" className="mb-6 overflow-hidden">
      {/* Header */}
      <CardHeader className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-600/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <CardTitle gradient>Add New Transaction</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              reset();
            }}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type Toggle */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Tag className="h-4 w-4 text-blue-500" />
              <span>Type</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('type', 'expense')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  transactionType === 'expense'
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💸</div>
                  <div className="font-medium">Expense</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'income')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  transactionType === 'income'
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-medium">Income</div>
                </div>
              </button>
            </div>
            <input type="hidden" {...register('type')} />
            {errors.type && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                <span>{errors.type.message}</span>
              </p>
            )}
          </div>

          {/* Amount and Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Amount</span>
              </label>
              <Input
                type="text"
                value={formattedAmount}
                onChange={(e) => {
                  handleNumberInputChange(e.target.value, setFormattedAmount);
                  setValue('amount', parseFormattedNumber(e.target.value));
                }}
                placeholder="0"
                variant="glass"
                className="text-lg font-semibold"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  <span>{errors.amount.message}</span>
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Date</span>
              </label>
              <Input
                type="date"
                {...register('date', { valueAsDate: true })}
                variant="glass"
              />
              {errors.date && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  <span>{errors.date.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Tag className="h-4 w-4 text-purple-500" />
              <span>Category</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories[transactionType].map((category) => {
                const config = categoryConfig[transactionType]?.[category as keyof typeof categoryConfig[typeof transactionType]];
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setValue('category', category)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50 text-blue-700 scale-105'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:scale-102'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{config?.icon || '💰'}</div>
                      <div className="text-xs font-medium">{config?.label || category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register('category')} />
            {errors.category && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                <span>{errors.category.message}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>Description (Optional)</span>
            </label>
            <Input
              {...register('description')}
              placeholder="Enter transaction description"
              variant="glass"
            />
            {errors.description && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                <span>{errors.description.message}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant="gradient"
              size="lg"
              className="flex-1"
              glowing
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              className="sm:px-8"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
