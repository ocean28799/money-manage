'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinanceStore } from '@/store/finance-store';
import { useTaskStore } from '@/store/task-store';
import { useNotifications } from '@/components/ui/notifications';
import { 
  Plus, 
  Zap, 
  DollarSign, 
  CheckSquare, 
  Clock, 
  Target,
  CreditCard,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatVND } from '@/lib/utils';

const expenseCategories = [
  { name: 'food', icon: '🍽️', color: 'from-orange-500 to-red-500' },
  { name: 'coffee', icon: '☕', color: 'from-amber-500 to-orange-500' },
  { name: 'oil', icon: '⛽', color: 'from-gray-500 to-slate-600' },
  { name: 'family', icon: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-rose-500' },
  { name: 'debt', icon: '💳', color: 'from-red-500 to-pink-600' },
  { name: 'shopping', icon: '🛍️', color: 'from-purple-500 to-indigo-500' },
  { name: 'entertain', icon: '🎮', color: 'from-blue-500 to-cyan-500' },
];

export default function QuickActions() {
  const router = useRouter();
  const [quickExpenseAmount, setQuickExpenseAmount] = useState('');
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showQuickForms, setShowQuickForms] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<{category?: string, task?: string}>({});
  const { addTransaction } = useFinanceStore();
  const { addTask } = useTaskStore();
  const { addNotification } = useNotifications();

  const handleQuickExpense = (category: string) => {
    if (!quickExpenseAmount) return;
    
    const amount = parseFloat(quickExpenseAmount);
    if (isNaN(amount) || amount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount greater than 0'
      });
      return;
    }
    
    addTransaction({
      type: 'expense',
      category,
      amount,
      description: `Quick ${category} expense`,
      date: new Date(),
      userId: '1',
    });
    
    // Show success notification
    addNotification({
      type: 'success',
      title: 'Expense Added!',
      message: `Added ${formatVND(amount)} expense for ${category}`
    });
    
    // Visual feedback
    setRecentlyAdded({category});
    setTimeout(() => setRecentlyAdded({}), 2000);
    
    setQuickExpenseAmount('');
    // Don't hide forms immediately to allow for multiple quick entries
  };

  const handleQuickTask = () => {
    if (!quickTaskTitle.trim()) {
      addNotification({
        type: 'error',
        title: 'Invalid Task',
        message: 'Please enter a task title'
      });
      return;
    }
    
    addTask({
      title: quickTaskTitle,
      description: '',
      type: 'daily',
      priority: 'medium',
      dueDate: new Date(),
      userId: '1',
      completed: false,
    });
    
    // Show success notification
    addNotification({
      type: 'success',
      title: 'Task Added!',
      message: `Added task: ${quickTaskTitle}`
    });
    
    // Visual feedback
    setRecentlyAdded({task: quickTaskTitle});
    setTimeout(() => setRecentlyAdded({}), 2000);
    
    setQuickTaskTitle('');
    // Don't hide forms immediately
  };

  const todayTasks = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Card variant="glass" className="group">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text">Quick Actions</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuickForms(!showQuickForms)}
            className="text-sm hover:bg-white/10"
          >
            {showQuickForms ? 'Hide' : 'Show'} Forms
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Button
            variant="morphic"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => router.push('/finance')}
          >
            <DollarSign className="h-6 w-6" />
            <span className="text-sm font-medium">Add Transaction</span>
          </Button>
          
          <Button
            variant="morphic"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => router.push('/debt')}
          >
            <CreditCard className="h-6 w-6" />
            <span className="text-sm font-medium">Manage Debt</span>
          </Button>
          
          <Button
            variant="morphic"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => router.push('/tasks/daily')}
          >
            <CheckSquare className="h-6 w-6" />
            <span className="text-sm font-medium">Add Daily Task</span>
          </Button>
          
          <Button
            variant="morphic"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => router.push('/tasks/monthly')}
          >
            <Target className="h-6 w-6" />
            <span className="text-sm font-medium">Monthly Goals</span>
          </Button>
          
          <Button
            variant="morphic"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => setShowQuickForms(true)}
          >
            <Clock className="h-6 w-6" />
            <span className="text-sm font-medium">Quick Entry</span>
          </Button>
        </div>

        {/* Quick Forms */}
        {showQuickForms && (
          <div className="space-y-6 animate-slide-down">
            {/* Quick Expense */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Quick Expense</span>
              </h3>
              
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={quickExpenseAmount}
                  onChange={(e) => setQuickExpenseAmount(e.target.value)}
                  className="text-center text-lg font-semibold"
                />
                
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {expenseCategories.map((category) => {
                    const isRecentlyAdded = recentlyAdded.category === category.name;
                    return (
                      <button
                        key={category.name}
                        onClick={() => handleQuickExpense(category.name)}
                        disabled={!quickExpenseAmount}
                        className={`
                          p-3 rounded-xl text-white font-medium text-sm
                          bg-gradient-to-br ${category.color}
                          hover:scale-105 active:scale-95 transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed
                          flex flex-col items-center space-y-1 relative
                          ${isRecentlyAdded ? 'ring-2 ring-white/50 scale-105' : ''}
                        `}
                      >
                        {isRecentlyAdded && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-lg">{category.icon}</span>
                        <span className="capitalize text-xs">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Task */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span>Quick Task for {todayTasks}</span>
                {recentlyAdded.task && (
                  <div className="ml-auto flex items-center space-x-2 text-green-600 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Added!</span>
                  </div>
                )}
              </h3>
              
              <div className="flex space-x-3">
                <Input
                  placeholder="Enter task title..."
                  value={quickTaskTitle}
                  onChange={(e) => setQuickTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickTask()}
                  className={`flex-1 ${recentlyAdded.task ? 'ring-2 ring-green-500/20' : ''}`}
                />
                <Button
                  onClick={handleQuickTask}
                  disabled={!quickTaskTitle.trim()}
                  variant="gradient"
                  className={`px-6 ${recentlyAdded.task ? 'bg-green-500 hover:bg-green-600' : ''}`}
                >
                  {recentlyAdded.task ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {recentlyAdded.task ? 'Added' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Productivity Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-sm">💡</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Use keyboard shortcuts (⌘+E for expenses, ⌘+T for tasks)
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-sm">📊</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Smart:</strong> Track patterns in your spending habits automatically
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-sm">⚡</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Fast:</strong> Double-tap categories for common expense amounts
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
