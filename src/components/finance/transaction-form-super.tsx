'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormData } from '@/lib/validations';
import { useFinanceStore } from '@/store/finance-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { notify } from '@/components/ui/notifications';
import { usePerformance } from '@/lib/hooks';
import { formatVNDShort, cn } from '@/lib/utils';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Calendar,
  Save,
  FileText,
  Zap,
  Star
} from 'lucide-react';

const expenseCategories = [
  { name: 'food', icon: '🍽️', color: 'from-orange-500 to-red-500', description: 'Meals & Dining' },
  { name: 'coffee', icon: '☕', color: 'from-amber-500 to-orange-500', description: 'Coffee & Drinks' },
  { name: 'oil', icon: '⛽', color: 'from-gray-500 to-slate-600', description: 'Fuel & Gas' },
  { name: 'family', icon: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-rose-500', description: 'Family Expenses' },
  { name: 'debt', icon: '💳', color: 'from-red-500 to-pink-600', description: 'Debt & Loans' },
  { name: 'shopping', icon: '🛍️', color: 'from-purple-500 to-indigo-500', description: 'Shopping & Retail' },
  { name: 'entertain', icon: '🎮', color: 'from-blue-500 to-cyan-500', description: 'Entertainment' },
  { name: 'transport', icon: '🚗', color: 'from-green-500 to-teal-500', description: 'Transportation' },
  { name: 'health', icon: '🏥', color: 'from-red-400 to-pink-500', description: 'Healthcare' },
  { name: 'utilities', icon: '💡', color: 'from-yellow-500 to-orange-500', description: 'Utilities' },
];

const incomeCategories = [
  { name: 'salary', icon: '💰', color: 'from-green-500 to-emerald-600', description: 'Salary & Wages' },
  { name: 'freelance', icon: '💻', color: 'from-blue-500 to-indigo-600', description: 'Freelance Work' },
  { name: 'business', icon: '🏢', color: 'from-purple-500 to-violet-600', description: 'Business Income' },
  { name: 'investment', icon: '📈', color: 'from-teal-500 to-cyan-600', description: 'Investments' },
  { name: 'bonus', icon: '🎁', color: 'from-pink-500 to-rose-600', description: 'Bonus & Rewards' },
  { name: 'other', icon: '📄', color: 'from-gray-500 to-slate-600', description: 'Other Income' },
];

export default function TransactionFormSuper() {
  usePerformance('TransactionFormSuper');
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const { addTransaction, addTemplate, templates } = useFinanceStore();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      date: new Date(),
    },
  });

  const watchedAmount = watch('amount');
  const watchedDescription = watch('description');

  const currentCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  const onSubmit = async (data: TransactionFormData) => {
    if (!selectedCategory) {
      notify.error('Category Required', 'Please select a category for your transaction');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
        
        notify.success('Template Saved', `Template "${templateName}" has been saved for future use`);
      }

      // Success notification
      notify.success(
        'Transaction Added',
        `${data.type === 'income' ? 'Income' : 'Expense'} of ${formatVNDShort(data.amount)} has been recorded`
      );

      // Reset form
      reset();
      setSelectedCategory('');
      setIsOpen(false);
      setSaveAsTemplate(false);
      setTemplateName('');
    } catch {
      notify.error('Error', 'Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue('category', category);
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setValue('type', type);
    setSelectedCategory(''); // Reset category when type changes
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setValue('amount', template.amount);
      setValue('description', template.description);
      setTransactionType(template.type);
      setValue('type', template.type);
      setSelectedCategory(template.category);
      setValue('category', template.category);
      setShowTemplates(false);
      
      notify.info('Template Applied', `Using template: ${template.name}`);
    }
  };

  const quickAmounts = [10000, 25000, 50000, 100000, 200000, 500000];

  if (!isOpen) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          size="lg"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
          Add Transaction
        </Button>
        
        {templates.length > 0 && (
          <Button
            onClick={() => setShowTemplates(true)}
            variant="outline"
            size="lg"
            className="group border-dashed border-2 hover:border-solid transition-all duration-300"
          >
            <Zap className="h-4 w-4 mr-2 group-hover:text-yellow-500 transition-colors" />
            Quick Add
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <span>Add Transaction</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Transaction Type Toggle */}
          <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200',
                transactionType === 'expense'
                  ? 'bg-white shadow-md text-red-600'
                  : 'text-gray-600 hover:text-red-600'
              )}
            >
              <TrendingDown className="h-4 w-4" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200',
                transactionType === 'income'
                  ? 'bg-white shadow-md text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              )}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Income</span>
            </button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Input with Quick Buttons */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">Amount (VND)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="pl-10 text-lg font-semibold h-14 text-center"
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue('amount', amount)}
                    className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {formatVNDShort(amount)}
                  </Button>
                ))}
              </div>
              
              {watchedAmount > 0 && (
                <p className="text-center text-lg font-semibold text-gray-900">
                  {formatVNDShort(watchedAmount)}
                </p>
              )}
              
              {errors.amount && (
                <p className="text-red-600 text-sm">{errors.amount.message}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentCategories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handleCategorySelect(category.name)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all duration-200 group hover:scale-105',
                      selectedCategory === category.name
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div className="text-center space-y-2">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-xl mx-auto group-hover:scale-110 transition-transform`}>
                        {category.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{category.name}</p>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  {...register('description')}
                  placeholder="Add a note..."
                  className="pl-10"
                />
              </div>
              
              {watchedDescription && watchedDescription.length > 50 && (
                <p className="text-yellow-600 text-sm">
                  Description is getting long ({watchedDescription.length} characters)
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register('date', { valueAsDate: true })}
                  type="date"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Save as Template Option */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="saveTemplate"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="saveTemplate" className="text-sm font-medium text-gray-900">
                  Save as template
                </label>
              </div>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>

            {saveAsTemplate && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-900">Template Name</label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Daily Coffee"
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedCategory}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <Loading size="sm" className="mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Saving...' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Quick Templates</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplates(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatVNDShort(template.amount)}
                      </p>
                      <Badge variant={template.type === 'income' ? 'success' : 'default'}>
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
