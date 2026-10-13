"use client";

import { useEffect, useRef } from "react";
import { countPostView } from "@/source/entities/posts";

/** Засчитывает просмотр, когда публикация появилась на экране. */
export function usePostView(id: number, published: boolean) {
  const element = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!published || !element.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void countPostView(id).catch(() => {});
      },
      { threshold: 0.15 },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [id, published]);
  return element;
}
