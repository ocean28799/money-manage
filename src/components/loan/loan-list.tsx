'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLoanStore } from '@/store/loan-store';
import { LoanForm } from './loan-form';
import { Loan } from '@/types';

export function LoanList() {
  const { loans, deleteLoan, makePayment, getLoanPayments, initializeMockData } = useLoanStore();
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>({});
  const [showPayments, setShowPayments] = useState<Record<string, boolean>>({});

  // Initialize mock data on component mount
  useEffect(() => {
    if (loans.length === 0) {
      initializeMockData();
    }
  }, [loans.length, initializeMockData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      auto: 'bg-green-100 text-green-800',
      home: 'bg-purple-100 text-purple-800',
      student: 'bg-yellow-100 text-yellow-800',
      business: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getProgressPercentage = (loan: Loan) => {
    return (loan.amountPaid / loan.totalAmount) * 100;
  };

  const handleMakePayment = (loanId: string) => {
    const amount = Number(paymentAmounts[loanId]);
    if (amount > 0) {
      makePayment(loanId, amount, `Payment of ${formatCurrency(amount)}`);
      setPaymentAmounts(prev => ({ ...prev, [loanId]: '' }));
    }
  };

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLoan(null);
  };

  const togglePaymentHistory = (loanId: string) => {
    setShowPayments(prev => ({ ...prev, [loanId]: !prev[loanId] }));
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <LoanForm onClose={handleCloseForm} editingLoan={editingLoan || undefined} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Loan Management</h1>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          Add New Loan
        </Button>
      </div>

      {loans.length === 0 ? (
        <Card className="p-6 sm:p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No loans yet</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Start by adding your first loan to track your progress.</p>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            Add Your First Loan
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {loans.map((loan) => (
            <Card key={loan.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold">{loan.title}</h3>
                    <Badge className={getCategoryColor(loan.category)}>
                      {loan.category}
                    </Badge>
                    {!loan.isActive && (
                      <Badge variant="default">Inactive</Badge>
                    )}
                  </div>
                  {loan.description && (
                    <p className="text-gray-600 text-sm mb-2">{loan.description}</p>
                  )}
                </div>
                <div className="flex gap-2 self-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(loan)}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteLoan(loan.id)}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-base sm:text-lg font-semibold">{formatCurrency(loan.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-base sm:text-lg font-semibold text-green-600">{formatCurrency(loan.amountPaid)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-base sm:text-lg font-semibold text-red-600">{formatCurrency(loan.remainingAmount)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{getProgressPercentage(loan).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(getProgressPercentage(loan), 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600 mb-4">
                {loan.monthlyPayment && (
                  <div>
                    <p className="text-xs sm:text-sm">Monthly Payment</p>
                    <p className="font-medium text-sm">{formatCurrency(loan.monthlyPayment)}</p>
                  </div>
                )}
                {loan.interestRate && (
                  <div>
                    <p className="text-xs sm:text-sm">Interest Rate</p>
                    <p className="font-medium text-sm">{loan.interestRate}%</p>
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm">Start Date</p>
                  <p className="font-medium text-sm">{new Date(loan.startDate).toLocaleDateString()}</p>
                </div>
                {loan.targetPayoffDate && (
                  <div>
                    <p className="text-xs sm:text-sm">Target Payoff</p>
                    <p className="font-medium text-sm">{new Date(loan.targetPayoffDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Make Payment Section */}
              {loan.isActive && loan.remainingAmount > 0 && (
                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                    <div className="flex-1">
                      <label htmlFor={`payment-${loan.id}`} className="block text-sm font-medium mb-1">
                        Make Payment
                      </label>
                      <Input
                        id={`payment-${loan.id}`}
                        type="number"
                        placeholder="Enter amount"
                        value={paymentAmounts[loan.id] || ''}
                        onChange={(e) => setPaymentAmounts(prev => ({ 
                          ...prev, 
                          [loan.id]: e.target.value 
                        }))}
                        min="0"
                        max={loan.remainingAmount}
                        step="0.01"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => handleMakePayment(loan.id)}
                        disabled={!paymentAmounts[loan.id] || Number(paymentAmounts[loan.id]) <= 0}
                        className="flex-1 sm:flex-none"
                      >
                        Pay
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => togglePaymentHistory(loan.id)}
                        className="flex-1 sm:flex-none"
                      >
                        History
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment History */}
              {showPayments[loan.id] && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Payment History</h4>
                  {getLoanPayments(loan.id).length === 0 ? (
                    <p className="text-gray-600 text-sm">No payments made yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                      {getLoanPayments(loan.id).map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm sm:text-base">{formatCurrency(payment.amount)}</p>
                            {payment.description && (
                              <p className="text-xs text-gray-600">{payment.description}</p>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
