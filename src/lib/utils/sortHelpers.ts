// Sort utility functions

import { SortState } from '@/types/ui';

/**
 * Sort items by a specific field
 */
export function sortItems<T>(
  items: T[],
  sortKey: keyof T,
  direction: 'asc' | 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? 1 : -1;
    if (bValue == null) return direction === 'asc' ? -1 : 1;

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return direction === 'asc' ? comparison : -comparison;
    }

    // Handle number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle date comparison
    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return direction === 'asc' ? comparison : -comparison;
    }

    // Handle boolean comparison
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      const comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      return direction === 'asc' ? comparison : -comparison;
    }

    return 0;
  });
}

/**
 * Toggle sort direction
 */
export function toggleSortDirection(
  currentSort: SortState | null,
  newSortKey: string
): SortState {
  if (!currentSort || currentSort.key !== newSortKey) {
    return { key: newSortKey, direction: 'asc' };
  }
  return {
    key: newSortKey,
    direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
  };
}

/**
 * Get sort icon name based on current sort state
 */
export function getSortIcon(
  currentSort: SortState | null,
  columnKey: string
): 'none' | 'asc' | 'desc' {
  if (!currentSort || currentSort.key !== columnKey) {
    return 'none';
  }
  return currentSort.direction;
}
