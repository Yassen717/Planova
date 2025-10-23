// Performance optimization utilities

// Debounce function to limit the rate at which a function is called
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

// Throttle function to limit the rate at which a function is called
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization function for expensive calculations
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache: Record<string, ReturnType<T>> = {};
  
  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      return cache[key];
    }
    
    const result = func(...args);
    cache[key] = result;
    return result;
  } as T;
}

// Lazy loading image component
export function lazyLoadImage(
  imageElement: HTMLImageElement,
  src: string,
  placeholder?: string
): void {
  // Set placeholder if provided
  if (placeholder) {
    imageElement.src = placeholder;
  }
  
  // Create new image to load in background
  const img = new Image();
  
  img.onload = () => {
    imageElement.src = src;
    imageElement.classList.remove('loading');
  };
  
  img.onerror = () => {
    // Handle error - maybe set a default image
    imageElement.classList.add('error');
  };
  
  img.src = src;
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  });
}

// Performance monitoring utility
export function measurePerformance<T>(name: string, fn: () => T): T {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
  
  return fn();
}

// Prefetch links for better navigation performance
export function prefetchLink(url: string): void {
  if ('connection' in navigator && (navigator as any).connection) {
    // Don't prefetch if user has data saver enabled
    if ((navigator as any).connection.saveData) return;
    
    // Don't prefetch if user is on slow connection
    const effectiveType = (navigator as any).connection.effectiveType;
    if (effectiveType && (effectiveType.includes('slow') || effectiveType.includes('2g'))) {
      return;
    }
  }
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}