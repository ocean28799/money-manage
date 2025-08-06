'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLoanStore } from '@/store/loan-store';
import { formatNumberWithCommas, parseFormattedNumber, handleNumberInputChange } from '@/lib/utils';
import { Loan } from '@/types';

interface LoanFormProps {
  onClose?: () => void;
  editingLoan?: Loan;
}

export function LoanForm({ onClose, editingLoan }: LoanFormProps) {
  const { addLoan, updateLoan } = useLoanStore();
  const [formData, setFormData] = useState({
    title: editingLoan?.title || '',
    totalAmount: editingLoan?.totalAmount || '',
    amountPaid: editingLoan?.amountPaid || 0,
    monthlyPayment: editingLoan?.monthlyPayment || '',
    interestRate: editingLoan?.interestRate || '',
    category: editingLoan?.category || 'personal',
    description: editingLoan?.description || '',
    startDate: editingLoan?.startDate 
      ? new Date(editingLoan.startDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    targetPayoffDate: editingLoan?.targetPayoffDate 
      ? new Date(editingLoan.targetPayoffDate).toISOString().split('T')[0]
      : '',
  });

  // Formatted display values for number inputs
  const [formattedTotalAmount, setFormattedTotalAmount] = useState(
    editingLoan?.totalAmount ? formatNumberWithCommas(editingLoan.totalAmount) : ''
  );
  const [formattedAmountPaid, setFormattedAmountPaid] = useState(
    editingLoan?.amountPaid ? formatNumberWithCommas(editingLoan.amountPaid) : ''
  );
  const [formattedMonthlyPayment, setFormattedMonthlyPayment] = useState(
    editingLoan?.monthlyPayment ? formatNumberWithCommas(editingLoan.monthlyPayment) : ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.totalAmount || Number(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Total amount must be greater than 0';
    }

    if (Number(formData.amountPaid) < 0) {
      newErrors.amountPaid = 'Amount paid cannot be negative';
    }

    if (Number(formData.amountPaid) > Number(formData.totalAmount)) {
      newErrors.amountPaid = 'Amount paid cannot exceed total amount';
    }

    if (formData.monthlyPayment && Number(formData.monthlyPayment) <= 0) {
      newErrors.monthlyPayment = 'Monthly payment must be greater than 0';
    }

    if (formData.interestRate && (Number(formData.interestRate) < 0 || Number(formData.interestRate) > 100)) {
      newErrors.interestRate = 'Interest rate must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const loanData = {
      userId: 'current-user', // You might want to get this from auth context
      title: formData.title.trim(),
      totalAmount: Number(formData.totalAmount),
      amountPaid: Number(formData.amountPaid),
      remainingAmount: Number(formData.totalAmount) - Number(formData.amountPaid),
      monthlyPayment: formData.monthlyPayment ? Number(formData.monthlyPayment) : undefined,
      interestRate: formData.interestRate ? Number(formData.interestRate) : undefined,
      category: formData.category as 'personal' | 'auto' | 'home' | 'student' | 'business' | 'other',
      description: formData.description.trim() || undefined,
      startDate: new Date(formData.startDate),
      targetPayoffDate: formData.targetPayoffDate ? new Date(formData.targetPayoffDate) : undefined,
      isActive: true,
    };

    if (editingLoan) {
      updateLoan(editingLoan.id, loanData);
    } else {
      addLoan(loanData);
    }

    if (onClose) {
      onClose();
    }

    // Reset form if not editing
    if (!editingLoan) {
      setFormData({
        title: '',
        totalAmount: '',
        amountPaid: 0,
        monthlyPayment: '',
        interestRate: '',
        category: 'personal',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        targetPayoffDate: '',
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        {editingLoan ? 'Edit Loan' : 'Add New Loan'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Car Loan, Personal Loan"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium mb-1">
              Total Amount *
            </label>
            <Input
              id="totalAmount"
              type="text"
              value={formattedTotalAmount}
              onChange={(e) => {
                handleNumberInputChange(e.target.value, setFormattedTotalAmount);
                handleInputChange('totalAmount', parseFormattedNumber(e.target.value));
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.totalAmount ? 'border-red-500' : ''}
            />
            {errors.totalAmount && <p className="text-red-500 text-xs mt-1">{errors.totalAmount}</p>}
          </div>

          <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium mb-1">
              Amount Paid
            </label>
            <Input
              id="amountPaid"
              type="text"
              value={formattedAmountPaid}
              onChange={(e) => {
                handleNumberInputChange(e.target.value, setFormattedAmountPaid);
                handleInputChange('amountPaid', parseFormattedNumber(e.target.value));
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.amountPaid ? 'border-red-500' : ''}
            />
            {errors.amountPaid && <p className="text-red-500 text-xs mt-1">{errors.amountPaid}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="monthlyPayment" className="block text-sm font-medium mb-1">
              Monthly Payment
            </label>
            <Input
              id="monthlyPayment"
              type="text"
              value={formattedMonthlyPayment}
              onChange={(e) => {
                handleNumberInputChange(e.target.value, setFormattedMonthlyPayment);
                handleInputChange('monthlyPayment', parseFormattedNumber(e.target.value));
              }}
              placeholder="0"
              min="0"
              step="0.01"
              className={errors.monthlyPayment ? 'border-red-500' : ''}
            />
            {errors.monthlyPayment && <p className="text-red-500 text-xs mt-1">{errors.monthlyPayment}</p>}
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium mb-1">
              Interest Rate (%)
            </label>
            <Input
              id="interestRate"
              type="number"
              value={formData.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              placeholder="0.00"
              min="0"
              max="100"
              step="0.01"
              className={errors.interestRate ? 'border-red-500' : ''}
            />
            {errors.interestRate && <p className="text-red-500 text-xs mt-1">{errors.interestRate}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 h-12 text-base sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="personal">Personal</option>
            <option value="auto">Auto</option>
            <option value="home">Home</option>
            <option value="student">Student</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="targetPayoffDate" className="block text-sm font-medium mb-1">
              Target Payoff Date
            </label>
            <Input
              id="targetPayoffDate"
              type="date"
              value={formData.targetPayoffDate}
              onChange={(e) => handleInputChange('targetPayoffDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Optional description..."
            className="w-full p-3 h-20 text-base sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300"
            rows={3}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button type="submit" className="flex-1 order-1">
            {editingLoan ? 'Update Loan' : 'Add Loan'}
          </Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose} className="order-2 sm:order-1">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
