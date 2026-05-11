"use client";

import { useEffect, useRef, type RefObject } from "react";

interface Options {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  root?: RefObject<HTMLElement | null>;
}

/**
 * Возвращает ref, который надо повесить на sentinel-элемент в конце списка.
 * Когда sentinel попадает в область видимости — вызывается onLoadMore.
 * Если список скроллится внутри контейнера — передай root (ref на контейнер).
 */
export function useInfiniteScroll({ hasMore, isLoading, onLoadMore, rootMargin = "200px", root }: Options) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onLoadMore);

  callbackRef.current = onLoadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        callbackRef.current();
      }
    }, { rootMargin, root: root?.current ?? null });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin, root]);

  return sentinelRef;
}
