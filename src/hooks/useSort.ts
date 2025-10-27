'use client';

import { useState, useCallback, useMemo } from 'react';
import { SortState } from '@/types/ui';
import { sortItems, toggleSortDirection } from '@/lib/utils/sortHelpers';

export interface UseSortOptions<T> {
  initialSort?: SortState | null;
  data: T[];
}

export interface UseSortReturn<T> {
  sortState: SortState | null;
  sortedData: T[];
  sortBy: (key: string) => void;
  clearSort: () => void;
}

/**
 * Custom hook for sorting data
 */
export function useSort<T>(options: UseSortOptions<T>): UseSortReturn<T> {
  const { initialSort = null, data } = options;
  
  const [sortState, setSortState] = useState<SortState | null>(initialSort);

  const sortedData = useMemo(() => {
    if (!sortState) return data;
    return sortItems(data, sortState.key as keyof T, sortState.direction);
  }, [data, sortState]);

  const sortBy = useCallback((key: string) => {
    setSortState((prev) => toggleSortDirection(prev, key));
  }, []);

  const clearSort = useCallback(() => {
    setSortState(null);
  }, []);

  return {
    sortState,
    sortedData,
    sortBy,
    clearSort,
  };
}
