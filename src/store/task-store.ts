import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/types';

// Simple ID generator for client-side
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Helper to validate and sanitize task with enhanced backward compatibility
const sanitizeTask = (task: unknown): Task | null => {
  try {
    if (!task || typeof task !== 'object') return null;
    
    const t = task as Record<string, unknown>;
    
    // Handle legacy date formats
    let dueDate: Date;
    if (t.dueDate instanceof Date) {
      dueDate = t.dueDate;
    } else if (typeof t.dueDate === 'string') {
      dueDate = new Date(t.dueDate);
      if (isNaN(dueDate.getTime())) {
        dueDate = new Date();
      }
    } else {
      dueDate = new Date();
    }
    
    let createdAt: Date;
    if (t.createdAt instanceof Date) {
      createdAt = t.createdAt;
    } else if (typeof t.createdAt === 'string') {
      createdAt = new Date(t.createdAt);
      if (isNaN(createdAt.getTime())) {
        createdAt = new Date();
      }
    } else {
      createdAt = new Date();
    }
    
    let updatedAt: Date;
    if (t.updatedAt instanceof Date) {
      updatedAt = t.updatedAt;
    } else if (typeof t.updatedAt === 'string') {
      updatedAt = new Date(t.updatedAt);
      if (isNaN(updatedAt.getTime())) {
        updatedAt = new Date();
      }
    } else {
      updatedAt = new Date();
    }
    
    return {
      id: typeof t.id === 'string' && t.id ? t.id : generateId(),
      userId: typeof t.userId === 'string' ? t.userId : '1',
      title: typeof t.title === 'string' && t.title ? t.title : 'Untitled Task',
      description: typeof t.description === 'string' ? t.description : '',
      type: t.type === 'daily' || t.type === 'monthly' ? t.type as 'daily' | 'monthly' : 'daily',
      priority: t.priority === 'low' || t.priority === 'medium' || t.priority === 'high' ? 
                t.priority as 'low' | 'medium' | 'high' : 'medium',
      completed: typeof t.completed === 'boolean' ? t.completed : false,
      dueDate,
      createdAt,
      updatedAt,
    };
  } catch (error) {
    console.warn('Error sanitizing task:', error);
    return null;
  }
};

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  getDailyTasks: () => Task[];
  getMonthlyTasks: () => Task[];
  getTaskStats: () => { completed: number; pending: number; overdue: number };
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [], // Start with empty tasks array
  
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updatedTask, updatedAt: new Date() } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date() } : t
      ),
    })),

  getDailyTasks: () => {
    const { tasks } = get();
    return tasks
      .filter((task) => task.type === 'daily')
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  },

  getMonthlyTasks: () => {
    const { tasks } = get();
    return tasks
      .filter((task) => task.type === 'monthly')
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  },

  getTaskStats: () => {
    const { tasks } = get();
    const now = new Date();
    
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.filter((task) => !task.completed && new Date(task.dueDate) >= now).length;
    const overdue = tasks.filter((task) => !task.completed && new Date(task.dueDate) < now).length;
    
    return { completed, pending, overdue };
  },
}),
{
  name: 'task-store',
  onRehydrateStorage: () => (state, error) => {
    if (error) {
      console.error('Error rehydrating task store:', error);
      return { tasks: [] };
    }
    
    if (!state) {
      console.warn('No stored task state found, using defaults');
      return { tasks: [] };
    }
    
    // Enhanced data migration and sanitization after rehydration
    let sanitizedTasks: Task[] = [];
    if (Array.isArray(state.tasks)) {
      sanitizedTasks = state.tasks
        .map(sanitizeTask)
        .filter(Boolean) as Task[];
    }
    
    console.log(`✅ Rehydrated ${sanitizedTasks.length} tasks`);
    
    return {
      ...state,
      tasks: sanitizedTasks,
    };
  },
  partialize: (state) => {
    try {
      return { tasks: Array.isArray(state.tasks) ? state.tasks : [] };
    } catch (error) {
      console.error('Error partializing task state:', error);
      return { tasks: [] };
    }
  },
  version: 2,
  migrate: (persistedState: unknown, version: number) => {
    if (version < 2) {
      console.log('Migrating task store from version', version, 'to 2');
      if (persistedState && typeof persistedState === 'object') {
        const state = persistedState as Record<string, unknown>;
        if (!Array.isArray(state.tasks)) {
          state.tasks = [];
        }
        if (Array.isArray(state.tasks)) {
          state.tasks = state.tasks
            .map(sanitizeTask)
            .filter(Boolean);
        }
        return state;
      }
    }
    return persistedState;
  },
}
));
