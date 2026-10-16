"use client";

import { useEffect } from "react";

/** Адрес статьи, при смене которого сбрасывается положение прокрутки. */
interface ArticleScrollResetProps {
  slug: string;
}

/** Открывает следующую статью с начала страницы. */
export function ArticleScrollReset({ slug }: ArticleScrollResetProps) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [slug]);

  return null;
}
