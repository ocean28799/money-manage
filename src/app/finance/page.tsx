'use client';

import TransactionForm from '@/components/finance/transaction-form';
import TransactionList from '@/components/finance/transaction-list';
import { Progress, CircularProgress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet, PieChart, BarChart3 } from 'lucide-react';
import { useFinanceStore } from '@/store/finance-store';

export default function FinancePage() {
  const { getFinanceSummary, getTransactionsByCategory } = useFinanceStore();
  const financeData = getFinanceSummary();
  const categoryData = getTransactionsByCategory();
  
  const totalBudget = financeData.monthlyIncome || 5800;
  const usedBudget = financeData.monthlyExpenses || 0;
  const budgetPercentage = totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0;

  // Category icons mapping
  const categoryIcons: Record<string, string> = {
    food: '🍽️',
    coffee: '☕',
    oil: '⛽',
    family: '👨‍👩‍👧‍👦',
    debt: '💳',
    shopping: '🛍️',
    entertain: '🎮',
    entertainment: '🎬',
    salary: '💰',
    transport: '🚗',
    health: '🏥',
    education: '📚',
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 rounded-3xl" />
        <div className="absolute inset-0 bg-pattern opacity-20" />
        
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
                    Finance Management
                  </h1>
                  <p className="text-gray-600 mt-2 text-base sm:text-lg">
                    Track your money and stay on budget 💰
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass p-3 sm:p-4 rounded-2xl text-center">
                  <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-600">Income</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    ${financeData.monthlyIncome.toLocaleString()}
                  </p>
                </div>
                
                <div className="glass p-3 sm:p-4 rounded-2xl text-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-600">Spent</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    ${financeData.monthlyExpenses.toLocaleString()}
                  </p>
                </div>
                
                <div className="glass p-3 sm:p-4 rounded-2xl text-center">
                  <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-600">Remaining</p>
                  <p className="text-lg sm:text-xl font-bold text-emerald-600">
                    ${financeData.remainingMoney.toLocaleString()}
                  </p>
                </div>
                
                <div className="glass p-3 sm:p-4 rounded-2xl text-center">
                  <BarChart3 className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-600">Used</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {budgetPercentage.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
            
            {/* Circular Progress */}
            <div className="flex justify-center lg:block">
              <CircularProgress
                value={budgetPercentage}
                size={120}
                variant="gradient"
                className="shadow-lg"
              />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Monthly Budget Usage</span>
              <Badge 
                variant={budgetPercentage > 80 ? 'error' : budgetPercentage > 60 ? 'warning' : 'success'}
                size="sm"
              >
                {budgetPercentage > 80 ? '⚠️ High' : budgetPercentage > 60 ? '⚡ Medium' : '✅ Good'}
              </Badge>
            </div>
            <Progress 
              value={budgetPercentage} 
              variant={budgetPercentage > 80 ? 'error' : budgetPercentage > 60 ? 'warning' : 'success'}
              showLabel 
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <Card variant="glass" className="lg:hidden">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            <span>Spending by Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(categoryData).map(([category, amount]) => {
              const percentage = financeData.monthlyExpenses > 0 ? (amount / financeData.monthlyExpenses) * 100 : 0;
              const icon = categoryIcons[category] || '📦';
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{icon}</div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{category}</p>
                      <p className="text-sm text-gray-500">${amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" size="sm">
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <TransactionForm />
      <TransactionList />
    </div>
  );
}
