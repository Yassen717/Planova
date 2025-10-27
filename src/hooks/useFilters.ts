'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FilterState } from '@/types/ui';

export interface UseFiltersOptions {
  syncWithUrl?: boolean;
  initialFilters?: Partial<FilterState>;
}

export interface UseFiltersReturn {
  filters: Partial<FilterState>;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: Partial<FilterState> = {
  search: '',
  status: [],
  priority: [],
  assignee: [],
  dateRange: {
    start: null,
    end: null,
  },
  project: [],
};

/**
 * Custom hook for managing filter state with optional URL synchronization
 */
export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const { syncWithUrl = false, initialFilters = {} } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<Partial<FilterState>>(() => {
    if (syncWithUrl && searchParams) {
      // Parse filters from URL
      const urlFilters: Partial<FilterState> = { ...defaultFilters };
      
      const search = searchParams.get('search');
      if (search) urlFilters.search = search;
      
      const status = searchParams.get('status');
      if (status) urlFilters.status = status.split(',');
      
      const priority = searchParams.get('priority');
      if (priority) urlFilters.priority = priority.split(',');
      
      const assignee = searchParams.get('assignee');
      if (assignee) urlFilters.assignee = assignee.split(',');
      
      const project = searchParams.get('project');
      if (project) urlFilters.project = project.split(',');
      
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      if (startDate || endDate) {
        urlFilters.dateRange = {
          start: startDate ? new Date(startDate) : null,
          end: endDate ? new Date(endDate) : null,
        };
      }
      
      return { ...urlFilters, ...initialFilters };
    }
    
    return { ...defaultFilters, ...initialFilters };
  });

  // Sync filters to URL
  useEffect(() => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status.length > 0) params.set('status', filters.status.join(','));
    if (filters.priority && filters.priority.length > 0) params.set('priority', filters.priority.join(','));
    if (filters.assignee && filters.assignee.length > 0) params.set('assignee', filters.assignee.join(','));
    if (filters.project && filters.project.length > 0) params.set('project', filters.project.join(','));
    if (filters.dateRange?.start) params.set('startDate', filters.dateRange.start.toISOString());
    if (filters.dateRange?.end) params.set('endDate', filters.dateRange.end.toISOString());

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newUrl, { scroll: false });
  }, [filters, syncWithUrl, pathname, router]);

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = !!(
    filters.search ||
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    (filters.assignee && filters.assignee.length > 0) ||
    (filters.project && filters.project.length > 0) ||
    filters.dateRange?.start ||
    filters.dateRange?.end
  );

  return {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
  };
}
