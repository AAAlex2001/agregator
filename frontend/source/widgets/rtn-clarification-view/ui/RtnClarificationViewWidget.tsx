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
import { RtnClarificationReactions } from "@/source/features/rtn-clarification-reactions";
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
  const requestDocumentItems: FileGalleryItem[] = [];
  const responseDocumentItems: FileGalleryItem[] = [];
  const requestFiles = clarification.request_files?.length
    ? clarification.request_files
    : clarification.pdf_url
      ? [{ name: "Запрос.pdf", url: clarification.pdf_url }]
      : [];
  const responseFiles = clarification.response_files?.length
    ? clarification.response_files
    : clarification.response_pdf_url
      ? [{ name: "Официальный ответ.pdf", url: clarification.response_pdf_url }]
      : [];
  requestFiles.forEach((file, index) => {
    requestDocumentItems.push({
      id: `rtn-request-${clarification.id}-${index}`,
      name: file.name || `Запрос ${index + 1}.pdf`,
      url: resolveFileUrl(file.url),
    });
  });
  responseFiles.forEach((file, index) => {
    responseDocumentItems.push({
      id: `rtn-response-${clarification.id}-${index}`,
      name: file.name || `Ответ ${index + 1}.pdf`,
      url: resolveFileUrl(file.url),
    });
  });
  const hasDocuments = requestDocumentItems.length > 0 || responseDocumentItems.length > 0;

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
        {clarification.tags.length > 0 ? (
          <div className={s.tags}>
            {clarification.tags.map((tag) => (
              <span key={tag} className={s.tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
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

          {(clarification.source_url || hasDocuments) ? (
            <section className={s.documents}>
              <h2 className={s.sectionTitle}>Документы</h2>
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
              {requestDocumentItems.length > 0 ? (
                <FileGallery
                  items={requestDocumentItems}
                  label={requestDocumentItems.length > 1 ? "Файлы запроса" : "Файл запроса"}
                  blockClassName={s.documentGallery}
                />
              ) : null}
              {responseDocumentItems.length > 0 ? (
                <FileGallery
                  items={responseDocumentItems}
                  label={responseDocumentItems.length > 1 ? "Файлы ответов" : "Файл ответа"}
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
            <>
              <RtnClarificationReactions
                clarificationId={clarification.id}
                initial={{
                  likes_count: clarification.likes_count,
                  dislikes_count: clarification.dislikes_count,
                  views_count: clarification.views_count,
                  my_reaction: null,
                }}
              />
              <RtnDiscussion clarificationId={clarification.id} initialComments={initialComments} />
            </>
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
