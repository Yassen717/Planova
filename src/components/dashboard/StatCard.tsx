import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
  title: string;
  value: number | string;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red';
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color, href }) => {
  const colorStyles = {
    blue: 'from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400',
    green: 'from-green-500/10 to-green-600/10 text-green-600 dark:text-green-400',
    orange: 'from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400',
    red: 'from-red-500/10 to-red-600/10 text-red-600 dark:text-red-400',
  };

  const content = (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className={cn('p-2 rounded-lg bg-gradient-to-br', colorStyles[color])}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {change.trend === 'up' ? (
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
              <span
                className={cn(
                  'ml-1 text-sm font-medium',
                  change.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {Math.abs(change.value)}%
              </span>
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default StatCard;
