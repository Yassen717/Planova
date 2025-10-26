// UI-specific TypeScript interfaces

// Filter state
export interface FilterState {
  search: string;
  status: string[];
  priority: string[];
  assignee: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  project: string[];
}

// Sort state
export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

// Pagination state
export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
}

// Chart data
export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

// Keyboard shortcut with action
export interface KeyboardShortcutWithAction {
  key: string;
  modifiers: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  description: string;
  action: () => void;
}

// Filter option for FilterPanel
export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'daterange' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  value: any;
}

// Breadcrumb item
export interface BreadcrumbItem {
  label: string;
  href: string;
}

// Quick action
export interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
}
