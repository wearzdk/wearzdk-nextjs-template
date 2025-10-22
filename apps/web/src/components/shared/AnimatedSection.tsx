'use client';

import { type ReactNode, useEffect, useRef } from 'react';

const DESKTOP_ANIMATION = {
  initial: { opacity: 0, transform: 'translateY(50px)' },
  whileInView: { opacity: 1, transform: 'translateY(0)' },
  transition: {
    duration: 0.8,
  },
};

export function AnimatedSection({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        element.style.transition = `opacity ${DESKTOP_ANIMATION.transition.duration}s, transform ${DESKTOP_ANIMATION.transition.duration}s`;
        element.style.opacity = `${DESKTOP_ANIMATION.whileInView.opacity}`;
        element.style.transform = `${DESKTOP_ANIMATION.whileInView.transform}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={DESKTOP_ANIMATION.initial}>
      {children}
    </div>
  );
}
