'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDebtStore } from '@/store/debt-store';
import { formatVNDShort } from '@/lib/utils';
import DebtForm from '@/components/debt/debt-form';
import { 
  CreditCard, 
  TrendingDown, 
  Calendar, 
  Plus,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function DebtPage() {
  const { debts, getDebtSummary, calculatePayoffSchedule } = useDebtStore();
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const debtSummary = getDebtSummary();
  const activeDebts = debts.filter(debt => debt.isActive);
  
  const selectedSchedule = selectedDebtId ? calculatePayoffSchedule(selectedDebtId) : [];
  
  const getCategoryIcon = (category: string) => {
    const icons = {
      credit_card: '💳',
      loan: '🏦',
      mortgage: '🏠',
      personal: '👤',
      other: '📄'
    };
    return icons[category as keyof typeof icons] || '📄';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      credit_card: 'from-red-500 to-pink-600',
      loan: 'from-blue-500 to-indigo-600',
      mortgage: 'from-green-500 to-emerald-600',
      personal: 'from-purple-500 to-violet-600',
      other: 'from-gray-500 to-slate-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-slate-600';
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-yellow-600/10 rounded-2xl sm:rounded-3xl" />
        <div className="absolute inset-0 bg-pattern opacity-20" />
        
        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
                    Debt Management
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                    Track and manage your debts effectively 💳
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowAddForm(true)}
                variant="gradient"
                size="lg"
                className="shadow-lg w-full sm:w-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Debt
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card variant="glass" className="group">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Debt</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                  {formatVNDShort(debtSummary.totalDebt)}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center order-1 sm:order-2 self-end sm:self-auto">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="group">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Monthly Payments</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                  {formatVNDShort(debtSummary.totalMonthlyPayments)}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center order-1 sm:order-2 self-end sm:self-auto">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="group">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Interest/Month</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
                  {formatVNDShort(debtSummary.totalInterestPerMonth)}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center order-1 sm:order-2 self-end sm:self-auto">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="group">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Payoff</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                  {Math.round(debtSummary.averagePayoffMonths)} months
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center order-1 sm:order-2 self-end sm:self-auto">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debt List */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <CreditCard className="h-5 w-5 text-red-500" />
              <span>Active Debts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {activeDebts.map((debt) => {
              const progressPercentage = debt.totalMonths > 0 
                ? ((debt.totalMonths - debt.remainingMonths) / debt.totalMonths) * 100 
                : 0;
              
              return (
                <div
                  key={debt.id}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer touch-manipulation ${
                    selectedDebtId === debt.id
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-gray-200 hover:border-gray-300 bg-white/50'
                  }`}
                  onClick={() => setSelectedDebtId(debt.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getCategoryColor(debt.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-sm">{getCategoryIcon(debt.category)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{debt.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{debt.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <Badge variant={debt.interestRate > 15 ? 'error' : 'default'} size="sm">
                      {debt.interestRate}% APR
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Debt</span>
                      <span className="font-semibold">{formatVNDShort(debt.remainingAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Months</span>
                      <span className="font-semibold">{debt.remainingMonths} / {debt.totalMonths}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progressPercentage.toFixed(1)}% completed</span>
                      <span>{debt.remainingMonths} months left</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-3 text-sm">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="font-semibold text-orange-600">
                      {formatVNDShort(debt.monthlyPayment)}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {activeDebts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No active debts! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Schedule */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calculator className="h-5 w-5 text-blue-500" />
              <span className="truncate">
                {selectedDebtId 
                  ? `Payment Schedule - ${debts.find(d => d.id === selectedDebtId)?.name}`
                  : 'Select a debt to view schedule'
                }
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSchedule.length > 0 ? (
              <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {selectedSchedule.slice(0, 12).map((payment, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-white/50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">Month {payment.month}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Principal: {formatVNDShort(payment.principal)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Interest: {formatVNDShort(payment.monthlyInterest)}
                      </p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="font-semibold text-sm sm:text-base">{formatVNDShort(payment.payment)}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Balance: {formatVNDShort(payment.balance)}
                      </p>
                    </div>
                  </div>
                ))}
                {selectedSchedule.length > 12 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    ... and {selectedSchedule.length - 12} more payments
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Select a debt to view payment schedule</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* This Month & Next Month Payments */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-green-500" />
              <span>This Month&apos;s Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {debtSummary.thisMonthPayments.map((payment) => {
                const debt = debts.find(d => d.id === payment.debtId);
                return (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-6 h-6 bg-gradient-to-br ${getCategoryColor(debt?.category || 'other')} rounded flex-shrink-0`}>
                        <span className="text-white text-xs flex items-center justify-center h-full">
                          {getCategoryIcon(debt?.category || 'other')}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-sm sm:text-base">{debt?.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Interest: {formatVNDShort(payment.interestAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="font-semibold text-green-600 text-sm sm:text-base">
                        {formatVNDShort(payment.amount)}
                      </p>
                      <p className="text-xs text-gray-500">Due today</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm sm:text-base">Total This Month</span>
                <span className="font-bold text-green-600 text-sm sm:text-base">
                  {formatVNDShort(debtSummary.thisMonthPayments.reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>Next Month&apos;s Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {debtSummary.nextMonthPayments.map((payment) => {
                const debt = debts.find(d => d.id === payment.debtId);
                return (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-6 h-6 bg-gradient-to-br ${getCategoryColor(debt?.category || 'other')} rounded flex-shrink-0`}>
                        <span className="text-white text-xs flex items-center justify-center h-full">
                          {getCategoryIcon(debt?.category || 'other')}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-sm sm:text-base">{debt?.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Interest: {formatVNDShort(payment.interestAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="font-semibold text-blue-600 text-sm sm:text-base">
                        {formatVNDShort(payment.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.paymentDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm sm:text-base">Total Next Month</span>
                <span className="font-bold text-blue-600 text-sm sm:text-base">
                  {formatVNDShort(debtSummary.nextMonthPayments.reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Debt Form Modal */}
      {showAddForm && (
        <DebtForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            // Refresh data or show success message
          }}
        />
      )}
    </div>
  );
}
