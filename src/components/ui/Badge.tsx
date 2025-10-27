import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', className }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};

// Status-specific badge components
export const TaskStatusBadge: React.FC<{ status: string; size?: 'sm' | 'md' | 'lg' }> = ({ status, size }) => {
  const variantMap: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
    TODO: 'default',
    IN_PROGRESS: 'info',
    REVIEW: 'warning',
    DONE: 'success',
  };

  const labelMap: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Review',
    DONE: 'Done',
  };

  return (
    <Badge variant={variantMap[status] || 'default'} size={size}>
      {labelMap[status] || status}
    </Badge>
  );
};

export const TaskPriorityBadge: React.FC<{ priority: string; size?: 'sm' | 'md' | 'lg' }> = ({ priority, size }) => {
  const variantMap: Record<string, 'success' | 'warning' | 'error'> = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'warning',
    URGENT: 'error',
  };

  return (
    <Badge variant={variantMap[priority] || 'default'} size={size}>
      {priority}
    </Badge>
  );
};

export const ProjectStatusBadge: React.FC<{ status: string; size?: 'sm' | 'md' | 'lg' }> = ({ status, size }) => {
  const variantMap: Record<string, 'success' | 'info' | 'default'> = {
    ACTIVE: 'success',
    COMPLETED: 'info',
    ARCHIVED: 'default',
  };

  return (
    <Badge variant={variantMap[status] || 'default'} size={size}>
      {status}
    </Badge>
  );
};

export default Badge;
