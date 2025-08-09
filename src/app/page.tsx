import StatsCards from '@/components/dashboard/stats-cards';
import FinanceCharts from '@/components/dashboard/finance-charts';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentActivity from '@/components/dashboard/recent-activity';
import { LoanSummaryCard } from '@/components/loan/loan-summary-card';

export default function Dashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 content-padding">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl" />
        <div className="absolute inset-0 bg-pattern opacity-30" />
        
        {/* Floating decorative elements - hidden on mobile */}
        <div className="absolute top-6 right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 floating hidden md:block" />
        <div className="absolute bottom-6 left-6 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-20 floating hidden md:block" style={{ animationDelay: '2s' }} />
        
        <div className="relative p-4 sm:p-6 lg:p-8 hero-mobile">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base lg:text-lg">
                  Welcome to your personal finance hub ✨
                </p>
              </div>
            </div>
            
            {/* Quick Access Buttons - hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="glass px-4 py-2 rounded-full hover:scale-105 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-blue-600">
                ⚡ Quick Add
              </button>
              <button className="glass px-4 py-2 rounded-full hover:scale-105 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-green-600">
                📊 Analytics
              </button>
            </div>
          </div>
          
          {/* Quick stats summary */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6">
            <div className="glass px-3 py-2 rounded-full">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Today&apos;s Progress</span>
            </div>
            <div className="glass px-3 py-2 rounded-full">
              <span className="text-xs sm:text-sm font-medium text-green-700">📈 +12% this month</span>
            </div>
            <div className="glass px-3 py-2 rounded-full">
              <span className="text-xs sm:text-sm font-medium text-blue-700">🎯 5 tasks remaining</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Grid */}
      <QuickActions />
      
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <FinanceCharts />
        </div>
        <div className="space-y-4 lg:space-y-6">
          <RecentActivity />
          <LoanSummaryCard />
        </div>
      </div>
    </div>
  );
}
