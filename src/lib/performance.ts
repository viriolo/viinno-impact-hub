import { toast } from "sonner";

const PERFORMANCE_THRESHOLD = 3000; // 3 seconds

export const measurePerformance = (key: string) => {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      
      // Log performance metrics
      console.log(`Performance [${key}]:`, duration.toFixed(2), 'ms');
      
      // Alert if performance is poor
      if (duration > PERFORMANCE_THRESHOLD) {
        toast.warning(`Performance alert: ${key} took longer than expected`);
      }
      
      // Send to analytics (implement when analytics service is chosen)
      // trackPerformanceMetric(key, duration);
    }
  };
};

export const initializePerformanceMonitoring = () => {
  // Monitor page load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('Page Load Metrics:', {
      'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
      'TCP Connection': navigation.connectEnd - navigation.connectStart,
      'First Paint': performance.getEntriesByType('paint')[0]?.startTime,
      'DOM Interactive': navigation.domInteractive,
      'DOM Complete': navigation.domComplete,
      'Load Complete': navigation.loadEventEnd,
    });
  });
};