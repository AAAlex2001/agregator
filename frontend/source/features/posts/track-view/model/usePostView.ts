"use client";

import { useEffect, useRef } from "react";
import { countPostView } from "@/source/entities/posts";

/**
 * Засчитывает просмотр, когда опубликованный пост показался на экране.
 * Возвращает ref для карточки.
 */
export function usePostView(id: number, published: boolean) {
  const card = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!published || !card.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        countPostView(id);
      },
      { threshold: 0.15 },
    );
    observer.observe(card.current);

    return () => observer.disconnect();
  }, [id, published]);

  return card;
}
