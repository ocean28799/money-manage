'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { Transaction } from '@/types';
import { categoryConfig } from '@/lib/mock-data';
import { formatVNDShort } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Filter, Search, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  filteredTransactions?: Transaction[];
}

export default function TransactionList({ filteredTransactions: propFilteredTransactions }: TransactionListProps) {
  const { transactions, deleteTransaction } = useFinanceStore();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Use prop filtered transactions if provided, otherwise use internal filtering
  const baseTransactions = propFilteredTransactions || transactions;

  const filteredTransactions = baseTransactions.filter((transaction) => {
    const typeMatch = filter === 'all' || transaction.type === filter;
    const categoryMatch = !categoryFilter || transaction.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const dateMatch = !dateFilter || format(transaction.date, 'yyyy-MM-dd') === dateFilter;
    
    return typeMatch && categoryMatch && dateMatch;
  });

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-green-100">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg">Transaction History</span>
          </div>
          <Badge variant="info" size="sm">
            {filteredTransactions.length} transactions
          </Badge>
        </CardTitle>
        
        {/* Mobile-First Filters */}
        <div className="space-y-3">
          {/* Type Filter */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`p-3 rounded-xl border-2 transition-all text-center touch-manipulation ${
                filter === 'all'
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 active:scale-95'
              }`}
            >
              <div className="text-lg mb-1">📊</div>
              <div className="text-xs font-medium">All</div>
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`p-3 rounded-xl border-2 transition-all text-center touch-manipulation ${
                filter === 'income'
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 active:scale-95'
              }`}
            >
              <div className="text-lg mb-1">💰</div>
              <div className="text-xs font-medium">Income</div>
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`p-3 rounded-xl border-2 transition-all text-center touch-manipulation ${
                filter === 'expense'
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 active:scale-95'
              }`}
            >
              <div className="text-lg mb-1">💸</div>
              <div className="text-xs font-medium">Expense</div>
            </button>
          </div>
          
          {/* Search and Date Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search category..."
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 bg-white/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 bg-white/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
            </div>
          </div>
          
          {/* Clear Filters */}
          {(filter !== 'all' || categoryFilter || dateFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter('all');
                setCategoryFilter('');
                setDateFilter('');
              }}
              className="w-full sm:w-auto bg-white/50 border-gray-200 hover:bg-white/70"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No transactions found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => {
                const config = categoryConfig[transaction.type]?.[transaction.category as keyof typeof categoryConfig[typeof transaction.type]];
                return (
                  <div
                    key={transaction.id}
                    className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:bg-white/60 hover:shadow-md transition-all duration-200"
                  >
                    {/* Mobile-First Layout */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        {/* Category Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 border border-green-200' 
                            : 'bg-red-100 border border-red-200'
                        }`}>
                          <span className="text-xl">{config?.icon || '💰'}</span>
                        </div>
                        
                        {/* Transaction Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate text-base">
                              {transaction.description}
                            </h3>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="default" size="sm" className="text-xs">
                              {transaction.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {format(transaction.date, 'MMM dd, yyyy')}
                            </span>
                          </div>
                          
                          {/* Amount */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-lg md:text-xl font-bold ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {transaction.type === 'income' ? '+' : '-'}{formatVNDShort(transaction.amount)}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTransaction(transaction.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 min-h-[44px] min-w-[44px]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
