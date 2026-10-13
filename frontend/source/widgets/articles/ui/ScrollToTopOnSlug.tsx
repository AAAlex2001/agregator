"use client";

import { useEffect } from "react";

interface ScrollToTopOnSlugProps {
  slug: string;
}

/** При переходе между статьями страница начинается сверху, а не с прежней позиции прокрутки. */
export function ScrollToTopOnSlug({ slug }: ScrollToTopOnSlugProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  return null;
}
