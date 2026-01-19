import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, hint, prefixIcon, suffixIcon, onClear, className, ...props }, ref) => {
    const hasError = !!error;
    const showClearButton = onClear && props.value;

    const inputStyles = cn(
      'w-full rounded-xl border-2 px-4 py-2.5 text-sm transition-all duration-200 bg-white',
      'placeholder:text-slate-400',
      'focus:outline-none focus:ring-0',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
      hasError ? 'border-red-500 focus:border-red-600 bg-red-500/5' : '',
      success && !hasError ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-500/5' : '',
      !hasError && !success ? 'border-slate-200 focus:border-indigo-500 hover:border-slate-300' : '',
      prefixIcon ? 'pl-11' : '',
      (suffixIcon || showClearButton) ? 'pr-11' : '',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {prefixIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              {prefixIcon}
            </div>
          )}
          <input ref={ref} className={inputStyles} {...props} />
          {showClearButton && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-error font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {success && !error && (
          <p className="mt-2 text-sm text-success font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Looks good!
          </p>
        )}
        {hint && !error && !success && (
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
