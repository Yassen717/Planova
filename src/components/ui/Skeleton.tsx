import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  const baseStyles = 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]';

  const variantStyles = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
};

// Preset skeleton layouts
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={12} />
      </div>
    </div>
    <Skeleton variant="rounded" height={120} />
    <div className="space-y-2">
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </div>
    <div className="flex gap-2 pt-2">
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    {/* Header */}
    <div className="flex gap-4 p-4 bg-slate-50 border-b border-slate-100">
      <Skeleton variant="text" width="20%" height={14} />
      <Skeleton variant="text" width="25%" height={14} />
      <Skeleton variant="text" width="20%" height={14} />
      <Skeleton variant="text" width="15%" height={14} />
      <Skeleton variant="text" width="20%" height={14} />
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-slate-50 last:border-0 items-center">
        <div className="w-[20%] flex items-center gap-3">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width="70%" height={14} />
        </div>
        <Skeleton variant="text" width="25%" height={14} />
        <Skeleton variant="rounded" width="20%" height={24} />
        <Skeleton variant="rounded" width="15%" height={24} />
        <Skeleton variant="text" width="20%" height={14} />
      </div>
    ))}
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="rounded" width={40} height={40} />
          </div>
          <Skeleton variant="text" width="40%" height={32} />
        </div>
      ))}
    </div>
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export const SkeletonKanban: React.FC = () => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {[1, 2, 3, 4].map((col) => (
      <div key={col} className="flex-shrink-0 w-72">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" width="60%" height={16} />
        </div>
        <div className="space-y-3 bg-slate-50 rounded-xl p-3">
          {[1, 2, 3].map((card) => (
            <div key={card} className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <Skeleton variant="text" width="80%" height={14} />
              <Skeleton variant="text" width="60%" height={12} />
              <div className="flex justify-between items-center pt-2">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="rounded" width={60} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
