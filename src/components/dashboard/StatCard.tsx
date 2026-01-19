import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
  title: string;
  value: number | string;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  href?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color, href, subtitle }) => {
  const colorStyles = {
    primary: {
      bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
      glow: 'shadow-indigo-500/20',
    },
    secondary: {
      bg: 'bg-gradient-to-br from-violet-500 to-violet-600',
      light: 'bg-violet-50',
      text: 'text-violet-600',
      glow: 'shadow-violet-500/20',
    },
    accent: {
      bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      light: 'bg-cyan-50',
      text: 'text-cyan-600',
      glow: 'shadow-cyan-500/20',
    },
    success: {
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      glow: 'shadow-emerald-500/20',
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      light: 'bg-amber-50',
      text: 'text-amber-600',
      glow: 'shadow-amber-500/20',
    },
    error: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      light: 'bg-red-50',
      text: 'text-red-600',
      glow: 'shadow-red-500/20',
    },
  };

  const styles = colorStyles[color];

  const content = (
    <div className={cn(
      'relative overflow-hidden bg-white rounded-2xl p-6',
      'border border-slate-100 shadow-sm',
      'transition-all duration-300 group',
      href && 'hover:shadow-lg hover:border-slate-200 hover:-translate-y-1 cursor-pointer'
    )}>
      {/* Background decoration */}
      <div className={cn(
        'absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl transition-all duration-300',
        styles.bg,
        href && 'group-hover:opacity-20 group-hover:scale-110'
      )} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-xl text-white shadow-lg',
            styles.bg,
            styles.glow
          )}>
            <div className="w-6 h-6">
              {icon}
            </div>
          </div>
        </div>
        
        {change && (
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
              change.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            )}>
              {change.trend === 'up' ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {Math.abs(change.value)}%
            </div>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        )}
        
        {href && (
          <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className={cn('w-5 h-5', styles.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default StatCard;
