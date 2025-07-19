import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

interface Dimensions {
  headerHeight: number;
  windowDimensions: { width: number; height: number };
}

export const useDimensions = (
  playerCount?: number, 
  headerRef?: RefObject<HTMLDivElement>
): Dimensions => {
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Track window dimensions with debouncing
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    
    let timeoutId: NodeJS.Timeout | undefined;
    const debouncedResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Calculate header height dynamically
  useEffect(() => {
    if (headerRef?.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
    }
  }, [playerCount, windowDimensions, headerRef]);

  // Use ResizeObserver for accurate header height tracking
  useEffect(() => {
    if (!headerRef?.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setHeaderHeight(height);
      }
    });

    resizeObserver.observe(headerRef.current);
    return () => resizeObserver.disconnect();
  }, [headerRef]);

  return { headerHeight, windowDimensions };
};