import { useEffect, useRef, type RefObject } from "react";
import {
  clamp,
  getNormalizedWheelDelta,
  hasReachedHorizontalEnd,
} from "./horizontalScroll";

interface UseHorizontalScrollOptions {
  deps?: unknown[];
  onReachEnd?: () => void;
  sentinelRef?: RefObject<HTMLDivElement | null>;
}

export function useHorizontalScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  options?: UseHorizontalScrollOptions,
): void {
  const { deps = [], onReachEnd, sentinelRef } = options ?? {};
  const scrollTargetRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const maybeLoadMore = () => {
      if (onReachEnd && hasReachedHorizontalEnd(element.scrollLeft, element.clientWidth, element.scrollWidth)) {
        onReachEnd();
      }
    };

    const startSmoothScroll = () => {
      if (scrollAnimationRef.current !== null) return;

      const animate = () => {
        const currentElement = containerRef.current;
        if (!currentElement) {
          scrollAnimationRef.current = null;
          return;
        }

        const target = scrollTargetRef.current ?? currentElement.scrollLeft;
        const distance = target - currentElement.scrollLeft;

        if (Math.abs(distance) < 0.5) {
          currentElement.scrollLeft = target;
          scrollAnimationRef.current = null;
          maybeLoadMore();
          return;
        }

        currentElement.scrollLeft += distance * 0.22;
        maybeLoadMore();
        scrollAnimationRef.current = requestAnimationFrame(animate);
      };

      scrollAnimationRef.current = requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 0 || !event.shiftKey) return;

      if (event.deltaX === 0 && Math.abs(event.deltaY) > 0) {
        if (element.scrollLeft <= 0 || element.scrollLeft >= maxScroll - 1) return;
      }

      const delta = getNormalizedWheelDelta({
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaMode: event.deltaMode,
        containerWidth: element.clientWidth,
      });

      const currentTarget = scrollTargetRef.current ?? element.scrollLeft;
      const nextTarget = clamp(currentTarget + delta, 0, maxScroll);
      if (nextTarget === currentTarget) return;

      event.preventDefault();
      scrollTargetRef.current = nextTarget;
      startSmoothScroll();
    };

    element.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    if (onReachEnd) element.addEventListener("scroll", maybeLoadMore);

    return () => {
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }

      scrollAnimationRef.current = null;
      element.removeEventListener("wheel", handleWheel, { capture: true });
      if (onReachEnd) element.removeEventListener("scroll", maybeLoadMore);
    };
  }, deps);

  useEffect(() => {
    if (!onReachEnd || !sentinelRef) return;
    if (typeof window === "undefined" || window.innerWidth >= 768) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onReachEnd();
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, deps);
}