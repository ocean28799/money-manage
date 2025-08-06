'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/finance-store';
import { useTaskStore } from '@/store/task-store';
import { formatVNDShort } from '@/lib/utils';
import { 
  Activity, 
  DollarSign, 
  CheckCircle, 
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  Filter
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

export default function RecentActivity() {
  const { transactions } = useFinanceStore();
  const { tasks } = useTaskStore();

  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get recent tasks (last 5)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd');
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: '🍽️',
      coffee: '☕',
      oil: '⛽',
      family: '👨‍👩‍👧‍👦',
      debt: '💳',
      shopping: '🛍️',
      entertain: '🎮',
      salary: '💰',
      freelance: '💻',
      other: '📄'
    };
    return icons[category] || '📄';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'low': return 'from-green-500 to-teal-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recent Transactions */}
      <Card variant="glass" className="group">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-text">Recent Transactions</span>
            </div>
            <Button variant="ghost" size="sm" className="text-sm hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 group/item"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 capitalize truncate">
                          {transaction.category}
                        </p>
                        <Badge 
                          variant={transaction.type === 'income' ? 'success' : 'error'}
                          className="text-xs"
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {transaction.description || 'No description'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(transaction.date))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-semibold">
                        {transaction.type === 'income' ? '+' : '-'}{formatVNDShort(transaction.amount)}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/finance'}
          >
            View All Transactions
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card variant="glass" className="group">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-text">Recent Tasks</span>
            </div>
            <Button variant="ghost" size="sm" className="text-sm hover:bg-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks yet</p>
              <p className="text-sm">Create your first task to get organized</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 group/item"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getPriorityColor(task.priority)}`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className={`font-medium truncate ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </p>
                        <Badge 
                          variant={task.type === 'daily' ? 'info' : 'warning'}
                          className="text-xs"
                        >
                          {task.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        Due: {formatDate(new Date(task.dueDate))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={task.completed ? 'success' : 'warning'}
                      className={`text-xs ${
                        task.completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {task.completed ? 'Done' : 'Pending'}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/tasks/daily'}
          >
            View All Tasks
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card variant="glass" className="group">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text">Today&apos;s Overview</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(t => 
                  isToday(new Date(t.date)) && t.type === 'income'
                ).length}
              </div>
              <p className="text-sm text-gray-600">Income Today</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {transactions.filter(t => 
                  isToday(new Date(t.date)) && t.type === 'expense'
                ).length}
              </div>
              <p className="text-sm text-gray-600">Expenses Today</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => 
                  isToday(new Date(t.dueDate)) && !t.completed
                ).length}
              </div>
              <p className="text-sm text-gray-600">Due Today</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {tasks.filter(t => 
                  isToday(new Date(t.updatedAt)) && t.completed
                ).length}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
