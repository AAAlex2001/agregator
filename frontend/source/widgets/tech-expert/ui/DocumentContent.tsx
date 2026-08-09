"use client";

import type { MouseEvent } from "react";
import { useDocumentContent } from "@/source/features/tech-expert";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { Loader } from "@/source/shared/ui";
import s from "./TechExpertWidget.module.scss";

export function DocumentContent({
  documentId,
  blocks,
  onOpenDocument,
}: {
  documentId: number;
  blocks: number;
  onOpenDocument: (id: number) => void;
}) {
  const { html, isLoading, hasMore, loadMore } = useDocumentContent(documentId, blocks);
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMore,
    rootMargin: "600px",
  });

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const link = (e.target as HTMLElement).closest("a.document");
    if (!link) return;
    e.preventDefault();
    const nd = link.getAttribute("nd");
    if (nd) onOpenDocument(Number(nd));
  };

  if (blocks === 0) {
    return <p className={s.textEmpty}>Текст документа недоступен для просмотра.</p>;
  }

  return (
    <div className={s.textBlock}>
      <div className={s.textBody} onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} />
      {isLoading && (
        <div className={s.textLoading}>
          <Loader />
        </div>
      )}
      <div ref={sentinelRef} className={s.textSentinel} />
    </div>
  );
}
