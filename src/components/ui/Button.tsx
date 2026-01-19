import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]';
    
    const variantStyles = {
      primary: 'bg-indigo-500 text-white hover:bg-indigo-600 focus-visible:ring-indigo-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/25',
      secondary: 'bg-violet-500 text-white hover:bg-violet-600 focus-visible:ring-violet-500 shadow-md hover:shadow-lg hover:shadow-violet-500/25',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-md hover:shadow-lg hover:shadow-red-500/25',
      outline: 'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-500',
      gradient: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 focus-visible:ring-indigo-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/30',
    };
    
    const sizeStyles = {
      sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
      md: 'h-10 px-4 text-sm rounded-lg gap-2',
      lg: 'h-12 px-6 text-base rounded-xl gap-2',
      xl: 'h-14 px-8 text-lg rounded-xl gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
