import React from 'react';
import Button from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showDetails?: boolean;
  details?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  showDetails = false,
  details,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        <svg
          className="w-16 h-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">{message}</p>
      
      {showDetails && details && (
        <details className="mb-6 text-left w-full max-w-md">
          <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
            Error details
          </summary>
          <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded overflow-auto max-h-40">
            {details}
          </pre>
        </details>
      )}
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
