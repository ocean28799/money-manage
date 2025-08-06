'use client';

import { Card } from '@/components/ui/card';
import { useLoanStore } from '@/store/loan-store';
import Link from 'next/link';

export function LoanSummaryCard() {
  const { loans, getLoanSummary } = useLoanStore();
  const summary = getLoanSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeLoans = loans.filter(loan => loan.isActive);

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Loan Summary</h3>
        <Link 
          href="/loan" 
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 underline"
        >
          View All
        </Link>
      </div>
      
      {activeLoans.length === 0 ? (
        <div className="text-center py-3 sm:py-4">
          <p className="text-gray-600 mb-2 sm:mb-3 text-sm">No active loans</p>
          <Link 
            href="/loan" 
            className="text-blue-600 hover:text-blue-700 underline text-xs sm:text-sm"
          >
            Add your first loan
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Loans</p>
              <p className="text-lg sm:text-xl font-bold">{formatCurrency(summary.totalLoans)}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Paid</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Remaining</p>
              <p className="text-lg sm:text-xl font-bold text-red-600">{formatCurrency(summary.totalRemaining)}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Monthly Payments</p>
              <p className="text-lg sm:text-xl font-bold">{formatCurrency(summary.totalMonthlyPayments)}</p>
            </div>
          </div>

          <div className="pt-2 sm:pt-3 border-t">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">
                {summary.totalLoans > 0 
                  ? Math.round((summary.totalPaid / summary.totalLoans) * 100)
                  : 0
                }%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${summary.totalLoans > 0 
                    ? Math.min((summary.totalPaid / summary.totalLoans) * 100, 100)
                    : 0
                  }%` 
                }}
              ></div>
            </div>
          </div>

          {summary.averagePayoffMonths > 0 && (
            <div className="text-xs sm:text-sm text-gray-600">
              <p>Average payoff time: <span className="font-medium">{summary.averagePayoffMonths} months</span></p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
