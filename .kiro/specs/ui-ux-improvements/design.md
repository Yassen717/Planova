# UI/UX Improvements Design Document

## Overview

This design document outlines the architectural and implementation approach for enhancing the Planova project management system's user interface and experience. The improvements focus on creating a more intuitive, visually appealing, and efficient application through better data visualization, enhanced navigation, improved interactivity, and responsive design patterns.

The design maintains compatibility with the existing Next.js 15 App Router architecture, Tailwind CSS styling, and TypeScript type safety while introducing new components and patterns that elevate the user experience.

## Architecture

### Component Architecture

The improvements follow a modular component architecture with clear separation of concerns:

```
src/
├── components/
│   ├── ui/                          # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── Badge.tsx
│   ├── dashboard/                   # Dashboard-specific components
│   │   ├── StatCard.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── DeadlinesList.tsx
│   │   └── TaskDistributionChart.tsx
│   ├── projects/                    # Project-related components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectFilters.tsx
│   │   ├── ProjectSearch.tsx
│   │   └── ProjectProgress.tsx
│   ├── tasks/                       # Task-related components
│   │   ├── TaskTable.tsx
│   │   ├── TaskKanban.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskFilters.tsx
│   │   └── TaskSearch.tsx
│   ├── navigation/                  # Navigation components
│   │   ├── Breadcrumbs.tsx
│   │   ├── QuickActions.tsx
│   │   └── MobileMenu.tsx
│   └── shared/                      # Shared components
│       ├── SearchBar.tsx
│       ├── FilterPanel.tsx
│       ├── Pagination.tsx
│       ├── SortableHeader.tsx
│       └── Avatar.tsx
├── hooks/
│   ├── useSearch.ts                 # Search functionality hook
│   ├── useFilters.ts                # Filter management hook
│   ├── usePagination.ts             # Pagination logic hook
│   ├── useSort.ts                   # Sorting logic hook
│   ├── useKeyboardShortcuts.ts      # Keyboard shortcuts hook
│   └── useDragAndDrop.ts            # Drag and drop for Kanban
└── lib/
    ├── utils/
    │   ├── chartHelpers.ts          # Chart data transformation
    │   ├── filterHelpers.ts         # Filter logic utilities
    │   └── sortHelpers.ts           # Sorting utilities
    └── constants/
        └── keyboardShortcuts.ts     # Keyboard shortcut definitions
```

### State Management Strategy

- **Client-side filtering/sorting**: Use React state with custom hooks for immediate UI updates
- **Server-side data fetching**: Maintain existing pattern with Next.js Server Components
- **Optimistic updates**: Implement for drag-and-drop operations in Kanban view
- **URL state**: Store filter and sort parameters in URL query strings for shareability

### Responsive Design Strategy

- **Mobile-first approach**: Design components starting from mobile viewport
- **Breakpoints**:
  - `sm`: 640px (tablets)
  - `md`: 768px (small laptops)
  - `lg`: 1024px (desktops)
  - `xl`: 1280px (large desktops)
- **Adaptive layouts**: Transform table views to card layouts on mobile
- **Touch-friendly**: Minimum 44px touch targets for mobile interactions

## Components and Interfaces

### 1. Enhanced Dashboard Components

#### StatCard Component
```typescript
interface StatCardProps {
  title: string;
  value: number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red';
  href?: string;
}
```

**Design**: Card with large number display, optional trend indicator, icon, and subtle background gradient based on color theme.

#### ProgressChart Component
```typescript
interface ProgressChartProps {
  projects: Array<{
    id: string;
    title: string;
    progress: number;
    status: string;
  }>;
  maxDisplay?: number;
}
```

**Design**: Horizontal bar chart showing project completion percentages with color-coded bars based on status.

#### DeadlinesList Component
```typescript
interface DeadlinesListProps {
  items: Array<{
    id: string;
    title: string;
    dueDate: Date;
    type: 'project' | 'task';
    priority?: string;
  }>;
  maxDisplay?: number;
}
```

**Design**: Vertical list with date badges, item titles, and priority indicators. Items within 3 days highlighted in warning color.

### 2. Search and Filter Components

#### SearchBar Component
```typescript
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  debounceMs?: number;
}
```

**Design**: Input with search icon, clear button (when value present), and subtle focus ring. Implements debouncing for performance.

#### FilterPanel Component
```typescript
interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'daterange' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  value: any;
}

interface FilterPanelProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: any) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}
```

**Design**: Collapsible panel with filter controls, active filter count badge, and reset button. Mobile: full-screen overlay. Desktop: dropdown panel.

### 3. Kanban Board Components

