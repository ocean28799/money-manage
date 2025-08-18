'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore } from '@/store/finance-store';
import { useTaskStore } from '@/store/task-store';
import { useDebtStore } from '@/store/debt-store';
import { formatVND, cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Lightbulb,
  DollarSign,
  PieChart,
  BarChart3,
  Brain,
  Zap
} from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  category: 'spending' | 'saving' | 'debt' | 'budget' | 'tasks';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ComponentType<{ className?: string }>;
  priority: number; // Higher number = higher priority
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSaving: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SmartInsights() {
  const { transactions, getFinanceSummary } = useFinanceStore();
  const { getTaskStats } = useTaskStore();
  const { getDebtSummary } = useDebtStore();

  const { insights, recommendations, monthlyAnalysis } = useMemo(() => {
    const financeSummary = getFinanceSummary();
    const taskStats = getTaskStats();
    const debtSummary = getDebtSummary();
    
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    // Get current and last month's transactions
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= startOfMonth(currentMonth) && date <= endOfMonth(currentMonth);
    });
    
    const lastMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= startOfMonth(lastMonth) && date <= endOfMonth(lastMonth);
    });

    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyAnalysis = {
      currentMonthExpenses,
      lastMonthExpenses,
      expenseChange: lastMonthExpenses > 0 
        ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
        : 0,
      totalTransactions: currentMonthTransactions.length,
    };

    // Category analysis
    const categorySpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topSpendingCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    // Generate insights
    const insights: Insight[] = [];
    let insightId = 1;

    // Spending trend insight
    if (monthlyAnalysis.expenseChange > 15) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'warning',
        category: 'spending',
        title: 'Spending Spike Detected',
        description: `Your expenses increased by ${monthlyAnalysis.expenseChange.toFixed(1)}% this month compared to last month`,
        impact: 'high',
        icon: TrendingUp,
        priority: 9,
        action: {
          label: 'View Details',
          onClick: () => console.log('View spending details'),
        },
      });
    } else if (monthlyAnalysis.expenseChange < -10) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'success',
        category: 'saving',
        title: 'Great Savings Progress!',
        description: `You reduced expenses by ${Math.abs(monthlyAnalysis.expenseChange).toFixed(1)}% this month`,
        impact: 'high',
        icon: CheckCircle,
        priority: 8,
      });
    }

    // Savings rate insight
    const savingsRate = financeSummary.monthlyIncome > 0 
      ? ((financeSummary.monthlyIncome - financeSummary.monthlyExpenses) / financeSummary.monthlyIncome) * 100
      : 0;

    if (savingsRate < 10) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'error',
        category: 'saving',
        title: 'Low Savings Rate',
        description: `Only ${savingsRate.toFixed(1)}% savings rate. Experts recommend 20%+`,
        impact: 'high',
        icon: AlertTriangle,
        priority: 10,
      });
    } else if (savingsRate > 30) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'success',
        category: 'saving',
        title: 'Excellent Saver!',
        description: `Outstanding ${savingsRate.toFixed(1)}% savings rate`,
        impact: 'medium',
        icon: Target,
        priority: 6,
      });
    }

    // Top spending category insight
    if (topSpendingCategory && topSpendingCategory[1] > financeSummary.monthlyIncome * 0.3) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'warning',
        category: 'budget',
        title: 'High Category Spending',
        description: `${topSpendingCategory[0]} accounts for ${((topSpendingCategory[1] / currentMonthExpenses) * 100).toFixed(1)}% of your expenses`,
        impact: 'medium',
        icon: PieChart,
        priority: 7,
      });
    }

    // Debt insight
    if (debtSummary.totalDebt > financeSummary.monthlyIncome * 3) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'error',
        category: 'debt',
        title: 'High Debt-to-Income Ratio',
        description: 'Consider debt consolidation or aggressive payment strategy',
        impact: 'high',
        icon: AlertTriangle,
        priority: 9,
      });
    }

    // Task completion insight
    const totalTasks = taskStats.completed + taskStats.pending + taskStats.overdue;
    const completionRate = totalTasks > 0 ? (taskStats.completed / totalTasks) * 100 : 0;
    
    if (taskStats.overdue > 3) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'warning',
        category: 'tasks',
        title: 'Task Management Alert',
        description: `You have ${taskStats.overdue} overdue tasks. Completion rate: ${completionRate.toFixed(1)}%`,
        impact: 'medium' as const,
        action: {
          label: 'Review Tasks',
          onClick: () => {
            window.location.href = '/tasks';
          }
        },
        icon: AlertTriangle,
        priority: 7,
      });
    } else if (completionRate > 80) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'success',
        category: 'tasks',
        title: 'Great Task Progress!',
        description: `Excellent completion rate of ${completionRate.toFixed(1)}%. Keep it up!`,
        impact: 'low' as const,
        icon: CheckCircle,
        priority: 3,
      });
    }

    // Emergency fund insight
    const emergencyFundTarget = financeSummary.monthlyExpenses * 6;
    if (financeSummary.balance < emergencyFundTarget) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'info',
        category: 'saving',
        title: 'Emergency Fund Gap',
        description: `Build emergency fund: ${formatVND(emergencyFundTarget - financeSummary.balance)} needed`,
        impact: 'medium' as const,
        icon: Target,
        priority: 6,
      });
    }

    // Generate recommendations
    const recommendations: Recommendation[] = [];

    // Coffee spending recommendation
    const coffeeSpending = categorySpending['coffee'] || 0;
    if (coffeeSpending > 300000) { // More than 300k VND per month
      recommendations.push({
        id: 'rec-coffee',
        title: 'Reduce Coffee Expenses',
        description: 'Consider making coffee at home 3 days a week',
        potentialSaving: coffeeSpending * 0.4,
        difficulty: 'easy',
        timeframe: 'immediate',
        icon: DollarSign,
      });
    }

    // Food delivery recommendation
    const foodSpending = categorySpending['food'] || 0;
    if (foodSpending > 2000000) { // More than 2M VND per month
      recommendations.push({
        id: 'rec-food',
        title: 'Meal Planning Strategy',
        description: 'Plan meals and cook at home more often',
        potentialSaving: foodSpending * 0.3,
        difficulty: 'medium',
        timeframe: '2-4 weeks',
        icon: Target,
      });
    }

    // Debt payoff recommendation
    if (debtSummary.totalDebt > 0) {
      recommendations.push({
        id: 'rec-debt',
        title: 'Debt Snowball Method',
        description: 'Focus on smallest debt first for quick wins',
        potentialSaving: debtSummary.totalDebt * 0.1, // Interest savings
        difficulty: 'medium',
        timeframe: '6-12 months',
        icon: TrendingDown,
      });
    }

    // Sort insights by priority
    insights.sort((a, b) => b.priority - a.priority);

    return { insights, recommendations, monthlyAnalysis };
  }, [transactions, getFinanceSummary, getTaskStats, getDebtSummary]);

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: Recommendation['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span>Smart Financial Insights</span>
            <Badge variant="gradient" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Key Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Key Insights
        </h3>
        
        {insights.length === 0 ? (
          <Card className="glass border-0">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">All Looking Good!</h4>
              <p className="text-gray-600">No critical insights detected. Keep up the great work!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {insights.slice(0, 5).map((insight) => (
              <Card
                key={insight.id}
                className={cn('border transition-all duration-200 hover:shadow-md', getInsightColor(insight.type))}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        insight.type === 'success' && 'bg-green-100 text-green-600',
                        insight.type === 'warning' && 'bg-yellow-100 text-yellow-600',
                        insight.type === 'error' && 'bg-red-100 text-red-600',
                        insight.type === 'info' && 'bg-blue-100 text-blue-600'
                      )}>
                        <insight.icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{insight.description}</p>
                      </div>
                    </div>
                    
                    {insight.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={insight.action.onClick}
                        className="ml-4"
                      >
                        {insight.action.label}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Smart Recommendations
          </h3>
          
          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="glass border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <rec.icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-sm">
                            <span className="text-gray-500">Potential saving: </span>
                            <span className="font-semibold text-green-600">
                              {formatVND(rec.potentialSaving)}/month
                            </span>
                          </div>
                          <Badge className={getDifficultyColor(rec.difficulty)}>
                            {rec.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500">{rec.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button size="sm" className="ml-4">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Analysis Summary */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>This Month&apos;s Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Total Transactions</h4>
              <p className="text-2xl font-bold text-blue-600">{monthlyAnalysis.totalTransactions}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-600 mb-1">This Month Expenses</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatVND(monthlyAnalysis.currentMonthExpenses)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Expense Change</h4>
              <p className={cn(
                'text-2xl font-bold',
                monthlyAnalysis.expenseChange > 0 ? 'text-red-600' : 'text-green-600'
              )}>
                {monthlyAnalysis.expenseChange > 0 ? '+' : ''}
                {monthlyAnalysis.expenseChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
