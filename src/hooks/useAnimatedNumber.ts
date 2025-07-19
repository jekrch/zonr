import { useState, useEffect, useRef } from 'react';

export const useAnimatedNumber = (targetNumber: number, duration = 1000) => {
  const [displayNumber, setDisplayNumber] = useState(targetNumber);
  const startTimeRef = useRef<number | undefined>(undefined);
  const startValueRef = useRef(targetNumber);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (displayNumber === targetNumber) return;

    startTimeRef.current = Date.now();
    startValueRef.current = displayNumber;

    const animate = () => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValueRef.current + (targetNumber - startValueRef.current) * easedProgress;
      setDisplayNumber(Math.round(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetNumber, duration]);

  return displayNumber;
};