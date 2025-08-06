'use client';

import { useTaskStore } from '@/store/task-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { Task } from '@/types';

interface TaskListProps {
  type: 'daily' | 'monthly';
}

export default function TaskList({ type }: TaskListProps) {
  const { getDailyTasks, getMonthlyTasks, toggleTask, deleteTask } = useTaskStore();
  
  const tasks = type === 'daily' ? getDailyTasks() : getMonthlyTasks();

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (task: Task) => {
    return !task.completed && isAfter(new Date(), task.dueDate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === 'daily' ? 'Daily Tasks' : 'Monthly Goals'} ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No {type} tasks yet. Add your first task above!
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-colors ${
                  task.completed
                    ? 'bg-gray-50 border-gray-200'
                    : isOverdue(task)
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          task.completed
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p
                          className={`text-sm mt-1 ${
                            task.completed ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        
                        <span
                          className={`text-xs flex items-center ${
                            isOverdue(task) ? 'text-red-600' : 'text-gray-500'
                          }`}
                        >
                          {isOverdue(task) && (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          Due: {format(task.dueDate, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
