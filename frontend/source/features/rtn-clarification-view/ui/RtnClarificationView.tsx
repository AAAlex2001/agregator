"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Button from "@/source/shared/ui/Button";
import { FileIcon } from "@/source/shared/ui/icons";
import { formatDateRu } from "@/source/shared/lib/formatDate";
import {
  DOCUMENT_TYPE_LABELS,
  STATUS_LABELS,
  type RtnDetail,
  type RtnListItem,
} from "@/source/entities/rtn-clarification";
import type { RtnComment } from "@/source/entities/rtn-comment";
import { RtnDiscussion } from "@/source/features/rtn-discussion";
import { ReportChangeModal } from "@/source/features/rtn-feedback";
import { RtnRelatedList } from "./RtnRelatedList";
import s from "./RtnClarificationView.module.scss";

interface Props {
  clarification: RtnDetail;
  related: RtnListItem[];
  homeHref?: string;
  sectionHrefPrefix?: string;
  initialComments?: RtnComment[];
  interactive?: boolean;
}

export function RtnClarificationView({
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

      <div className={s.body}>
        {clarification.question_text ? (
          <section className={s.questionBlock}>
            <h2 className={s.blockTitle}>Вопрос</h2>
            <p className={s.questionText}>{clarification.question_text}</p>
          </section>
        ) : null}

        <section className={s.answerBlock}>
          <h2 className={s.blockTitle}>Ответ Ростехнадзора</h2>
          <div className={s.answerContent} dangerouslySetInnerHTML={{ __html: clarification.answer_html }} />
        </section>

        <div className={s.sourceLinks}>
          {clarification.source_url ? (
            <a href={clarification.source_url} target="_blank" rel="noreferrer" className={s.sourceLink}>
              Источник на сайте Ростехнадзора
            </a>
          ) : null}
          {clarification.pdf_url ? (
            <a href={clarification.pdf_url} target="_blank" rel="noreferrer" className={s.sourceLink}>
              <FileIcon className={s.sourceIcon} />
              Скан-копия письма (PDF)
            </a>
          ) : null}
        </div>

        {clarification.referenced_regulations.length > 0 && (
          <section className={s.regulations}>
            <h2 className={s.blockTitle}>Упомянутые нормативные документы</h2>
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

      {related.length > 0 ? <RtnRelatedList items={related} /> : null}

      <ReportChangeModal
        open={reportOpen}
        clarificationId={clarification.id}
        onClose={() => setReportOpen(false)}
      />
    </article>
  );
}
