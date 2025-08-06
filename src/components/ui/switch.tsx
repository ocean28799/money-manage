import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'neon';
  className?: string;
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ 
    checked = false, 
    onCheckedChange, 
    disabled = false, 
    size = 'md',
    variant = 'default',
    className,
    ...props 
  }, ref) => {
    const sizes = {
      sm: {
        container: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
      },
      md: {
        container: 'w-10 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-5',
      },
      lg: {
        container: 'w-12 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-6',
      },
    };

    const variants = {
      default: {
        bg: checked ? 'bg-blue-600' : 'bg-gray-300',
        thumb: 'bg-white',
      },
      gradient: {
        bg: checked ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300',
        thumb: 'bg-white',
      },
      neon: {
        bg: checked ? 'bg-blue-600 neon-glow' : 'bg-gray-300',
        thumb: 'bg-white',
      },
    };

    const sizeConfig = sizes[size];
    const variantConfig = variants[variant];

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          sizeConfig.container,
          variantConfig.bg,
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block rounded-full shadow-lg transform ring-0 transition duration-200 ease-in-out',
            sizeConfig.thumb,
            variantConfig.thumb,
            checked ? sizeConfig.translate : 'translate-x-0'
          )}
        />
      </button>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
