import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: (id: string) => void;
}

export function Toast({ 
  id, 
  title, 
  description, 
  type = 'info', 
  duration = 4000, 
  onDismiss 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onDismiss]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const variants = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: 'text-green-100',
      border: 'border-green-200',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      icon: 'text-red-100',
      border: 'border-red-200',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      icon: 'text-yellow-100',
      border: 'border-yellow-200',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: 'text-blue-100',
      border: 'border-blue-200',
    },
  };

  const Icon = icons[type];
  const variant = variants[type];

  return (
    <div
      className={cn(
        'fixed top-6 right-6 z-50 transform transition-all duration-300 ease-out',
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <div className="glass border border-white/20 rounded-2xl p-4 max-w-sm shadow-2xl">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={cn('p-2 rounded-xl', variant.bg)}>
            <Icon className={cn('h-5 w-5', variant.icon)} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          
          {/* Dismiss Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onDismiss?.(id), 300);
            }}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn('h-full rounded-full', variant.bg)}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 80}px)`,
            zIndex: 50 - index,
          }}
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}

// Add the keyframe animation to global CSS
const toastProgressStyle = `
@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`;

// Add to head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = toastProgressStyle;
  document.head.appendChild(style);
}
