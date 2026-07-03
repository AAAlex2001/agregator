"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { fetchTechExpertDocumentContent } from "@/source/entities/tech-expert";
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
  const [html, setHtml] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count < 1 || count > blocks) return;
    let active = true;
    setLoading(true);
    fetchTechExpertDocumentContent(documentId, count, count > 1)
      .then((chunk) => {
        if (active) setHtml((prev) => prev + chunk);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [documentId, count, blocks]);

  useEffect(() => {
    if (loading || count >= blocks) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setCount((c) => c + 1);
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, count, blocks]);

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
      {loading && (
        <div className={s.textLoading}>
          <Loader />
        </div>
      )}
      <div ref={sentinelRef} className={s.textSentinel} />
    </div>
  );
}
