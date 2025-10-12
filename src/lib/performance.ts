/**
 * Performance monitoring utilities
 */

import React from 'react';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  endTimer(name: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);

    this.recordMetric({
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    return duration;
  }

  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log slow operations
    if (metric.duration > 1000) {
      console.warn(`🐌 Slow operation detected: ${metric.name} took ${metric.duration.toFixed(2)}ms`, metric.metadata);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageTime(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    const total = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / relevantMetrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Utility functions
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  performanceMonitor.startTimer(name);
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performanceMonitor.endTimer(name, metadata);
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    });
  } else {
    const duration = performanceMonitor.endTimer(name, metadata);
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return Promise.resolve(result);
  }
}

export function startTimer(name: string): void {
  performanceMonitor.startTimer(name);
}

export function endTimer(name: string, metadata?: Record<string, any>): number {
  return performanceMonitor.endTimer(name, metadata);
}

export function getPerformanceMetrics(): PerformanceMetric[] {
  return performanceMonitor.getMetrics();
}

export function getAverageTime(name: string): number {
  return performanceMonitor.getAverageTime(name);
}

// React hook for measuring component performance
export function usePerformance(name: string) {
  React.useEffect(() => {
    performanceMonitor.startTimer(`component:${name}`);
    
    return () => {
      performanceMonitor.endTimer(`component:${name}`);
    };
  }, [name]);
}

// Web Vitals monitoring
export function reportWebVitals(metric: any) {
  console.log('📊 Web Vitals:', metric);
  
  // You can send this to analytics services like Google Analytics, Vercel Analytics, etc.
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

// Bundle size analysis
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.group('📦 Bundle Analysis');
  console.log('Scripts:', scripts.length);
  console.log('Stylesheets:', stylesheets.length);
  
  // Log external resources
  const externalScripts = scripts.filter(s => {
    const script = s as HTMLScriptElement;
    return script.src && !script.src.includes(window.location.hostname);
  });
  const externalStyles = stylesheets.filter(s => {
    const link = s as HTMLLinkElement;
    return link.href && !link.href.includes(window.location.hostname);
  });
  
  if (externalScripts.length > 0) {
    console.log('External Scripts:', externalScripts.map(s => (s as HTMLScriptElement).src));
  }
  
  if (externalStyles.length > 0) {
    console.log('External Styles:', externalStyles.map(s => (s as HTMLLinkElement).href));
  }
  
  console.groupEnd();
}

// Memory usage monitoring
export function getMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  };
}

export default performanceMonitor;
