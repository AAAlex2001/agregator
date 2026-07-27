"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { DocToc } from "@/source/shared/ui/DocToc";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Button from "@/source/shared/ui/Button";
import { formatDateRu } from "@/source/shared/lib/formatDate";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import {
  DOCUMENT_TYPE_LABELS,
  STATUS_LABELS,
  type RtnDetail,
  type RtnListItem,
} from "@/source/entities/rtn-clarification";
import type { RtnComment } from "@/source/entities/rtn-comment";
import { RtnDiscussion } from "@/source/features/rtn-discussion";
import { ReportChangeModal } from "@/source/features/rtn-feedback";
import { extractToc } from "@/source/features/article-view";
import { RtnRelatedList } from "./RtnRelatedList";
import s from "./RtnClarificationViewWidget.module.scss";

interface Props {
  clarification: RtnDetail;
  related: RtnListItem[];
  homeHref?: string;
  sectionHrefPrefix?: string;
  initialComments?: RtnComment[];
  interactive?: boolean;
}

export function RtnClarificationViewWidget({
  clarification,
  related,
  homeHref = "/",
  sectionHrefPrefix = "",
  initialComments,
  interactive = true,
}: Props) {
  const [reportOpen, setReportOpen] = useState(false);
  const sectionHref = `${sectionHrefPrefix}/rtn`;
  const dateLabel = formatDateRu(clarification.published_at);
  const taxonomyChips = [
    ...clarification.oversight_areas,
    ...clarification.industries,
    ...clarification.activities,
    ...clarification.object_types,
  ];
  const parsedAnswer = extractToc(
    `<h2>Ответ Ростехнадзора</h2>${clarification.answer_html}`,
  );
  const toc = [
    { id: "question", num: "01", label: "Вопрос" },
    ...parsedAnswer.toc.map((item, index) => ({
      ...item,
      num: String(index + 2).padStart(2, "0"),
    })),
  ];
  const documentItems: FileGalleryItem[] = [];
  if (clarification.pdf_url) {
    documentItems.push({
      id: `rtn-request-${clarification.id}`,
      name: "Обращение в Ростехнадзор.pdf",
      url: resolveFileUrl(clarification.pdf_url),
    });
  }
  if (clarification.response_pdf_url) {
    documentItems.push({
      id: `rtn-response-${clarification.id}`,
      name: "Ответ Ростехнадзора.pdf",
      url: resolveFileUrl(clarification.response_pdf_url),
    });
  }

  return (
    <article className={s.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: "Ростехнадзор отвечает", href: sectionHref },
          { label: clarification.title },
        ]}
      />

      <header className={s.head}>
        <div className={s.badges}>
          <span className={s.docType}>{DOCUMENT_TYPE_LABELS[clarification.document_type]}</span>
          <span className={clarification.status === "ACTIVE" ? s.statusActive : s.statusExpired}>
            {STATUS_LABELS[clarification.status]}
          </span>
        </div>
        <Title text={clarification.title} as="h1" className={s.title} />
        {clarification.excerpt ? <Subtitle text={clarification.excerpt} className={s.subtitle} /> : null}

        <div className={s.meta}>
          {clarification.letter_number ? <span>№ {clarification.letter_number}</span> : null}
          {clarification.department ? <span>{clarification.department}</span> : null}
          {dateLabel ? (
            <time dateTime={clarification.published_at || undefined}>{dateLabel}</time>
          ) : null}
        </div>

        {taxonomyChips.length > 0 && (
          <div className={s.taxonomyChips}>
            {taxonomyChips.map((chip) => (
              <span key={chip.value} className={s.taxonomyChip}>
                {chip.label}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className={s.layout}>
        {toc.length > 0 ? <DocToc items={toc} className={s.toc} /> : null}

        <div className={s.body}>
          {clarification.question_text ? (
            <blockquote id="question" className={s.questionBlock}>
              <h2 className={s.questionTitle}>Вопрос</h2>
              <p className={s.questionText}>{clarification.question_text}</p>
            </blockquote>
          ) : null}

          <div
            className={s.answerContent}
            dangerouslySetInnerHTML={{ __html: parsedAnswer.html }}
          />

          {(clarification.source_url || documentItems.length > 0) ? (
            <section className={s.documents}>
              <h2 className={s.sectionTitle}>Источник и документы</h2>
              {clarification.source_url ? (
                <a
                  href={clarification.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className={s.sourceLink}
                >
                  Источник на сайте Ростехнадзора
                </a>
              ) : null}
              {documentItems.length > 0 ? (
                <FileGallery
                  items={documentItems}
                  label="Документы"
                  blockClassName={s.documentGallery}
                />
              ) : null}
            </section>
          ) : null}

          {clarification.referenced_regulations.length > 0 && (
            <section className={s.regulations}>
              <h2 className={s.sectionTitle}>Упомянутые нормативные документы</h2>
              <ul className={s.regulationsList}>
                {clarification.referenced_regulations.map((regulation) => (
                  <li key={regulation.url}>
                    <a href={regulation.url} target="_blank" rel="noreferrer">
                      {regulation.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className={s.reportRow}>
            <Button variant="transparent" size="sm" onClick={() => setReportOpen(true)}>
              Сообщить об изменении
            </Button>
          </div>

          {interactive ? (
            <RtnDiscussion clarificationId={clarification.id} initialComments={initialComments} />
          ) : null}
        </div>
      </div>

      {related.length > 0 ? <RtnRelatedList items={related} /> : null}

      <ReportChangeModal
        open={reportOpen}
        clarificationId={clarification.id}
        onClose={() => setReportOpen(false)}
      />
    </article>
  );
}
