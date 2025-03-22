import { Platform, Image } from 'react-native';

// Type definitions for performance metrics
export interface PerformanceMetrics {
  ttfb?: number; // Time to First Byte
  fcp?: number; // First Contentful Paint
  tti?: number; // Time to Interactive
  loadTime?: number; // Total load time
}

// Performance tracking for React Native
let performanceMarks: Record<string, number> = {};

// Initialize performance tracking
export const initPerformanceTracking = () => {
  performanceMarks = {};
  console.log('[Performance] Tracking initialized');
};

// Mark the start of a performance measurement
export const markStart = (markName: string) => {
  try {
    performanceMarks[`${markName}_start`] = Date.now();
  } catch (error) {
    console.log('[Performance] Error marking start:', error);
  }
};

// Mark the end of a performance measurement and report the duration
export const markEnd = (markName: string) => {
  try {
    const endTime = Date.now();
    const startTime = performanceMarks[`${markName}_start`] || endTime;
    const duration = endTime - startTime;
    
    performanceMarks[`${markName}_end`] = endTime;
    performanceMarks[markName] = duration;
    
    console.log(`[Performance] ${markName}: ${duration}ms`);
    return duration;
  } catch (error) {
    console.log('[Performance] Error marking end:', error);
  }
  return 0;
};

// Image optimization helper
export const getOptimizedImageUrl = (url: string, width: number, height: number): string => {
  // If the URL is from a service that supports dynamic resizing (like Cloudinary),
  // we could configure the dimensions here
  if (!url) return '';
  
  // Simple example for demo purposes
  // In a real app, this would integrate with an image CDN
  return url;
};

// Implement lazy loading and prefetching for images
export const prefetchImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map(url => Image.prefetch(url)));
    console.log(`[Performance] Prefetched ${urls.length} images`);
  } catch (error) {
    console.log('[Performance] Error prefetching images:', error);
  }
}; 