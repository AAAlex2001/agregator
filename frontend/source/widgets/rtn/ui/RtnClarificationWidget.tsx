import {
  hasRtnDocuments,
  RtnDocuments,
  RtnRegulations,
  RtnRelatedSlider,
  type RtnComment,
  type RtnDetail,
  type RtnListItem,
} from "@/source/entities/rtn";
import { RtnDiscussion } from "@/source/features/rtn/discussion";
import { RtnReactions } from "@/source/features/rtn/reactions";
import { ReportChangeButton } from "@/source/features/rtn/report-change";
import { extractToc } from "@/source/shared/lib/extractToc";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { DocToc } from "@/source/shared/ui/DocToc";
import { RtnClarificationHeader } from "./RtnClarificationHeader";
import s from "./RtnClarificationWidget.module.scss";

const QUESTION_SECTION = { id: "question", num: "01", label: "Вопрос" };

interface RtnClarificationWidgetProps {
  clarification: RtnDetail;
  related: RtnListItem[];
  comments: RtnComment[];
  basePath: string;
}

/** Страница разъяснения: вопрос, ответ с оглавлением, документы, нормативка, оценки, обсуждение и похожие. */
export function RtnClarificationWidget({ clarification, related, comments, basePath }: RtnClarificationWidgetProps) {
  const hasQuestion = Boolean(clarification.question_text);
  const answer = extractToc(`<h2>Ответ Ростехнадзора</h2>${clarification.answer_html}`, hasQuestion ? 2 : 1);
  const toc = hasQuestion ? [QUESTION_SECTION, ...answer.toc] : answer.toc;

  return (
    <article className={s.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: basePath || "/" },
          { label: "Ростехнадзор отвечает", href: `${basePath}/rtn` },
          { label: clarification.title },
        ]}
      />

      <RtnClarificationHeader clarification={clarification} />

      <div className={s.layout}>
        <DocToc items={toc} className={s.toc} />

        <div className={s.body}>
          {clarification.question_text && (
            <blockquote id="question" className={s.question}>
              <h2 className={s.questionTitle}>Вопрос</h2>
              <p className={s.questionText}>{clarification.question_text}</p>
            </blockquote>
          )}

          <div className={s.answer} dangerouslySetInnerHTML={{ __html: answer.html }} />

          {hasRtnDocuments(clarification) && (
            <section className={s.section}>
              <h2 className={s.sectionTitle}>Документы</h2>
              <RtnDocuments item={clarification} />
            </section>
          )}

          {clarification.referenced_regulations.length > 0 && (
            <section className={s.section}>
              <h2 className={s.sectionTitle}>Упомянутые нормативные документы</h2>
              <RtnRegulations links={clarification.referenced_regulations} />
            </section>
          )}

          <div className={s.report}>
            <ReportChangeButton clarificationId={clarification.id} />
          </div>
          <RtnReactions clarification={clarification} />
          <RtnDiscussion clarificationId={clarification.id} initialComments={comments} />
        </div>
      </div>

      <RtnRelatedSlider items={related} basePath={basePath} />
    </article>
  );
}
