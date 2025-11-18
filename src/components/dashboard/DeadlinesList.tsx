import React from 'react';
import Link from 'next/link';
import { formatDate, isWithinDays, isOverdue } from '@/lib/utils/dateHelpers';
import { cn } from '@/lib/utils/cn';
import Badge from '@/components/ui/Badge';

export interface DeadlinesListProps {
  items: Array<{
    id: string;
    title: string;
    dueDate: Date;
    type: 'project' | 'task';
    priority?: string;
  }>;
  maxDisplay?: number;
}

const DeadlinesList: React.FC<DeadlinesListProps> = ({ items, maxDisplay = 5 }) => {
  // Sort by due date (nearest first)
  const sortedItems = [...items]
    .filter((item) => item.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, maxDisplay);

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No upcoming deadlines
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedItems.map((item) => {
        const isUrgent = isWithinDays(item.dueDate, 3);
        const isPastDue = isOverdue(item.dueDate);
        const href = item.type === 'project' ? `/projects/${item.id}` : `/tasks/${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border',
              isPastDue
                ? 'border-red-200 bg-red-50'
                : isUrgent
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-gray-200 bg-gray-50'
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                item.type === 'project'
                  ? 'bg-blue-100'
                  : 'bg-green-100'
              )}
            >
              {item.type === 'project' ? (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={href}
                className="text-sm font-medium text-gray-900 hover:text-blue-600:text-blue-400 block truncate"
              >
                {item.title}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    isPastDue
                      ? 'text-red-600'
                      : isUrgent
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  )}
                >
                  {isPastDue ? 'Overdue' : formatDate(item.dueDate)}
                </span>
                {item.priority && (
                  <Badge
                    variant={
                      item.priority === 'URGENT'
                        ? 'error'
                        : item.priority === 'HIGH'
                        ? 'warning'
                        : 'default'
                    }
                    size="sm"
                  >
                    {item.priority}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeadlinesList;
