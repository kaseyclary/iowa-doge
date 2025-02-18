import React, { useEffect, useState, useRef } from 'react';

const easeOutQuad = t => t * (2 - t);

const CountUp = ({ 
  value, 
  duration = 1000, 
  formatFn = (num) => num,
  className = "" 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);
  const startTime = useRef(null);
  const frameId = useRef(null);
  const startValue = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          setIsInView(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    startValue.current = 0;
    startTime.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = startValue.current + (value - startValue.current) * easeOutQuad(progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameId.current = requestAnimationFrame(animate);
      }
    };

    frameId.current = requestAnimationFrame(animate);

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [value, duration, isInView]);

  return (
    <span ref={elementRef} className={className}>
      {formatFn(displayValue)}
    </span>
  );
};

export default CountUp; 