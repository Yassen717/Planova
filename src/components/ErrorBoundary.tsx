'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-500 mx-auto"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="primary">
                Try Again
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="secondary">
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
