import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(
  callback: () => void,
  options?: { threshold?: number; enabled?: boolean }
) {
  const { threshold = 100, enabled = true } = options || {};
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const setSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (!enabled || !node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) callback();
        },
        { rootMargin: `${threshold}px` }
      );

      observerRef.current.observe(node);
      sentinelRef.current = node;
    },
    [callback, threshold, enabled]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return setSentinelRef;
}
