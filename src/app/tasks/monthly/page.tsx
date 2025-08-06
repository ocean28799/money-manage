import TaskForm from '@/components/tasks/task-form';
import TaskList from '@/components/tasks/task-list';

export default function MonthlyTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Monthly Goals</h1>
        <p className="text-gray-600 mt-2">
          Set and track your monthly goals and long-term objectives
        </p>
      </div>
      
      <TaskForm type="monthly" />
      <TaskList type="monthly" />
    </div>
  );
}
