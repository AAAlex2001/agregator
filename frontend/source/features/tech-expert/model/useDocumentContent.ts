"use client";

import { useEffect, useState } from "react";
import { fetchTechExpertDocumentContent } from "@/source/entities/tech-expert";

export function useDocumentContent(documentId: number, blocks: number) {
  const [html, setHtml] = useState("");
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (count < 1 || count > blocks) return;
    let active = true;
    setIsLoading(true);
    fetchTechExpertDocumentContent(documentId, count, count > 1)
      .then((chunk) => {
        if (active) setHtml((prev) => prev + chunk);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [documentId, count, blocks]);

  return {
    html,
    isLoading,
    hasMore: count < blocks,
    loadMore: () => setCount((value) => value + 1),
  };
}
