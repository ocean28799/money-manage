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
      <div className="mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="gradient"
          size="lg"
          className="w-full group shadow-lg border-0 min-h-[52px]"
          glowing
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
          Add Transaction
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden bg-white/60 backdrop-blur-sm border-green-100">
      {/* Mobile-First Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Add New Transaction
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              reset();
              setFormattedAmount('');
            }}
            className="hover:bg-red-50 hover:text-red-600 min-h-[44px] min-w-[44px]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Transaction Type Toggle - Mobile Optimized */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Tag className="h-4 w-4 text-blue-500" />
              <span>Transaction Type</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('type', 'expense')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                  transactionType === 'expense'
                    ? 'border-red-300 bg-red-50 text-red-700 shadow-md'
                    : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 active:scale-95'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💸</div>
                  <div className="font-medium text-sm">Expense</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'income')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                  transactionType === 'income'
                    ? 'border-green-300 bg-green-50 text-green-700 shadow-md'
                    : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 active:scale-95'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-medium text-sm">Income</div>
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

          {/* Amount and Date - Mobile Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Enter amount"
                className="text-lg font-semibold bg-white/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[48px] text-base"
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
                className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[48px] text-base"
              />
              {errors.date && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  <span>{errors.date.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* Category Selection - Mobile Optimized Grid */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Tag className="h-4 w-4 text-purple-500" />
              <span>Category</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories[transactionType].map((category) => {
                const config = categoryConfig[transactionType]?.[category as keyof typeof categoryConfig[typeof transactionType]];
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setValue('category', category)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 active:scale-95'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{config?.icon || '💰'}</div>
                      <div className="text-xs font-medium leading-tight">{config?.label || category}</div>
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
              className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[48px] text-base"
            />
            {errors.description && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                <span>{errors.description.message}</span>
              </p>
            )}
          </div>

          {/* Action Buttons - Mobile First */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant="gradient"
              size="lg"
              className="flex-1 min-h-[52px] shadow-lg"
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
                setFormattedAmount('');
              }}
              className="sm:px-8 min-h-[52px] bg-white/50 border-gray-200 hover:bg-white/70"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
