'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/finance-store';
import { useTaskStore } from '@/store/task-store';
import { useDebtStore } from '@/store/debt-store';
import { formatVND, cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, eachMonthOfInterval } from 'date-fns';

interface AnalyticsProps {
  className?: string;
}

export default function Analytics({ className }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '1y'>('6m');
  const { transactions, getFinanceSummary } = useFinanceStore();
  const { getTaskStats } = useTaskStore();
  const { getDebtSummary } = useDebtStore();

  const periods = useMemo(() => ({
    '3m': { months: 3, label: '3 Months' },
    '6m': { months: 6, label: '6 Months' },
    '1y': { months: 12, label: '1 Year' },
  }), []);

  const analyticsData = useMemo(() => {
    const now = new Date();
    const startDate = subMonths(now, periods[selectedPeriod].months);
    
    // Monthly trends
    const monthlyData = eachMonthOfInterval({
      start: startDate,
      end: now,
    }).map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        net: income - expenses,
      };
    });

    // Category analysis
    const categoryAnalysis = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = { income: 0, expenses: 0, count: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[category].income += transaction.amount;
      } else {
        acc[category].expenses += transaction.amount;
      }
      
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { income: number; expenses: number; count: number }>);

    // Spending trends
    const currentMonth = getFinanceSummary();
    const lastMonth = monthlyData[monthlyData.length - 2];
    const spendingTrend = lastMonth 
      ? ((currentMonth.monthlyExpenses - lastMonth.expenses) / lastMonth.expenses) * 100
      : 0;

    // Savings rate
    const savingsRate = currentMonth.monthlyIncome > 0 
      ? ((currentMonth.monthlyIncome - currentMonth.monthlyExpenses) / currentMonth.monthlyIncome) * 100
      : 0;

    return {
      monthlyData,
      categoryAnalysis,
      spendingTrend,
      savingsRate,
      totalTransactions: transactions.length,
    };
  }, [transactions, selectedPeriod, getFinanceSummary, periods]);

  const taskStats = getTaskStats();
  const debtSummary = getDebtSummary();
  const financeSummary = getFinanceSummary();

  // Insights and recommendations
  const insights = useMemo(() => {
    const insights = [];

    // Spending trend insight
    if (analyticsData.spendingTrend > 10) {
      insights.push({
        type: 'warning',
        title: 'Increased Spending',
        description: `Your expenses increased by ${analyticsData.spendingTrend.toFixed(1)}% this month`,
        icon: TrendingUp,
      });
    } else if (analyticsData.spendingTrend < -10) {
      insights.push({
        type: 'success',
        title: 'Great Savings!',
        description: `You reduced expenses by ${Math.abs(analyticsData.spendingTrend).toFixed(1)}% this month`,
        icon: TrendingDown,
      });
    }

    // Savings rate insight
    if (analyticsData.savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        description: `Only ${analyticsData.savingsRate.toFixed(1)}% savings rate. Aim for 20%+`,
        icon: Target,
      });
    } else if (analyticsData.savingsRate > 30) {
      insights.push({
        type: 'success',
        title: 'Excellent Savings!',
        description: `Outstanding ${analyticsData.savingsRate.toFixed(1)}% savings rate`,
        icon: CheckCircle,
      });
    }

    // Debt insight
    if (debtSummary.totalDebt > financeSummary.monthlyIncome * 3) {
      insights.push({
        type: 'error',
        title: 'High Debt Load',
        description: 'Consider debt consolidation or payment plan',
        icon: AlertTriangle,
      });
    }

    // Task completion insight
    const completionRate = taskStats.completed / (taskStats.completed + taskStats.pending + taskStats.overdue) * 100;
    if (completionRate < 70) {
      insights.push({
        type: 'info',
        title: 'Task Management',
        description: `${completionRate.toFixed(0)}% completion rate. Stay organized!`,
        icon: Clock,
      });
    }

    return insights;
  }, [analyticsData, debtSummary, financeSummary, taskStats]);

  const topCategories = useMemo(() => {
    return Object.entries(analyticsData.categoryAnalysis)
      .sort((a, b) => b[1].expenses - a[1].expenses)
      .slice(0, 5)
      .map(([category, data]) => ({
        category,
        amount: data.expenses,
        percentage: (data.expenses / Object.values(analyticsData.categoryAnalysis).reduce((sum, cat) => sum + cat.expenses, 0)) * 100,
      }));
  }, [analyticsData.categoryAnalysis]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Period Selector */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span>Financial Analytics</span>
            </CardTitle>
            <div className="flex space-x-2">
              {Object.entries(periods).map(([key, { label }]) => (
                <Button
                  key={key}
                  variant={selectedPeriod === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(key as '3m' | '6m' | '1y')}
                  className="transition-all duration-200"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Savings Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                analyticsData.savingsRate > 20 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-orange-100 text-orange-600'
              )}>
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Spending Trend</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.spendingTrend > 0 ? '+' : ''}{analyticsData.spendingTrend.toFixed(1)}%
                </p>
              </div>
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                analyticsData.spendingTrend > 0 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-green-100 text-green-600'
              )}>
                {analyticsData.spendingTrend > 0 ? (
                  <TrendingUp className="h-6 w-6" />
                ) : (
                  <TrendingDown className="h-6 w-6" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalTransactions}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Task Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.completed}/{taskStats.completed + taskStats.pending + taskStats.overdue}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Spending Categories */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Top Spending Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCategories.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    index === 0 && 'bg-red-500',
                    index === 1 && 'bg-orange-500',
                    index === 2 && 'bg-yellow-500',
                    index === 3 && 'bg-green-500',
                    index === 4 && 'bg-blue-500'
                  )} />
                  <span className="font-medium capitalize">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatVND(item.amount)}</p>
                  <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {insights.length > 0 && (
        <Card className="glass border-0 shadow-xl">
          <CardHeader>
            <CardTitle>💡 Financial Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-xl border-l-4 bg-gradient-to-r',
                    insight.type === 'success' && 'border-green-500 from-green-50 to-emerald-50',
                    insight.type === 'warning' && 'border-yellow-500 from-yellow-50 to-orange-50',
                    insight.type === 'error' && 'border-red-500 from-red-50 to-pink-50',
                    insight.type === 'info' && 'border-blue-500 from-blue-50 to-indigo-50'
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <insight.icon className={cn(
                      'h-5 w-5 mt-0.5',
                      insight.type === 'success' && 'text-green-600',
                      insight.type === 'warning' && 'text-yellow-600',
                      insight.type === 'error' && 'text-red-600',
                      insight.type === 'info' && 'text-blue-600'
                    )} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-gray-600 text-sm">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
