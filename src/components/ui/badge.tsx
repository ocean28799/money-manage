import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  pulse = false,
  className 
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200',
    error: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200',
    info: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-300',
        'hover:scale-105 hover:shadow-lg',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'overdue' | 'in-progress';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    completed: {
      variant: 'success' as const,
      pulse: false,
      children: (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
          Completed
        </>
      ),
    },
    pending: {
      variant: 'info' as const,
      pulse: false,
      children: (
        <>
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1.5" />
          Pending
        </>
      ),
    },
    overdue: {
      variant: 'error' as const,
      pulse: true,
      children: (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5" />
          Overdue
        </>
      ),
    },
    'in-progress': {
      variant: 'warning' as const,
      pulse: false,
      children: (
        <>
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1.5 animate-pulse" />
          In Progress
        </>
      ),
    },
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant} 
      pulse={config.pulse}
      className={className}
    >
      {config.children}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      variant: 'success' as const,
      pulse: false,
      children: (
        <>
          🟢 Low
        </>
      ),
    },
    medium: {
      variant: 'warning' as const,
      pulse: false,
      children: (
        <>
          🟡 Medium
        </>
      ),
    },
    high: {
      variant: 'error' as const,
      pulse: true,
      children: (
        <>
          🔴 High
        </>
      ),
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge 
      variant={config.variant} 
      pulse={config.pulse}
      className={className}
    >
      {config.children}
    </Badge>
  );
}
