import TaskForm from '@/components/tasks/task-form';
import TaskList from '@/components/tasks/task-list';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target } from 'lucide-react';

export default function DailyTasksPage() {
  // Mock data for progress
  const todayProgress = 65;
  const completedTasks = 8;
  const totalTasks = 12;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10 rounded-3xl" />
        <div className="absolute inset-0 bg-pattern opacity-30" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-full opacity-20 floating" />
        <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 floating" style={{ animationDelay: '2s' }} />
        
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">
                    Daily Tasks
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Manage your daily tasks and stay productive ⚡
                  </p>
                </div>
              </div>
              
              {/* Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today&apos;s Progress</p>
                      <p className="text-xl font-bold text-gray-900">{todayProgress}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-xl font-bold text-gray-900">{completedTasks}</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Remaining</p>
                      <p className="text-xl font-bold text-gray-900">{totalTasks - completedTasks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex flex-col space-y-3">
              <Badge variant="gradient" size="lg">
                🔥 On Fire!
              </Badge>
              <Badge variant="success">
                ✨ {completedTasks} completed today
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <Progress 
              value={todayProgress} 
              variant="gradient" 
              showLabel 
              size="lg"
              className="max-w-md"
            />
          </div>
        </div>
      </div>
      
      <TaskForm type="daily" />
      <TaskList type="daily" />
    </div>
  );
}
