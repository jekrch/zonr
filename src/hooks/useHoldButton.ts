import { useRef, useCallback } from 'react';

export const useHoldButton = (callback: () => void, initialDelay = 400, repeatDelay = 200) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const start = useCallback(() => {
    // Execute immediately
    callback();
    
    // Start repeating after initial delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(callback, repeatDelay);
    }, initialDelay);
  }, [callback, initialDelay, repeatDelay]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const handlers = {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };

  return handlers;
};