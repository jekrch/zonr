import { useRef, useCallback } from 'react';

export const useHoldButton = (callback: () => void, initialDelay = 1000, repeatDelay = 100) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const touchActiveRef = useRef(false);
  const isActiveRef = useRef(false);

  const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // Prevent multiple activations
    if (isActiveRef.current) return;
    
    // If this is a mouse event but we recently had a touch event, ignore it
    if (e.type.startsWith('mouse') && touchActiveRef.current) {
      return;
    }
    
    // Mark as active
    isActiveRef.current = true;
    
    // Track if this was a touch event
    if (e.type.startsWith('touch')) {
      touchActiveRef.current = true;
      // Reset touch flag after a short delay
      setTimeout(() => {
        touchActiveRef.current = false;
      }, 500);
    }
    
    // Prevent default to avoid ghost clicks on mobile
    e.preventDefault();
    
    // Execute immediately
    callback();
    
    // Start repeating after initial delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(callback, repeatDelay);
    }, initialDelay);
  }, [callback, initialDelay, repeatDelay]);

  const stop = useCallback((e?: React.TouchEvent | React.MouseEvent) => {
    // Only stop if we're actually active
    if (!isActiveRef.current) return;
    
    // If this is a mouse event but we're in touch mode, ignore it
    if (e && e.type.startsWith('mouse') && touchActiveRef.current) {
      return;
    }
    
    isActiveRef.current = false;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    start(e);
  }, [start]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    stop(e);
  }, [stop]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    stop(e);
  }, [stop]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    start(e);
  }, [start]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    stop(e);
  }, [stop]);

  const handlers = {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };

  return handlers;
};