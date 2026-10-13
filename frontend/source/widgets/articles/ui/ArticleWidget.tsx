import {
  ArticleContent,
  ArticleViewTracker,
  ArticlesSlider,
  detectDirection,
  splitByMiddleHeading,
  splitTrailingImage,
  type ArticleComment,
  type ArticleDetail,
  type ArticleListItem,
  type ReactionState,
} from "@/source/entities/article";
import { LEAD_FORM_ID } from "@/source/entities/lead";
import { ArticleDiscussion } from "@/source/features/articles/discussion";
import { LeadForm } from "@/source/features/articles/lead-form";
import { ArticleReactions } from "@/source/features/articles/reactions";
import { RegisterCta } from "@/source/features/articles/register-cta";
import { ArticleShareButton } from "@/source/features/articles/share";
import { SITE_URL } from "@/source/shared/api/config";
import { extractToc } from "@/source/shared/lib/extractToc";
import { formatDateLong } from "@/source/shared/lib/formatDate";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { DocToc } from "@/source/shared/ui/DocToc";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./ArticleWidget.module.scss";

interface ArticleWidgetProps {
  article: ArticleDetail;
  related: ArticleListItem[];
  initialReactions: ReactionState | undefined;
  initialComments: ArticleComment[];
  homeHref?: string;
  sectionHrefPrefix?: string;
}

/** Страница статьи: шапка, оглавление, текст с блоком регистрации посередине и заявкой в конце, оценки, обсуждение и похожие. */
export function ArticleWidget({
  article,
  related,
  initialReactions,
  initialComments,
  homeHref = "/",
  sectionHrefPrefix = "",
}: ArticleWidgetProps) {
  const sectionTitle = article.kind === "news" ? "Новости" : "Блог";
  const sectionHref = `${sectionHrefPrefix}/${article.kind}`;
  const publicUrl = `${SITE_URL}/${article.kind}/${article.slug}`;

  const { html, toc: headings } = extractToc(article.content_html);
  const toc = headings.length
    ? [...headings, { id: LEAD_FORM_ID, num: String(headings.length + 1).padStart(2, "0"), label: "Оставить заявку" }]
    : [];
  const [htmlBeforeCta, htmlAfterCta] = splitByMiddleHeading(html);
  const [htmlTail, trailingImage] = splitTrailingImage(htmlAfterCta || htmlBeforeCta);
  const leadDirection = article.direction ?? detectDirection(html);
  const dateLabel = formatDateLong(article.published_at);

  return (
    <article className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: homeHref }, { label: sectionTitle, href: sectionHref }, { label: article.title }]} />

      <header className={s.head}>
        <Title text={article.title} as="h1" className={s.title} />
        {article.excerpt && <Subtitle text={article.excerpt} className={s.subtitle} />}
        <div className={s.meta}>
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={s.tag}>
              {tag}
            </span>
          ))}
          {dateLabel && <time dateTime={article.published_at || undefined}>{dateLabel}</time>}
        </div>
      </header>

      <div className={s.layout}>
        {toc.length > 0 && <DocToc items={toc} className={s.toc} />}
        <div className={s.body}>
          {htmlAfterCta ? (
            <>
              <ArticleContent html={htmlBeforeCta} />
              <RegisterCta />
              <ArticleContent html={htmlTail} />
            </>
          ) : (
            <>
              <ArticleContent html={htmlTail} />
              <RegisterCta />
            </>
          )}
          <LeadForm defaultDirection={leadDirection} />
          {trailingImage && <ArticleContent html={trailingImage} wideImage />}
          <ArticleViewTracker articleId={article.id} />
          <ArticleShareButton url={publicUrl} />
          <ArticleReactions articleId={article.id} initial={initialReactions} />
          <ArticleDiscussion articleId={article.id} initialComments={initialComments} />
        </div>
      </div>

      <ArticlesSlider title="Смотрите также" items={related} />
    </article>
  );
}
