import { create } from 'zustand';
import { Task } from '@/types';

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

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [], // Start with empty tasks array
  
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: Date.now().toString(),
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
}));
