// Date utility functions

/**
 * Check if a date is overdue
 */
export function isOverdue(date: Date | null | undefined): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

/**
 * Check if a date is within N days
 */
export function isWithinDays(date: Date | null | undefined, days: number): boolean {
  if (!date) return false;
  const targetDate = new Date(date);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
}

/**
 * Format date as relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = targetDate.getTime() - now.getTime();
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const isPast = diffMs < 0;
  const prefix = isPast ? '' : 'in ';
  const suffix = isPast ? ' ago' : '';

  if (diffDay > 0) {
    return `${prefix}${diffDay} day${diffDay > 1 ? 's' : ''}${suffix}`;
  }
  if (diffHour > 0) {
    return `${prefix}${diffHour} hour${diffHour > 1 ? 's' : ''}${suffix}`;
  }
  if (diffMin > 0) {
    return `${prefix}${diffMin} minute${diffMin > 1 ? 's' : ''}${suffix}`;
  }
  return 'just now';
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'No date';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'No date';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
