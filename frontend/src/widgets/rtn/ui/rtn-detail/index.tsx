import {
  hasRtnDocuments,
  RtnDocuments,
  RtnRegulations,
} from "@/entities/rtn";
import type {
  RtnComment,
  RtnDetail as RtnDetailData,
  RtnListItem,
} from "@/entities/rtn";
import { RateRtn } from "@/features/rate-rtn";
import { ReportRtnChange } from "@/features/report-rtn-change";
import { extractToc } from "@/shared/lib/extract-toc";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { DocumentToc } from "@/shared/ui/document-toc";
import { RelatedRtn } from "../related-rtn";
import { RtnDetailHeader } from "../rtn-detail-header";
import { RtnDiscussion } from "../rtn-discussion";
import styles from "./style.module.scss";

/** Начальный раздел оглавления, если в разъяснении приведён исходный вопрос. */
const QUESTION_SECTION = {
  id: "question",
  num: "01",
  label: "Вопрос",
};

/** Серверные данные разъяснения и префикс публичных или кабинетных ссылок. */
interface RtnDetailProps {
  clarification: RtnDetailData;
  related: RtnListItem[];
  comments: RtnComment[];
  basePath?: string;
}

/** Собирает текст разъяснения, документы, оглавление и действия читателей. */
export function RtnDetail({
  clarification,
  related,
  comments,
  basePath = "",
}: RtnDetailProps) {
  const hasQuestion = Boolean(clarification.question_text);
  const answer = extractToc(
    `<h2>Ответ Ростехнадзора</h2>${clarification.answer_html}`,
    hasQuestion ? 2 : 1,
  );
  const toc = hasQuestion ? [QUESTION_SECTION, ...answer.toc] : answer.toc;

  return (
    <article className={styles.wrapper}>
      <Breadcrumbs
        items={[
          {
            label: "Главная",
            href: basePath || "/",
          },
          {
            label: "Ростехнадзор отвечает",
            href: `${basePath}/rtn`,
          },
          {
            label: clarification.title,
          },
        ]}
      />
      <RtnDetailHeader clarification={clarification} />
      <div className={styles.layout}>
        <DocumentToc
          items={toc}
          className={styles.toc}
        />
        <div className={styles.body}>
          {clarification.question_text && (
            <blockquote
              id="question"
              className={styles.question}
            >
              <h2 className={styles.questionTitle}>Вопрос</h2>
              <p className={styles.questionText}>{clarification.question_text}</p>
            </blockquote>
          )}
          <div
            className={styles.answer}
            dangerouslySetInnerHTML={{ __html: answer.html }}
          />

          {hasRtnDocuments(clarification) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Документы</h2>
              <RtnDocuments item={clarification} />
            </section>
          )}

          {clarification.referenced_regulations.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Упомянутые нормативные документы</h2>
              <RtnRegulations links={clarification.referenced_regulations} />
            </section>
          )}

          <div className={styles.report}>
            <ReportRtnChange clarificationId={clarification.id} />
          </div>
          <RateRtn
            clarificationId={clarification.id}
            initial={{
              likes_count: clarification.likes_count,
              dislikes_count: clarification.dislikes_count,
              views_count: clarification.views_count,
              my_reaction: null,
            }}
          />
          <RtnDiscussion
            clarificationId={clarification.id}
            initialComments={comments}
          />
        </div>
      </div>
      <RelatedRtn
        items={related}
        basePath={basePath}
      />
    </article>
  );
}
