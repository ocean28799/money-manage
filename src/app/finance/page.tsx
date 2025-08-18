'use client';

import TransactionFormSuper from '@/components/finance/transaction-form-super';
import TransactionList from '@/components/finance/transaction-list';
import { Progress, CircularProgress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet, PieChart, BarChart3, Filter, ChevronDown } from 'lucide-react';
import { useFinanceStore } from '@/store/finance-store';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

export default function FinancePage() {
  const { transactions } = useFinanceStore();
  
  // Date filter state
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    filterType: 'range' as 'range' | 'month'
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (dateFilter.filterType === 'month') {
        return transactionDate.getMonth() === dateFilter.selectedMonth &&
               transactionDate.getFullYear() === dateFilter.selectedYear;
      } else {
        return transactionDate >= dateFilter.startDate && transactionDate <= dateFilter.endDate;
      }
    });
  }, [transactions, dateFilter]);

  // Calculate filtered finance data
  const filteredFinanceData = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      remainingMoney: income - expenses
    };
  }, [filteredTransactions]);

  // Calculate filtered category data
  const filteredCategoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] += transaction.amount;
        } else {
          categoryTotals[transaction.category] = transaction.amount;
        }
      });
    
    return categoryTotals;
  }, [filteredTransactions]);

  const totalBudget = filteredFinanceData.income || 5800000;
  const usedBudget = filteredFinanceData.expenses || 0;
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

  // Month names for dropdown
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-First Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl md:rounded-3xl border border-green-100">
        <div className="relative p-4 md:p-6 lg:p-8">
          <div className="flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <Wallet className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Finance Manager
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                    Track your money smartly 💰
                  </p>
                </div>
              </div>
              
              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm border-green-200 hover:bg-white/70"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Date Filter Controls */}
            {showFilters && (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex space-x-2">
                    <Button
                      variant={dateFilter.filterType === 'range' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDateFilter(prev => ({ ...prev, filterType: 'range' }))}
                      className="flex-1 sm:flex-none"
                    >
                      Date Range
                    </Button>
                    <Button
                      variant={dateFilter.filterType === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDateFilter(prev => ({ ...prev, filterType: 'month' }))}
                      className="flex-1 sm:flex-none"
                    >
                      By Month
                    </Button>
                  </div>
                  
                  {dateFilter.filterType === 'range' ? (
                    <div className="flex space-x-2 flex-1">
                      <input
                        type="date"
                        value={dateFilter.startDate.toISOString().split('T')[0]}
                        onChange={(e) => setDateFilter(prev => ({ 
                          ...prev, 
                          startDate: new Date(e.target.value) 
                        }))}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={dateFilter.endDate.toISOString().split('T')[0]}
                        onChange={(e) => setDateFilter(prev => ({ 
                          ...prev, 
                          endDate: new Date(e.target.value) 
                        }))}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div className="flex space-x-2 flex-1">
                      <select
                        value={dateFilter.selectedMonth}
                        onChange={(e) => setDateFilter(prev => ({ 
                          ...prev, 
                          selectedMonth: parseInt(e.target.value) 
                        }))}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {monthNames.map((month, index) => (
                          <option key={index} value={index}>{month}</option>
                        ))}
                      </select>
                      <select
                        value={dateFilter.selectedYear}
                        onChange={(e) => setDateFilter(prev => ({ 
                          ...prev, 
                          selectedYear: parseInt(e.target.value) 
                        }))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateFilter(prev => ({
                      ...prev,
                      filterType: 'range',
                      startDate: new Date(),
                      endDate: new Date()
                    }))}
                    className="text-xs"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateFilter(prev => ({
                      ...prev,
                      filterType: 'range',
                      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      endDate: new Date()
                    }))}
                    className="text-xs"
                  >
                    Last 7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateFilter(prev => ({
                      ...prev,
                      filterType: 'range',
                      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      endDate: new Date()
                    }))}
                    className="text-xs"
                  >
                    Last 30 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      setDateFilter(prev => ({
                        ...prev,
                        filterType: 'month',
                        selectedMonth: now.getMonth(),
                        selectedYear: now.getFullYear()
                      }));
                    }}
                    className="text-xs"
                  >
                    This month
                  </Button>
                </div>
              </div>
            )}
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl text-center border border-green-100">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-600">Income</p>
                <p className="text-sm md:text-lg lg:text-xl font-bold text-gray-900">
                  ${filteredFinanceData.income.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl text-center border border-green-100">
                <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-red-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-600">Spent</p>
                <p className="text-sm md:text-lg lg:text-xl font-bold text-gray-900">
                  ${filteredFinanceData.expenses.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl text-center border border-green-100">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-600">Balance</p>
                <p className="text-sm md:text-lg lg:text-xl font-bold text-emerald-600">
                  ${filteredFinanceData.balance.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl text-center border border-green-100">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-600">Used</p>
                <p className="text-sm md:text-lg lg:text-xl font-bold text-gray-900">
                  {budgetPercentage.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Usage</span>
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
              
              {/* Circular Progress for larger screens */}
              <div className="hidden lg:block">
                <CircularProgress
                  value={budgetPercentage}
                  size={100}
                  variant="gradient"
                  className="shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown - Mobile Optimized */}
      <Card className="bg-white/60 backdrop-blur-sm border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <PieChart className="h-5 w-5 text-purple-500" />
            <span>Spending by Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(filteredCategoryData).length > 0 ? (
              Object.entries(filteredCategoryData).map(([category, amount]) => {
                const percentage = filteredFinanceData.expenses > 0 ? (amount / filteredFinanceData.expenses) * 100 : 0;
                const icon = categoryIcons[category] || '📦';
                return (
                  <div key={category} className="flex items-center justify-between p-2 rounded-lg bg-white/40">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{icon}</div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize text-sm">{category}</p>
                        <p className="text-xs text-gray-500">${amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" size="sm">
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PieChart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No expenses in selected period</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <TransactionFormSuper />
      <TransactionList filteredTransactions={filteredTransactions} />
    </div>
  );
}
