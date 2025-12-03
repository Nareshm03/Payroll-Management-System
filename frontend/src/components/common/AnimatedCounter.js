import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ value, duration = 800, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = typeof value === 'number' ? value : 0;
    const startTime = Date.now();

    // Cancel previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Smooth easing function (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easeOutCubic);
      
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endValue;
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className="counter-animate" aria-live="polite">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
