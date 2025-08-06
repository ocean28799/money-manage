'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormData } from '@/lib/validations';
import { useFinanceStore } from '@/store/finance-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatVNDShort } from '@/lib/utils';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Calendar,
  Save,
  FileText,
  Clock
} from 'lucide-react';

const expenseCategories = [
  { name: 'food', icon: '🍽️', color: 'from-orange-500 to-red-500', description: 'Meals & Dining' },
  { name: 'coffee', icon: '☕', color: 'from-amber-500 to-orange-500', description: 'Coffee & Drinks' },
  { name: 'oil', icon: '⛽', color: 'from-gray-500 to-slate-600', description: 'Fuel & Gas' },
  { name: 'family', icon: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-rose-500', description: 'Family Expenses' },
  { name: 'debt', icon: '💳', color: 'from-red-500 to-pink-600', description: 'Debt & Loans' },
  { name: 'shopping', icon: '🛍️', color: 'from-purple-500 to-indigo-500', description: 'Shopping & Retail' },
  { name: 'entertain', icon: '🎮', color: 'from-blue-500 to-cyan-500', description: 'Entertainment' },
];

const incomeCategories = [
  { name: 'salary', icon: '💰', color: 'from-green-500 to-emerald-600', description: 'Salary & Wages' },
  { name: 'freelance', icon: '💻', color: 'from-blue-500 to-indigo-600', description: 'Freelance Work' },
  { name: 'business', icon: '🏢', color: 'from-purple-500 to-violet-600', description: 'Business Income' },
  { name: 'investment', icon: '📈', color: 'from-teal-500 to-cyan-600', description: 'Investments' },
  { name: 'other', icon: '📄', color: 'from-gray-500 to-slate-600', description: 'Other Income' },
];

export default function TransactionFormEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  
  const { addTransaction, addTemplate, templates, createTransactionFromTemplate } = useFinanceStore();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      date: new Date(),
    },
  });

  const watchedAmount = watch('amount');

  const onSubmit = async (data: TransactionFormData) => {
    addTransaction({
      ...data,
      category: selectedCategory,
      userId: '1',
    });

    // Save as template if requested
    if (saveAsTemplate && templateName.trim()) {
      addTemplate({
        name: templateName.trim(),
        category: selectedCategory,
        amount: data.amount,
        type: data.type,
        description: data.description || '',
        isRecurring: false,
      });
    }

    reset();
    setSelectedCategory('');
    setIsOpen(false);
    setSaveAsTemplate(false);
    setTemplateName('');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue('category', category);
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setValue('type', type);
    setSelectedCategory('');
  };

  const handleTemplateUse = (templateId: string) => {
    createTransactionFromTemplate(templateId);
    setShowTemplates(false);
    setIsOpen(false);
  };

  const getCurrentCategories = () => {
    return transactionType === 'expense' ? expenseCategories : incomeCategories;
  };

  const getQuickAmounts = () => {
    if (transactionType === 'expense') {
      return [25000, 50000, 100000, 200000, 500000, 1000000];
    } else {
      return [1000000, 5000000, 10000000, 15000000, 20000000, 25000000];
    }
  };

  if (!isOpen) {
    return (
      <div className="space-y-4">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => {
              setIsOpen(true);
              setTransactionType('expense');
            }}
            variant="morphic"
            size="lg"
            className="h-20 flex-col space-y-2 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
          >
            <TrendingDown className="h-6 w-6" />
            <span className="font-medium">Add Expense</span>
          </Button>
          
          <Button
            onClick={() => {
              setIsOpen(true);
              setTransactionType('income');
            }}
            variant="morphic"
            size="lg"
            className="h-20 flex-col space-y-2 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <TrendingUp className="h-6 w-6" />
            <span className="font-medium">Add Income</span>
          </Button>
        </div>

        {/* Templates Button */}
        {templates.length > 0 && (
          <Button
            onClick={() => setShowTemplates(true)}
            variant="outline"
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Use Templates ({templates.length})
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Templates Modal */}
      {showTemplates && (
        <Card variant="glass" className="group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="gradient-text">Quick Templates</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateUse(template.id)}
                  className="p-4 text-left glass rounded-xl hover:bg-white/20 transition-all duration-300 group/template"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <Badge 
                      variant={template.type === 'income' ? 'success' : 'error'}
                      className="text-xs"
                    >
                      {template.type === 'income' ? '+' : '-'}{formatVNDShort(template.amount)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="capitalize">{template.category}</span>
                    {template.isRecurring && (
                      <>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="capitalize">{template.frequency}</span>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card variant="glass" className="group">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                transactionType === 'income' 
                  ? 'from-green-500 to-emerald-600' 
                  : 'from-red-500 to-pink-600'
              }`}>
                {transactionType === 'income' ? (
                  <TrendingUp className="h-4 w-4 text-white" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="gradient-text">
                Add {transactionType === 'income' ? 'Income' : 'Expense'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Type Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  transactionType === 'expense'
                    ? 'bg-white shadow-sm text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <TrendingDown className="h-4 w-4 mx-auto mb-1" />
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  transactionType === 'income'
                    ? 'bg-white shadow-sm text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <TrendingUp className="h-4 w-4 mx-auto mb-1" />
                Income
              </button>
            </div>

            {/* Amount Input with Quick Buttons */}
            <div className="space-y-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className={`pl-10 text-center text-2xl font-bold h-16 ${
                    transactionType === 'income' 
                      ? 'border-green-300 focus:border-green-500' 
                      : 'border-red-300 focus:border-red-500'
                  }`}
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {getQuickAmounts().map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setValue('amount', amount)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      watchedAmount === amount
                        ? transactionType === 'income'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formatVNDShort(amount)}
                  </button>
                ))}
              </div>
              
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getCurrentCategories().map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handleCategorySelect(category.name)}
                    className={`p-4 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                      selectedCategory === category.name
                        ? 'ring-4 ring-white/50 scale-105 shadow-lg'
                        : 'hover:shadow-md'
                    } bg-gradient-to-br ${category.color}`}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{category.icon}</div>
                      <div className="text-sm font-semibold capitalize">{category.name}</div>
                      <div className="text-xs opacity-90">{category.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <Input
                placeholder="What was this for?"
                {...register('description')}
                className="w-full"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="datetime-local"
                  {...register('date', { valueAsDate: true })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Save as Template Option */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="saveTemplate"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="saveTemplate" className="text-sm font-medium text-gray-700">
                  Save as template for future use
                </label>
              </div>
              
              {saveAsTemplate && (
                <Input
                  placeholder="Template name (e.g., 'Morning Coffee')"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full"
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !selectedCategory}
              variant="gradient"
              size="lg"
              className="w-full h-14 text-lg font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {saveAsTemplate ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  <span>
                    Add {transactionType === 'income' ? 'Income' : 'Expense'}
                    {saveAsTemplate && ' & Save Template'}
                  </span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
