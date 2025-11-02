import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, prefixIcon, suffixIcon, onClear, className, ...props }, ref) => {
    const hasError = !!error;
    const showClearButton = onClear && props.value;

    const inputStyles = cn(
      'w-full rounded-md border px-3 py-2 text-sm transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'dark:bg-gray-800 dark:text-white',
      hasError ? 'border-red-500 focus:ring-red-500' : '',
      success && !hasError ? 'border-green-500 focus:ring-green-500' : '',
      !hasError && !success ? 'border-gray-300 focus:ring-blue-500 dark:border-gray-600' : '',
      prefixIcon ? 'pl-10' : '',
      (suffixIcon || showClearButton) ? 'pr-10' : '',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {prefixIcon}
            </div>
          )}
          <input ref={ref} className={inputStyles} {...props} />
          {showClearButton && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          {suffixIcon && !showClearButton && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && !error && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">Looks good!</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
