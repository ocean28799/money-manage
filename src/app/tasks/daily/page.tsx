import TaskForm from '@/components/tasks/task-form';
import TaskList from '@/components/tasks/task-list';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target } from 'lucide-react';

export default function DailyTasksPage() {
  // Remove mock data - this will be replaced with real data
  const todayProgress = 0;
  const completedTasks = 0;
  const totalTasks = 0;

  return (
    <div className="space-y-6 lg:space-y-8 ios-content-padding">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10 rounded-3xl" />
        <div className="absolute inset-0 bg-pattern opacity-30" />
        
        {/* Floating decorative elements - hidden on mobile */}
        <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-full opacity-20 floating hidden md:block" />
        <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 floating hidden md:block" style={{ animationDelay: '2s' }} />
        
        <div className="relative p-4 sm:p-6 lg:p-8 hero-mobile">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
                    Daily Tasks
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base lg:text-lg">
                    Manage your daily tasks and stay productive ⚡
                  </p>
                </div>
              </div>
              
              {/* Progress Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 stats-grid">
                <div className="glass p-3 sm:p-4 rounded-2xl">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Today&apos;s Progress</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">{todayProgress}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-3 sm:p-4 rounded-2xl">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">{completedTasks}</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-3 sm:p-4 rounded-2xl">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Remaining</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">{totalTasks - completedTasks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats - hidden on mobile, shown on large screens */}
            <div className="hidden lg:flex flex-col space-y-3">
              <Badge variant="gradient" size="lg">
                🔥 Ready to Start!
              </Badge>
              <Badge variant="success">
                ✨ {completedTasks} completed today
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <Progress 
              value={todayProgress} 
              variant="gradient" 
              showLabel 
              size="lg"
              className="w-full sm:max-w-md progress-mobile"
            />
          </div>
        </div>
      </div>
      
      <TaskForm type="daily" />
      <TaskList type="daily" />
    </div>
  );
}
