import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', dot = false, className }) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200';

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    info: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    primary: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    secondary: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };

  const dotColors = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-sky-500',
    primary: 'bg-indigo-500',
    secondary: 'bg-violet-500',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
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

  const iconMap: Record<string, React.ReactNode> = {
    TODO: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" /></svg>,
    IN_PROGRESS: <svg className="w-3 h-3 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    REVIEW: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    DONE: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
  };

  return (
    <Badge variant={variantMap[status] || 'default'} size={size}>
      {iconMap[status]}
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

  const iconMap: Record<string, React.ReactNode> = {
    LOW: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" transform="rotate(180 10 10)" /></svg>,
    MEDIUM: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
    HIGH: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>,
    URGENT: <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
  };

  return (
    <Badge variant={variantMap[priority] || 'default'} size={size}>
      {iconMap[priority]}
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

  const iconMap: Record<string, React.ReactNode> = {
    ACTIVE: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />,
    COMPLETED: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
    ARCHIVED: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  };

  return (
    <Badge variant={variantMap[status] || 'default'} size={size}>
      {iconMap[status]}
      {status}
    </Badge>
  );
};

export default Badge;
