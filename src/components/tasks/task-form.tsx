'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormData } from '@/lib/validations';
import { useTaskStore } from '@/store/task-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Target, Calendar, Flag, X } from 'lucide-react';

interface TaskFormProps {
  type: 'daily' | 'monthly';
}

export default function TaskForm({ type }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addTask } = useTaskStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type,
      priority: 'medium',
      dueDate: new Date(),
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    addTask({
      ...data,
      userId: '1', // Mock user ID
      completed: false,
    });
    reset();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="gradient"
        size="lg"
        className="mb-8 group"
        glowing
      >
        <Plus className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
        Add {type === 'daily' ? 'Daily Task' : 'Monthly Goal'}
      </Button>
    );
  }

  return (
    <Card variant="glass" className="mb-8 overflow-hidden">
      {/* Header with gradient background */}
      <CardHeader className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <CardTitle gradient>
              Add New {type === 'daily' ? 'Daily Task' : 'Monthly Goal'}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              reset();
            }}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Title</span>
            </label>
            <Input
              {...register('title')}
              placeholder="Enter task title"
              variant="glass"
              className="text-gray-900 placeholder-gray-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <span>Description (Optional)</span>
            </label>
            <textarea
              {...register('description')}
              placeholder="Enter task description"
              className="w-full px-4 py-3 glass rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg focus:shadow-xl focus:scale-[1.02]"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                <span>{errors.description.message}</span>
              </p>
            )}
          </div>

          {/* Priority and Due Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Flag className="h-4 w-4 text-orange-500" />
                <span>Priority</span>
              </label>
              <div className="relative">
                <select
                  {...register('priority')}
                  className="w-full px-4 py-3 glass rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg focus:shadow-xl"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.priority && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  <span>{errors.priority.message}</span>
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>Due Date</span>
              </label>
              <Input
                type="date"
                {...register('dueDate', { valueAsDate: true })}
                variant="glass"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  <span>{errors.dueDate.message}</span>
                </p>
              )}
            </div>
          </div>

          <input type="hidden" {...register('type')} value={type} />

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant="gradient"
              size="lg"
              className="flex-1"
              glowing
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              className="px-8"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
