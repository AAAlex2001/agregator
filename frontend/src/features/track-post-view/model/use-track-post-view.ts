"use client";

import { useEffect, useRef } from "react";
import { countPostView } from "@/entities/post";

/** Засчитывает просмотр, когда опубликованный пост показался на экране; ref — для карточки. */
export function useTrackPostView(postId: number, isPublished: boolean) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (!isPublished || !card) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        countPostView(postId);
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, [postId, isPublished]);

  return cardRef;
}
