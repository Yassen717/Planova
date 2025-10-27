import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = 'md', className }) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const baseStyles = 'inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold';

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={cn(baseStyles, sizeStyles[size], className)}
      />
    );
  }

  return (
    <div className={cn(baseStyles, sizeStyles[size], className)}>
      {getInitials(name)}
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

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-white dark:ring-gray-800 rounded-full">
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="ring-2 ring-white dark:ring-gray-800 rounded-full">
          <Avatar name={`+${remainingCount}`} size={size} />
        </div>
      )}
    </div>
  );
};

export default Avatar;
