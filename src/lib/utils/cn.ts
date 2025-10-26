// Class name utility for merging Tailwind classes

/**
 * Merge class names with proper Tailwind precedence
 * Simple implementation - can be replaced with clsx + tailwind-merge if needed
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
