import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'gradient' | 'neon' | 'morphic';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  glowing?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', glowing = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-xl text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95': variant === 'default',
            'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95': variant === 'destructive',
            'border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95': variant === 'outline',
            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95': variant === 'secondary',
            'hover:bg-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95': variant === 'ghost',
            'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95': variant === 'gradient',
            'bg-blue-600 text-white border-2 border-blue-400 neon-glow hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95': variant === 'neon',
            'btn-morphic text-gray-700 hover:text-gray-900': variant === 'morphic',
          },
          {
            'h-10 px-4 py-2 text-sm min-h-[44px] sm:min-h-[40px]': size === 'default', // 44px minimum for better touch targets on mobile
            'h-9 px-3 py-1.5 text-xs min-h-[40px] sm:min-h-[36px]': size === 'sm',
            'h-12 px-6 py-3 text-base min-h-[48px]': size === 'lg',
            'h-14 px-8 py-4 text-lg min-h-[56px]': size === 'xl',
          },
          glowing && 'neon-glow',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
