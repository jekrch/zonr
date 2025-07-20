import { useState, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';

interface Dimensions {
  headerHeight: number;
  windowDimensions: { width: number; height: number };
}

export const useDimensions = (
  playerCount?: number, 
  headerRef?: RefObject<HTMLDivElement | null>
): Dimensions => {
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  // Immediate dimension update function
  const updateDimensions = useCallback(() => {
    const newDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    setWindowDimensions(newDimensions);
    
    // Force header height recalculation after dimension change
    if (headerRef?.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (headerRef.current) {
          const height = headerRef.current.offsetHeight;
          setHeaderHeight(height);
        }
      });
    }
  }, [headerRef]);

  // Track window dimensions with faster response for mobile
  useEffect(() => {
    updateDimensions();
    
    let timeoutId: NodeJS.Timeout | undefined;
    let rafId: number | undefined;
    
    const handleResize = () => {
      // Clear any pending updates
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      
      // Immediate update for orientation changes (common on mobile)
      rafId = requestAnimationFrame(() => {
        updateDimensions();
        
        // Debounced update for final settling
        timeoutId = setTimeout(updateDimensions, 50); // Reduced from 100ms
      });
    };

    // Special handling for orientation change on mobile
    const handleOrientationChange = () => {
      // Clear existing timeouts
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      
      // Multiple updates to handle iOS quirks
      rafId = requestAnimationFrame(() => {
        updateDimensions();
        setTimeout(() => updateDimensions(), 100); // iOS often needs a delay
        setTimeout(() => updateDimensions(), 300); // Final settling
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateDimensions]);

  // Calculate header height with better timing
  useEffect(() => {
    if (headerRef?.current) {
      const updateHeaderHeight = () => {
        if (headerRef.current) {
          const height = headerRef.current.offsetHeight;
          setHeaderHeight(height);
        }
      };

      // Initial calculation
      updateHeaderHeight();
      
      // Also update after a brief delay to catch any layout changes
      const timeoutId = setTimeout(updateHeaderHeight, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [playerCount, windowDimensions, headerRef]);

  // Use ResizeObserver for accurate header height tracking
  useEffect(() => {
    if (!headerRef?.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        // Use requestAnimationFrame to avoid layout thrashing
        requestAnimationFrame(() => {
          setHeaderHeight(height);
        });
      }
    });

    resizeObserver.observe(headerRef.current);
    return () => resizeObserver.disconnect();
  }, [headerRef]);

  return { headerHeight, windowDimensions };
};