import React from 'react';
import { cn } from '@/lib/utils/cn';
import { SortState } from '@/types/ui';

export interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: SortState | null;
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
  className,
}) => {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <th
      scope="col"
      className={cn(
        'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none',
        'hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors',
        isActive
          ? 'text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700'
          : 'text-gray-500 dark:text-gray-300',
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <div className="flex flex-col">
          {/* Up Arrow */}
          <svg
            className={cn(
              'w-3 h-3 -mb-1',
              direction === 'asc'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-600'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
          </svg>
          {/* Down Arrow */}
          <svg
            className={cn(
              'w-3 h-3',
              direction === 'desc'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-600'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
          </svg>
        </div>
      </div>
    </th>
  );
};

export default SortableHeader;
