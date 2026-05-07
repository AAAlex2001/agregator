"use client";

import { useEffect, useRef } from "react";

interface Options {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

/**
 * Возвращает ref, который надо повесить на sentinel-элемент в конце списка.
 * Когда sentinel попадает в область видимости — вызывается onLoadMore.
 *
 * Использует IntersectionObserver. Колбэк onLoadMore читается через ref,
 * поэтому не обязан быть стабильным — лишних эффектов не вызовет.
 */
export function useInfiniteScroll({ hasMore, isLoading, onLoadMore, rootMargin = "200px" }: Options) {
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
    }, { rootMargin });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin]);

  return sentinelRef;
}
