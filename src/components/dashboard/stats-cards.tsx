'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/finance-store';
import { useDebtStore } from '@/store/debt-store';
import { useTaskStore } from '@/store/task-store';
import { formatVNDShort } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, Clock, CreditCard } from 'lucide-react';

export default function StatsCards() {
  const { getFinanceSummary } = useFinanceStore();
  const { getDebtSummary } = useDebtStore();
  const { getTaskStats } = useTaskStore();
  
  const financeSummary = getFinanceSummary();
  const debtSummary = getDebtSummary();
  const taskStats = getTaskStats();

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
    },
    {
      title: 'Remaining Money',
      value: formatVNDShort(financeSummary.remainingMoney),
      icon: TrendingUp,
      gradient: financeSummary.remainingMoney >= 0 
        ? 'from-green-400 via-emerald-500 to-teal-600' 
        : 'from-red-400 via-pink-500 to-rose-600',
      iconBg: financeSummary.remainingMoney >= 0 
        ? 'from-green-500 to-emerald-600' 
        : 'from-red-500 to-pink-600',
      change: financeSummary.remainingMoney >= 0 ? '+' : '',
      changeType: financeSummary.remainingMoney >= 0 ? 'positive' as const : 'negative' as const,
    },
    {
      title: 'Monthly Income',
      value: formatVNDShort(financeSummary.monthlyIncome),
      icon: TrendingUp,
      gradient: 'from-blue-400 via-purple-500 to-indigo-600',
      iconBg: 'from-blue-500 to-purple-600',
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Monthly Expenses',
      value: formatVNDShort(financeSummary.monthlyExpenses),
      icon: TrendingDown,
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      iconBg: 'from-orange-500 to-red-600',
      change: '-3.1%',
      changeType: 'negative' as const,
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
    },
    {
      title: 'Completed Tasks',
      value: taskStats.completed.toString(),
      icon: CheckCircle,
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      iconBg: 'from-green-500 to-emerald-600',
      change: '+15.3%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Tasks',
      value: taskStats.pending.toString(),
      icon: Clock,
      gradient: 'from-amber-400 via-yellow-500 to-orange-600',
      iconBg: 'from-amber-500 to-yellow-600',
      change: '+5.7%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 stats-grid">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            variant="glass"
            className="group relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
            
            {/* Floating orb decoration - hidden on mobile */}
            <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${stat.iconBg} rounded-full opacity-10 group-hover:scale-125 transition-transform duration-700 hidden sm:block`} />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3 relative z-10">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.iconBg} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10 pt-0">
              <div className="space-y-2 sm:space-y-3">
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                
                {/* Change indicator - simplified on mobile */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600 rotate-180'
                    }`} />
                    <span className="hidden sm:inline">{stat.change}</span>
                  </div>
                  <span className="text-xs text-gray-500 hidden sm:inline">vs last month</span>
                </div>
              </div>
            </CardContent>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />
          </Card>
        );
      })}
    </div>
  );
}