#### TaskKanban Component
```typescript
interface TaskKanbanProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskClick: (taskId: string) => void;
}
```

**Design**: Four-column layout (TODO, IN_PROGRESS, REVIEW, DONE) with drag-and-drop functionality. Each column has a header with task count and color indicator.

#### TaskCard Component (for Kanban)
```typescript
interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onClick: () => void;
}
```

**Design**: Compact card with:
- Task title (truncated to 2 lines)
- Priority badge (top-right corner)
- Assignee avatar (bottom-left)
- Due date badge (bottom-right, red if overdue)
- Subtle shadow that increases on hover

### 4. Navigation Components

#### Breadcrumbs Component
```typescript
interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}
```

**Design**: Horizontal list with chevron separators, last item not clickable (current page). Truncate middle items on mobile.

#### QuickActions Component
```typescript
interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}
```

**Design**: Dropdown menu triggered by "+" button in navigation bar. Shows action label, icon, and keyboard shortcut hint.

#### MobileMenu Component
```typescript
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ name: string; href: string; icon?: React.ReactNode }>;
}
```

**Design**: Full-screen overlay with slide-in animation from left. Includes close button, navigation items with icons, and user profile section.

### 5. Table Enhancement Components

#### SortableHeader Component
```typescript
interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}
```

**Design**: Table header cell with sort indicator icons (up/down arrows). Active sort column highlighted with accent color.

#### Pagination Component
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}
```

**Design**: Horizontal layout with:
- Previous/Next buttons
- Page number buttons (show 5 at a time with ellipsis)
- Page size selector dropdown
- Total items count display

### 6. UI Primitives

#### EmptyState Component
```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Design**: Centered layout with large icon, heading, description text, and optional CTA button. Uses muted colors for non-intrusive appearance.

#### Skeleton Component
```typescript
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}
```

**Design**: Animated gradient shimmer effect. Matches the shape of content being loaded.

#### Toast Component
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}
```

**Design**: Slide-in from top-right corner. Color-coded by type. Auto-dismiss after duration. Close button included.

## Data Models

### Extended Types for UI Features

```typescript
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

// Keyboard shortcut
export interface KeyboardShortcut {
  key: string;
  modifiers: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  description: string;
  action: () => void;
}
```

## Error Handling

### Error States

1. **Network Errors**: Display toast notification with retry option
2. **Validation Errors**: Show inline error messages below form fields
3. **Permission Errors**: Display modal explaining lack of permissions
4. **Not Found Errors**: Show empty state with navigation suggestions

### Error Boundaries

Implement React Error Boundaries at:
- Page level: Catch and display full-page error states
- Component level: Catch errors in complex components (charts, Kanban)

### Loading States

- **Initial load**: Full-page skeleton matching layout
- **Partial updates**: Skeleton for specific sections
- **Action feedback**: Button loading states with spinner
- **Optimistic updates**: Immediate UI update with rollback on error

## Testing Strategy

### Unit Tests

- Test custom hooks (useSearch, useFilters, usePagination, useSort)
- Test utility functions (filterHelpers, sortHelpers, chartHelpers)
- Test component rendering with various props

### Integration Tests

- Test search and filter interactions
- Test Kanban drag-and-drop functionality
- Test pagination and sorting together
- Test keyboard shortcuts

### Accessibility Tests

- Keyboard navigation through all interactive elements
- Screen reader compatibility for all components
- Color contrast ratios meet WCAG AA standards
- Focus management in modals and dropdowns

### Responsive Tests

- Test layouts at all breakpoints
- Test touch interactions on mobile
- Test mobile menu functionality
- Test table-to-card transformation

## Performance Considerations

### Optimization Strategies

1. **Debouncing**: Search input debounced at 300ms
2. **Memoization**: Use React.memo for expensive components (charts, Kanban cards)
3. **Virtual scrolling**: Implement for lists with 100+ items
4. **Code splitting**: Lazy load Kanban view and chart components
5. **Image optimization**: Use Next.js Image component for avatars
6. **CSS optimization**: Use Tailwind's purge feature to minimize CSS bundle

### Bundle Size Management

- Lazy load chart library (recharts or similar)
- Lazy load drag-and-drop library (dnd-kit)
- Use dynamic imports for modal content
- Tree-shake unused Tailwind utilities

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Indicators**: Visible focus rings on all focusable elements
- **ARIA Labels**: Proper labeling for screen readers
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Alt Text**: Descriptive alt text for all images and icons
- **Semantic HTML**: Use proper heading hierarchy and landmarks

### Keyboard Shortcuts

```typescript
const KEYBOARD_SHORTCUTS = {
  CREATE_PROJECT: { key: 'p', modifiers: ['ctrl'], description: 'Create new project' },
  CREATE_TASK: { key: 't', modifiers: ['ctrl'], description: 'Create new task' },
  SEARCH: { key: 'k', modifiers: ['ctrl'], description: 'Focus search' },
  CLOSE_MODAL: { key: 'Escape', modifiers: [], description: 'Close modal/dialog' },
  HELP: { key: '?', modifiers: ['shift'], description: 'Show keyboard shortcuts' },
  NEXT_PAGE: { key: 'ArrowRight', modifiers: ['ctrl'], description: 'Next page' },
  PREV_PAGE: { key: 'ArrowLeft', modifiers: ['ctrl'], description: 'Previous page' },
};
```

## Design System

### Color Palette

```typescript
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Main blue
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};
```

### Typography Scale

```typescript
const typography = {
  h1: 'text-3xl font-bold',      // 30px
  h2: 'text-2xl font-bold',      // 24px
  h3: 'text-xl font-semibold',   // 20px
  h4: 'text-lg font-semibold',   // 18px
  body: 'text-base',             // 16px
  small: 'text-sm',              // 14px
  xs: 'text-xs',                 // 12px
};
```

### Spacing Scale

Following Tailwind's default spacing scale (4px base unit):
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Shadow Scale

```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

