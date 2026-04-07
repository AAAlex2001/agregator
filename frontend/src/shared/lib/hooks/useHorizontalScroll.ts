import { useEffect, useRef, type RefObject } from "react";
import {
  clamp,
  getNormalizedWheelDelta,
  hasReachedHorizontalEnd,
} from "@/features/order/list-expert/lib/ordersPage.utils";

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

  // Desktop: wheel → smooth horizontal scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const maybeLoadMore = () => {
      if (onReachEnd && hasReachedHorizontalEnd(el.scrollLeft, el.clientWidth, el.scrollWidth)) {
        onReachEnd();
      }
    };

    const startSmoothScroll = () => {
      if (scrollAnimationRef.current !== null) return;
      const animate = () => {
        const e = containerRef.current;
        if (!e) { scrollAnimationRef.current = null; return; }
        const target = scrollTargetRef.current ?? e.scrollLeft;
        const distance = target - e.scrollLeft;
        if (Math.abs(distance) < 0.5) {
          e.scrollLeft = target;
          scrollAnimationRef.current = null;
          maybeLoadMore();
          return;
        }
        e.scrollLeft += distance * 0.22;
        maybeLoadMore();
        scrollAnimationRef.current = requestAnimationFrame(animate);
      };
      scrollAnimationRef.current = requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0 || !event.shiftKey) return;
      if (event.deltaX === 0 && Math.abs(event.deltaY) > 0) {
        if (el.scrollLeft <= 0 || el.scrollLeft >= maxScroll - 1) return;
      }
      const delta = getNormalizedWheelDelta({
        deltaX: event.deltaX, deltaY: event.deltaY,
        deltaMode: event.deltaMode, containerWidth: el.clientWidth,
      });
      const currentTarget = scrollTargetRef.current ?? el.scrollLeft;
      const nextTarget = clamp(currentTarget + delta, 0, maxScroll);
      if (nextTarget === currentTarget) return;
      event.preventDefault();
      scrollTargetRef.current = nextTarget;
      startSmoothScroll();
    };

    el.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    if (onReachEnd) el.addEventListener("scroll", maybeLoadMore);

    return () => {
      if (scrollAnimationRef.current !== null) cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
      el.removeEventListener("wheel", handleWheel, { capture: true });
      if (onReachEnd) el.removeEventListener("scroll", maybeLoadMore);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Mobile: IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!onReachEnd || !sentinelRef) return;
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) onReachEnd(); },
      { root: null, rootMargin: "200px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
