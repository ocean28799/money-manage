import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'gradient';
  className?: string;
}

export function Loading({ size = 'md', variant = 'spinner', className }: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
            sizes[size]
          )}
        />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center space-x-2', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-blue-600 rounded-full animate-pulse',
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            )}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div
          className={cn(
            'bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse',
            sizes[size]
          )}
        />
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div
          className={cn(
            'rounded-full border-4 border-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-spin',
            sizes[size]
          )}
          style={{
            background: 'conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea)',
            maskImage: 'radial-gradient(circle, transparent 30%, black 30%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 30%, black 30%)',
          }}
        />
      </div>
    );
  }

  return null;
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 bg-pattern flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <Loading variant="gradient" size="lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold gradient-text">Loading...</h2>
          <p className="text-gray-600">Preparing your dashboard</p>
        </div>
      </div>
    </div>
  );
}
