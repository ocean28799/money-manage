'use client';

import { useState, useMemo } from 'react';
import { useTaskStore } from '@/store/task-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  Calendar, 
  Flag, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';
import { format, isToday, isAfter } from 'date-fns';

interface TaskListProps {
  type: 'daily' | 'monthly';
}

export default function TaskList({ type }: TaskListProps) {
  const { toggleTask, deleteTask, updateTask, getDailyTasks, getMonthlyTasks } = useTaskStore();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Get tasks using store methods
  const baseTasks = type === 'daily' ? getDailyTasks() : getMonthlyTasks();

  // Helper function to check if task is overdue
  const isOverdue = (dueDate: Date) => {
    return isAfter(new Date(), dueDate);
  };

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return baseTasks
      .filter(task => {
        // Search filter
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }
        
        // Status filter
        if (statusFilter === 'completed' && !task.completed) return false;
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'overdue' && (task.completed || !isOverdue(new Date(task.dueDate)))) return false;
        
        return true;
      });
  }, [baseTasks, searchQuery, priorityFilter, statusFilter]);

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const handleBulkComplete = () => {
    selectedTasks.forEach(taskId => {
      const task = baseTasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        toggleTask(taskId);
      }
    });
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      selectedTasks.forEach(taskId => deleteTask(taskId));
      setSelectedTasks([]);
    }
  };

  const handleEditTask = (task: { id: string; title: string }) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editTitle.trim()) {
      updateTask(taskId, { title: editTitle.trim() });
    }
    setEditingTask(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '📋';
    }
  };

  const getStatusBadge = (task: { completed: boolean; dueDate: Date }) => {
    if (task.completed) {
      return <Badge variant="success" className="text-xs">✅ Done</Badge>;
    }
    if (isOverdue(new Date(task.dueDate))) {
      return <Badge variant="error" className="text-xs">⚠️ Overdue</Badge>;
    }
    if (isToday(new Date(task.dueDate))) {
      return <Badge variant="warning" className="text-xs">⏰ Due Today</Badge>;
    }
    return <Badge variant="info" className="text-xs">📅 Upcoming</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card variant="glass" className="group">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters and Bulk Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              
              {/* Bulk Actions */}
              {selectedTasks.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedTasks.length} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkComplete}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card variant="glass" className="group">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-text">
                {type === 'daily' ? 'Daily Tasks' : 'Monthly Goals'} ({filteredTasks.length})
              </span>
            </div>
            
            {filteredTasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-sm hover:bg-white/10"
              >
                {selectedTasks.length === filteredTasks.length ? (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Select All
                  </>
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-gray-500 mb-2">
                {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' 
                  ? 'No tasks match your filters' 
                  : `No ${type} tasks yet`
                }
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first task to get started'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group/task relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    task.completed
                      ? 'bg-green-50 border-green-200'
                      : isOverdue(new Date(task.dueDate))
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white/50 border-white/30'
                  } ${
                    selectedTasks.includes(task.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <div className="flex items-center space-x-3 pt-1">
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => handleSelectTask(task.id)}
                          className="opacity-70 group-hover/task:opacity-100 transition-opacity"
                        />
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {task.completed && <Check className="h-3 w-3 text-white" />}
                        </button>
                      </div>
                      
                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {editingTask === task.id ? (
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(task.id);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                className="font-medium"
                                autoFocus
                              />
                            ) : (
                              <h3
                                className={`font-medium ${
                                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}
                              >
                                {task.title}
                              </h3>
                            )}
                            
                            <span className="text-lg">
                              {getPriorityIcon(task.priority)}
                            </span>
                          </div>
                          
                          {getStatusBadge(task)}
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm mb-3 ${
                            task.completed ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            
                            <Badge 
                              variant="info" 
                              className={`text-xs ${getPriorityColor(task.priority)}`}
                            >
                              <Flag className="h-3 w-3 mr-1" />
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 opacity-0 group-hover/task:opacity-100 transition-opacity">
                            {editingTask === task.id ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSaveEdit(task.id)}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTask(task)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      {filteredTasks.length > 0 && (
        <Card variant="glass" className="group">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredTasks.filter(t => !t.completed).length}
                </div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredTasks.filter(t => t.completed).length}
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredTasks.filter(t => !t.completed && isOverdue(new Date(t.dueDate))).length}
                </div>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100) || 0}%
                </div>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
