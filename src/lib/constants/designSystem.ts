// Design System Constants for Planova

export const colors = {
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
} as const;

export const typography = {
  h1: 'text-3xl font-bold',      // 30px
  h2: 'text-2xl font-bold',      // 24px
  h3: 'text-xl font-semibold',   // 20px
  h4: 'text-lg font-semibold',   // 18px
  body: 'text-base',             // 16px
  small: 'text-sm',              // 14px
  xs: 'text-xs',                 // 12px
} as const;

export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  lg: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  xl: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
} as const;

export const transitions = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
