'use client';

import { LoanList } from '@/components/loan/loan-list';

export default function LoanPage() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-6xl">
      <LoanList />
    </div>
  );
}
