'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDebtStore } from '@/store/debt-store';
import { usePersonalDebtStore } from '@/store/personal-debt-store';
import { formatVNDShort } from '@/lib/utils';
import DebtForm from '@/components/debt/debt-form';
import PersonalDebtForm from '@/components/debt/personal-debt-form';
import PersonalDebtPaymentForm from '@/components/debt/personal-debt-payment-form';
import { 
  CreditCard, 
  TrendingDown, 
  Calendar, 
  Plus,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  DollarSign,
  Users
} from 'lucide-react';

export default function DebtPage() {
  const { debts, getDebtSummary } = useDebtStore();
  const { 
    personalDebts, 
    getPersonalDebtSummary
  } = usePersonalDebtStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPersonalDebtForm, setShowPersonalDebtForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'banking' | 'personal'>('banking');
  
  const debtSummary = getDebtSummary();
  const personalDebtSummary = getPersonalDebtSummary();
  const activeDebts = debts.filter(debt => debt.isActive);
  const activePersonalDebts = personalDebts.filter(debt => debt.isActive);

  // If any form is showing, display it inline like the loan page
  if (showAddForm) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden content-padding">
        <DebtForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  if (showPersonalDebtForm) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden content-padding">
        <PersonalDebtForm
          onClose={() => setShowPersonalDebtForm(false)}
          onSuccess={() => setShowPersonalDebtForm(false)}
        />
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden content-padding">
        <PersonalDebtPaymentForm
          personalDebtId={showPaymentForm}
          onClose={() => setShowPaymentForm(null)}
          onSuccess={() => setShowPaymentForm(null)}
        />
      </div>
    );
  }
  
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
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden content-padding">
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
                    Track banking and personal debts 💳👥
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-white/70 rounded-xl p-1 backdrop-blur-sm border border-gray-200/50">
              <button
                onClick={() => setActiveTab('banking')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'banking'
                    ? 'bg-white shadow-md text-red-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🏦 Banking Debt
              </button>
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'personal'
                    ? 'bg-white shadow-md text-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                👥 Personal Debt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'banking' && (
        <>
          {/* Add Banking Debt Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddForm(true)}
              variant="gradient"
              size="lg"
              className="shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Banking Debt
            </Button>
          </div>

          {/* Banking Debt Summary Cards */}
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
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass" className="group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Monthly Payment</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                      {formatVNDShort(debtSummary.totalMonthlyPayments)}
                    </p>
                  </div>
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass" className="group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Interest/Month</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                      {formatVNDShort(debtSummary.totalInterestPerMonth)}
                    </p>
                  </div>
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass" className="group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Payoff</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                      {Math.round(debtSummary.averagePayoffMonths)} mo
                    </p>
                  </div>
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Banking Debts List */}
          <div className="grid gap-4 sm:gap-6">
            {activeDebts.length === 0 ? (
              <Card variant="glass">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Banking Debts</h3>
                  <p className="text-gray-600 mb-4">Start tracking your credit cards, loans, and other banking debts.</p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    variant="gradient"
                    className="shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Banking Debt
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeDebts.map((debt) => (
                <Card key={debt.id} variant="glass" className="group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(debt.category)} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <span className="text-white text-lg">{getCategoryIcon(debt.category)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{debt.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{debt.description || 'No description'}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="default" className="text-xs">
                              {debt.category.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="warning" className="text-xs">
                              {debt.interestRate}% APR
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end space-y-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold text-red-600">
                            {formatVNDShort(debt.remainingAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            of {formatVNDShort(debt.totalAmount)}
                          </p>
                        </div>
                        <div className="w-full sm:w-32">
                          <Progress 
                            value={((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {Math.round(((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100)}% paid
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">
                            {formatVNDShort(debt.monthlyPayment)}/month
                          </p>
                          <p className="text-xs text-gray-500">
                            {debt.remainingMonths} months left
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'personal' && (
        <>
          {/* Add Personal Debt Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setShowPersonalDebtForm(true)}
              variant="gradient"
              size="lg"
              className="shadow-lg bg-gradient-to-r from-purple-500 to-pink-600"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Personal Debt
            </Button>
          </div>

          {/* Personal Debt Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card variant="glass" className="group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Borrowed</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                      {formatVNDShort(personalDebtSummary.totalPersonalDebt)}
                    </p>
                  </div>
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass" className="group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Paid</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                      {formatVNDShort(personalDebtSummary.totalPaidAmount)}
                    </p>
                  </div>
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass" className="group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Debts</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                      {personalDebtSummary.activeDebtsCount}
                    </p>
                  </div>
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass" className="group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Paid Off</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                      {personalDebtSummary.paidOffDebtsCount}
                    </p>
                  </div>
                  <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Debts List */}
          <div className="grid gap-4 sm:gap-6">
            {activePersonalDebts.length === 0 ? (
              <Card variant="glass">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Personal Debts</h3>
                  <p className="text-gray-600 mb-4">Track money you owe to friends, family, or colleagues.</p>
                  <Button
                    onClick={() => setShowPersonalDebtForm(true)}
                    variant="gradient"
                    className="shadow-lg bg-gradient-to-r from-purple-500 to-pink-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Personal Debt
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activePersonalDebts.map((debt) => (
                <Card key={debt.id} variant="glass" className="group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white text-lg">
                            {debt.category === 'friend' ? '👤' : 
                             debt.category === 'family' ? '👨‍👩‍👧‍👦' :
                             debt.category === 'colleague' ? '💼' : '📄'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{debt.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{debt.description || 'No description'}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="default" className="text-xs">
                              {debt.category.toUpperCase()}
                            </Badge>
                            <Badge variant="success" className="text-xs">
                              No Interest
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end space-y-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold text-purple-600">
                            {formatVNDShort(debt.remainingAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            of {formatVNDShort(debt.totalAmount)}
                          </p>
                        </div>
                        <div className="w-full sm:w-32">
                          <Progress 
                            value={((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {Math.round(((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100)}% paid
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="gradient"
                            onClick={() => setShowPaymentForm(debt.id)}
                            className="text-xs bg-gradient-to-r from-green-500 to-emerald-600"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            Pay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {/* Form Modals */}
      {showAddForm && (
        <DebtForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            // Refresh data or show success message
          }}
        />
      )}

      {showPersonalDebtForm && (
        <PersonalDebtForm
          onClose={() => setShowPersonalDebtForm(false)}
          onSuccess={() => {
            // Refresh data or show success message
          }}
        />
      )}

      {showPaymentForm && (
        <PersonalDebtPaymentForm
          personalDebtId={showPaymentForm}
          onClose={() => setShowPaymentForm(null)}
          onSuccess={() => {
            // Refresh data or show success message
          }}
        />
      )}
    </div>
  );
}