## Animation Guidelines

### Transition Durations

- **Fast**: 150ms - Hover states, focus rings
- **Normal**: 300ms - Modal open/close, dropdown expand
- **Slow**: 500ms - Page transitions, complex animations

### Easing Functions

- **ease-in-out**: Default for most transitions
- **ease-out**: For elements entering the viewport
- **ease-in**: For elements leaving the viewport

### Animation Principles

1. **Purposeful**: Animations should guide user attention
2. **Subtle**: Avoid distracting or excessive motion
3. **Performant**: Use CSS transforms and opacity for smooth 60fps
4. **Respectful**: Honor prefers-reduced-motion user preference

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Create UI primitive components (Button, Input, Modal, Toast, Skeleton, EmptyState)
- Implement custom hooks (useSearch, useFilters, usePagination, useSort)
- Set up design system constants and utilities

### Phase 2: Dashboard Enhancements (Week 2)
- Implement enhanced dashboard with charts and visualizations
- Create StatCard, ProgressChart, and DeadlinesList components
- Add loading skeletons and empty states to dashboard

### Phase 3: Search and Filter (Week 3)
- Implement SearchBar and FilterPanel components
- Add search and filter functionality to projects and tasks pages
- Implement URL state management for filters

### Phase 4: Kanban View (Week 4)
- Implement TaskKanban component with drag-and-drop
- Create TaskCard component for Kanban view
- Add view toggle between table and Kanban

### Phase 5: Navigation Improvements (Week 5)
- Implement Breadcrumbs component
- Create QuickActions menu
- Implement MobileMenu with hamburger toggle
- Add keyboard shortcuts system

### Phase 6: Table Enhancements (Week 6)
- Implement sortable table headers
- Add pagination component
- Create responsive card layout for mobile

### Phase 7: Polish and Testing (Week 7)
- Implement keyboard shortcuts
- Add form validation improvements
- Conduct accessibility audit
- Performance optimization
- Comprehensive testing

## Migration Strategy

### Backward Compatibility

- All new components are additive, not replacing existing ones
- Existing pages continue to work during gradual migration
- Feature flags can be used to toggle new UI components

### Gradual Rollout

1. Start with dashboard enhancements (high visibility, low risk)
2. Add search and filters (immediate value, low complexity)
3. Implement Kanban view (optional feature, can coexist with table)
4. Enhance navigation (affects all pages, test thoroughly)
5. Add table enhancements (gradual improvement to existing feature)

### Data Migration

No database schema changes required. All improvements are UI-only.

## Security Considerations

- **XSS Prevention**: Sanitize user input in search and filter fields
- **CSRF Protection**: Maintain existing Next.js CSRF protections
- **Rate Limiting**: Implement debouncing to prevent API abuse from rapid filtering
- **Input Validation**: Validate all filter and sort parameters on server-side

## Monitoring and Analytics

### Metrics to Track

- **Performance**: Page load times, component render times
- **User Engagement**: Feature usage (Kanban vs table, filter usage, keyboard shortcuts)
- **Error Rates**: Client-side errors, failed API calls
- **Accessibility**: Keyboard navigation usage, screen reader usage

### Logging

- Log filter and search queries for UX insights
- Log drag-and-drop operations for Kanban usage analysis
- Log keyboard shortcut usage for feature adoption tracking
