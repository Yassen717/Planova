import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = 'md', className, status }) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 border',
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-4 h-4 border-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent gradient based on name
  const getGradient = (name: string | null | undefined): string => {
    const gradients = [
      'from-indigo-500 to-violet-500',
      'from-violet-500 to-pink-500',
      'from-cyan-500 to-indigo-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-blue-500 to-cyan-500',
      'from-violet-500 to-purple-500',
      'from-rose-500 to-pink-500',
    ];
    if (!name) return gradients[0];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const baseStyles = 'relative inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-white shadow-sm';

  if (src) {
    return (
      <div className={cn('relative', className)}>
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(baseStyles, sizeStyles[size], 'object-cover')}
        />
        {status && (
          <span className={cn(
            'absolute bottom-0 right-0 rounded-full border-white',
            statusSizes[size],
            statusColors[status]
          )} />
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        baseStyles,
        sizeStyles[size],
        'bg-gradient-to-br text-white',
        getGradient(name)
      )}>
        {getInitials(name)}
      </div>
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full border-white',
          statusSizes[size],
          statusColors[status]
        )} />
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    name?: string | null;
    alt?: string;
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, max = 3, size = 'md', className }) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const overlapStyles = {
    xs: '-space-x-1.5',
    sm: '-space-x-2',
    md: '-space-x-2.5',
    lg: '-space-x-3',
    xl: '-space-x-4',
  };

  return (
    <div className={cn('flex items-center', overlapStyles[size], className)}>
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="relative hover:z-10 transition-transform hover:scale-110">
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="relative hover:z-10 transition-transform hover:scale-110">
          <Avatar name={`+${remainingCount}`} size={size} />
        </div>
      )}
    </div>
  );
};

export default Avatar;
