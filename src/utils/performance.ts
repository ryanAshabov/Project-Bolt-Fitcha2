/**
 * Performance Optimization Utilities
 * 
 * This module contains utilities for optimizing application performance:
 * - Image lazy loading and optimization
 * - Code splitting helpers
 * - Memoization utilities
 * - Bundle analysis helpers
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import { lazy, ComponentType } from 'react';

/**
 * Utility for lazy loading components with error boundaries
 * @param importFunc - Function that returns a Promise with the component
 * @param fallback - Fallback component to show while loading
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType,
) => {
  return lazy(() =>
    importFunc().catch(() => {
      // Retry logic for failed imports
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(importFunc());
        }, 1000);
      });
    }),
  );
};

/**
 * Debounce function to limit the rate of function execution
 * Useful for search inputs, scroll handlers, etc.
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to ensure function is called at most once per interval
 * Useful for scroll handlers, resize handlers, etc.
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Optimize images by adding lazy loading and format optimization
 */
export const optimizeImageSrc = (
  src: string,
  width?: number,
  height?: number,
  format: 'webp' | 'avif' | 'jpeg' = 'webp',
): string => {
  // In production, this would integrate with image optimization service
  // For now, return the original src with parameters
  const params = new URLSearchParams();
  
  if (width) {
params.append('w', width.toString());
}
  if (height) {
params.append('h', height.toString());
}
  params.append('f', format);
  params.append('q', '80'); // Quality
  
  return `${src}?${params.toString()}`;
};

/**
 * Preload critical resources
 */
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) {
link.type = type;
}
  document.head.appendChild(link);
};

/**
 * Check if user prefers reduced motion for animations
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  /**
   * Measure and log component render time
   */
  measureRenderTime: (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  },

  /**
   * Monitor memory usage
   */
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  },

  /**
   * Monitor largest contentful paint
   */
  observeLCP: (callback: (lcp: number) => void) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        callback(lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      return observer;
    }
    return null;
  },
};
