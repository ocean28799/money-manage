import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'neon' | 'morphic';
  glowing?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', glowing = false, ...props }, ref) => {
    const variants = {
      default: 'border border-gray-300 bg-white shadow-sm',
      glass: 'glass border border-white/20 shadow-lg',
      neon: 'border-2 border-blue-300 bg-white neon-glow',
      morphic: 'btn-morphic border-0 shadow-inner',
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl px-4 py-3 text-sm font-medium ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
          variants[variant],
          'hover:shadow-lg focus:shadow-xl focus:scale-[1.02]',
          glowing && 'neon-glow',
          // Mobile optimization - prevent iOS zoom
          type === 'number' && 'text-base sm:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
