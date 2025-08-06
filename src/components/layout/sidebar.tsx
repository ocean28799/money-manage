'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  DollarSign,
  CheckSquare,
  Calendar,
  Settings,
  Menu,
  X,
  CreditCard,
  PiggyBank,
  ChevronRight,
  User,
  Bell,
  Search,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, shortName: 'Home' },
  { name: 'Finance', href: '/finance', icon: DollarSign, shortName: 'Finance' },
  { name: 'Debt Management', href: '/debt', icon: CreditCard, shortName: 'Debt' },
  { name: 'Loan Management', href: '/loan', icon: PiggyBank, shortName: 'Loans' },
  { name: 'Daily Tasks', href: '/tasks/daily', icon: CheckSquare, shortName: 'Tasks' },
  { name: 'Monthly Goals', href: '/tasks/monthly', icon: Calendar, shortName: 'Goals' },
  { name: 'Settings', href: '/settings', icon: Settings, shortName: 'Settings' },
];

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar overlay with improved backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px]',
                  isActive
                    ? 'bg-gradient-to-t from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 mb-1 transition-transform',
                  isActive ? 'text-white scale-110' : 'text-gray-500'
                )} />
                <span className={cn(
                  'text-xs font-medium leading-none',
                  isActive ? 'text-white' : 'text-gray-600'
                )}>
                  {item.shortName}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95"
          >
            <Menu className="h-5 w-5 mb-1 text-gray-500" />
            <span className="text-xs font-medium leading-none text-gray-600">More</span>
          </button>
        </div>
      </div>

      {/* Modern Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-white/98 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 lg:translate-x-0 lg:static lg:inset-0 lg:w-64',
          'transform transition-all duration-500 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Modern Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/30 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Migo Assistant
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-all duration-200 active:scale-95"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Quick Actions Section */}
        <div className="p-4 border-b border-gray-200/30">
          <div className="flex items-center space-x-2">
            <button className="flex-1 flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Quick Search</span>
            </button>
            <button className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200">
              <Bell className="h-4 w-4 text-purple-600" />
            </button>
          </div>
        </div>
        
        {/* Enhanced Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 space-y-1">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 transform',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md'
                  )}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: mounted ? 1 : 0
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      'p-2 rounded-lg mr-3 transition-all duration-300',
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
                    )}>
                      <item.icon
                        className={cn(
                          'h-5 w-5 transition-all duration-300',
                          isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                        )}
                      />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-white/80" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Enhanced User Profile Section */}
        <div className="p-4 border-t border-gray-200/30">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-4 border border-gray-200/30 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Anh Duc</p>
                <p className="text-xs text-gray-600">Premium User</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with modern layout */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Enhanced Top bar */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 active:scale-95 shadow-sm"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
              <div className="hidden sm:block">
                <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200/30">
                  Welcome back, Anh Duc ✨
                </div>
              </div>
            </div>
            
            {/* Quick actions for desktop */}
            <div className="hidden sm:flex items-center space-x-3">
              <button className="p-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm">
                <Search className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm relative">
                <Bell className="h-4 w-4 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              </button>
            </div>
          </div>
        </header>

        {/* Page content with mobile spacing */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
