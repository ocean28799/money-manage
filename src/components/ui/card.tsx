import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'neon' | 'morphic';
  hover3d?: boolean;
}

export function Card({ 
  className, 
  children, 
  variant = 'default',
  hover3d = true,
  ...props 
}: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-lg',
    glass: 'glass shadow-xl',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-xl',
    neon: 'bg-white border border-blue-200 neon-glow',
    morphic: 'btn-morphic border-0',
  };

  return (
    <div
      className={cn(
        'rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-all duration-500',
        variants[variant],
        hover3d && 'card-3d perspective hover:shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-3 sm:mb-4 lg:mb-6', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function CardTitle({ children, className, gradient = false }: CardTitleProps) {
  return (
    <h3 className={cn(
      'text-lg font-bold text-gray-900',
      gradient && 'gradient-text',
      className
    )}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
