// Filter utility functions

import { FilterState } from '@/types/ui';

/**
 * Apply search filter to items
 */
export function applySearchFilter<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items;

  const lowerSearch = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearch);
      }
      return false;
    })
  );
}

/**
 * Apply status filter to items
 */
export function applyStatusFilter<T extends { status: string }>(
  items: T[],
  statuses: string[]
): T[] {
  if (statuses.length === 0) return items;
  return items.filter((item) => statuses.includes(item.status));
}

/**
 * Apply priority filter to items
 */
export function applyPriorityFilter<T extends { priority?: string }>(
  items: T[],
  priorities: string[]
): T[] {
  if (priorities.length === 0) return items;
  return items.filter((item) => item.priority && priorities.includes(item.priority));
}

/**
 * Apply date range filter to items
 */
export function applyDateRangeFilter<T>(
  items: T[],
  dateField: keyof T,
  startDate: Date | null,
  endDate: Date | null
): T[] {
  if (!startDate && !endDate) return items;

  return items.filter((item) => {
    const itemDate = item[dateField];
    if (!(itemDate instanceof Date)) return false;

    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;

    return true;
  });
}

/**
 * Apply assignee filter to items
 */
export function applyAssigneeFilter<T extends { assigneeId?: string | null }>(
  items: T[],
  assigneeIds: string[]
): T[] {
  if (assigneeIds.length === 0) return items;
  return items.filter((item) => item.assigneeId && assigneeIds.includes(item.assigneeId));
}

/**
 * Apply project filter to items
 */
export function applyProjectFilter<T extends { projectId?: string }>(
  items: T[],
  projectIds: string[]
): T[] {
  if (projectIds.length === 0) return items;
  return items.filter((item) => item.projectId && projectIds.includes(item.projectId));
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: Partial<FilterState>): boolean {
  return !!(
    filters.search ||
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    (filters.assignee && filters.assignee.length > 0) ||
    (filters.project && filters.project.length > 0) ||
    filters.dateRange?.start ||
    filters.dateRange?.end
  );
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: Partial<FilterState>): number {
  let count = 0;
  if (filters.search) count++;
  if (filters.status && filters.status.length > 0) count++;
  if (filters.priority && filters.priority.length > 0) count++;
  if (filters.assignee && filters.assignee.length > 0) count++;
  if (filters.project && filters.project.length > 0) count++;
  if (filters.dateRange?.start || filters.dateRange?.end) count++;
  return count;
}
