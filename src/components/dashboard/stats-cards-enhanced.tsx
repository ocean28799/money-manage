'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { useFinanceStore } from '@/store/finance-store';
import { useDebtStore } from '@/store/debt-store';
import { useTaskStore } from '@/store/task-store';
import { usePerformance } from '@/lib/hooks';
import { formatVNDShort } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, CreditCard, Target, AlertTriangle } from 'lucide-react';

export default function StatsCards() {
  usePerformance('StatsCards');
  const [mounted, setMounted] = useState(false);
  const { getFinanceSummary } = useFinanceStore();
  const { getDebtSummary } = useDebtStore();
  const { getTaskStats } = useTaskStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { financeSummary, debtSummary, taskStats } = useMemo(() => {
    if (!mounted) {
      return { 
        financeSummary: { balance: 0, remainingMoney: 0, monthlyIncome: 0, monthlyExpenses: 0, totalIncome: 0, totalExpenses: 0, monthlyBudget: 0 }, 
        debtSummary: { totalDebt: 0, monthlyPayments: 0, totalDebts: 0 }, 
        taskStats: { completed: 0, pending: 0, overdue: 0 } 
      };
    }
    return {
      financeSummary: getFinanceSummary(),
      debtSummary: getDebtSummary(),
      taskStats: getTaskStats(),
    };
  }, [mounted, getFinanceSummary, getDebtSummary, getTaskStats]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[...Array(6)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Current Balance',
      value: formatVNDShort(financeSummary.balance),
      icon: DollarSign,
      gradient: financeSummary.balance >= 0 
        ? 'from-emerald-400 via-teal-500 to-cyan-600' 
        : 'from-red-400 via-pink-500 to-rose-600',
      iconBg: financeSummary.balance >= 0 
        ? 'from-emerald-500 to-teal-600' 
        : 'from-red-500 to-pink-600',
      change: '+12.5%',
      changeType: 'positive' as const,
      priority: financeSummary.balance < 0 ? 'high' : 'normal',
    },
    {
      title: 'Available Money',
      value: formatVNDShort(financeSummary.remainingMoney),
      icon: TrendingUp,
      gradient: financeSummary.remainingMoney >= 0 
        ? 'from-green-400 via-emerald-500 to-teal-600' 
        : 'from-red-400 via-pink-500 to-rose-600',
      iconBg: financeSummary.remainingMoney >= 0 
        ? 'from-green-500 to-emerald-600' 
        : 'from-red-500 to-pink-600',
      change: financeSummary.remainingMoney >= 0 ? '+8.2%' : '-5.3%',
      changeType: financeSummary.remainingMoney >= 0 ? 'positive' as const : 'negative' as const,
      priority: financeSummary.remainingMoney < 0 ? 'high' : 'normal',
    },
    {
      title: 'Monthly Income',
      value: formatVNDShort(financeSummary.monthlyIncome),
      icon: TrendingUp,
      gradient: 'from-blue-400 via-purple-500 to-indigo-600',
      iconBg: 'from-blue-500 to-purple-600',
      change: '+8.2%',
      changeType: 'positive' as const,
      priority: 'normal',
    },
    {
      title: 'Monthly Expenses',
      value: formatVNDShort(financeSummary.monthlyExpenses),
      icon: TrendingDown,
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      iconBg: 'from-orange-500 to-red-600',
      change: '-3.1%',
      changeType: 'negative' as const,
      priority: financeSummary.monthlyExpenses > financeSummary.monthlyIncome ? 'high' : 'normal',
    },
    {
      title: 'Total Debt',
      value: formatVNDShort(debtSummary.totalDebt),
      icon: CreditCard,
      gradient: debtSummary.totalDebt > 0 
        ? 'from-red-400 via-orange-500 to-yellow-600' 
        : 'from-green-400 via-emerald-500 to-teal-600',
      iconBg: debtSummary.totalDebt > 0 
        ? 'from-red-500 to-orange-600' 
        : 'from-green-500 to-emerald-600',
      change: debtSummary.totalDebt > 0 ? '-5.2%' : '0%',
      changeType: debtSummary.totalDebt > 0 ? 'negative' as const : 'positive' as const,
      priority: debtSummary.totalDebt > financeSummary.monthlyIncome * 3 ? 'high' : 'normal',
    },
    {
      title: 'Completed Tasks',
      value: `${taskStats.completed}/${taskStats.completed + taskStats.pending + taskStats.overdue}`,
      icon: CheckCircle,
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      iconBg: 'from-green-500 to-emerald-600',
      change: `+${taskStats.completed}`,
      changeType: 'positive' as const,
      priority: taskStats.overdue > 5 ? 'high' : 'normal',
    },
  ];

  const healthScore = Math.max(0, Math.min(100, 
    50 + 
    (financeSummary.balance > 0 ? 20 : -20) +
    (financeSummary.remainingMoney > 0 ? 15 : -15) +
    (debtSummary.totalDebt === 0 ? 15 : -10) +
    (taskStats.completed > taskStats.overdue ? 10 : -5)
  ));

  return (
    <div className="space-y-6">
      {/* High Priority Alerts */}
      {stats.some(stat => stat.priority === 'high') && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-900">Financial Alerts</h4>
                <p className="text-sm text-orange-700">
                  {stats.filter(s => s.priority === 'high').length} items need your attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={`relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white/90 backdrop-blur-sm border-0 shadow-lg ${
              stat.priority === 'high' ? 'ring-2 ring-orange-300 shadow-orange-100' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Floating Animation */}
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30 group-hover:scale-110 transition-transform duration-500" />
            
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span>{stat.change}</span>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="ml-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="ml-1 h-3 w-3" />
                  )}
                </div>
                
                {stat.priority === 'high' && (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">Alert</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Health Score */}
      <Card className="glass border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Financial Health Score</h3>
                <p className="text-sm text-gray-600">Based on your current financial status</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {healthScore.toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">out of 100</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
