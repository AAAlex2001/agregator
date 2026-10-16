"use client";

import type { MouseEvent } from "react";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { Loader } from "@/shared/ui/loader";
import { useDocumentContent } from "../../model/use-document-content";
import styles from "./style.module.scss";

/** Документ, число его блоков текста и переход по ссылке на другой документ. */
interface DocumentTextProps {
  documentId: number;
  blocks: number;
  onOpenDocument: (documentId: number) => void;
}

/** Текст документа, который догружается при прокрутке; ссылки открывают документы фонда. */
export function DocumentText({ documentId, blocks, onOpenDocument }: DocumentTextProps) {
  const content = useDocumentContent(documentId, blocks);
  const sentinelRef = useInfiniteScroll({
    hasMore: content.hasMore,
    isLoading: content.isLoading,
    onLoadMore: content.loadMore,
    rootMargin: "600px",
  });

  /** Открывает документ из ссылки фонда вместо перехода по её адресу. */
  function openLinkedDocument(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const linkedId = event.target.closest("a.document")?.getAttribute("nd");

    if (linkedId) {
      event.preventDefault();
      onOpenDocument(Number(linkedId));
    }
  }

  if (blocks === 0) {
    return <p className={styles.empty}>Текст документа недоступен для просмотра.</p>;
  }

  return (
    <div className={styles.block}>
      <div
        className={styles.body}
        onClick={openLinkedDocument}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
      {content.isLoading && (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}
      {content.error && <p className={styles.empty}>{content.error}</p>}
      <div
        ref={sentinelRef}
        className={styles.sentinel}
      />
    </div>
  );
}
