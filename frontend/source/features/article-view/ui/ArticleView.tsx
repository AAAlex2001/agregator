import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { DocToc } from "@/source/shared/ui/DocToc";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { SITE_URL } from "@/source/shared/api/config";
import {
  formatArticleDate,
  type ArticleDetail,
  type ArticleListItem,
} from "@/source/entities/article";
import { ArticlesRelatedSlider } from "@/source/features/articles-related-slider";
import { ArticleReactions } from "@/source/features/article-reactions/ui/ArticleReactions";
import { ArticleDiscussion } from "@/source/features/article-discussion/ui/ArticleDiscussion";
import { ArticleViewTracker } from "./ArticleViewTracker";
import { ArticleShareButton } from "./ArticleShareButton";
import { NewsCtaWidget } from "./NewsCtaWidget";
import type { ReactionState } from "@/source/entities/article-reaction";
import type { ArticleComment } from "@/source/entities/article-comment";
import { LeadFormWidget, LEAD_FORM_ID } from "@/source/features/lead-form";
import { extractToc } from "../lib/extractToc";
import { splitByMiddleHeading } from "../lib/splitByMiddleHeading";
import { splitTrailingImage } from "../lib/splitTrailingImage";
import s from "./ArticleView.module.scss";

/** Направление формы заявки берём по ссылке на лендинг в тексте статьи. */
const DIRECTION_BY_HREF: [string, string][] = [
  ["/ekspertiza-promyshlennoy-bezopasnosti", "EXPERTISE"],
  ["/audit-supb", "AUDIT_SUPB"],
  ["/tehnicheskoe-diagnostirovanie", "TECH_DIAG"],
  ["/proektirovanie", "DESIGN"],
  ["/inzhenernye-izyskaniya", "SURVEY"],
  ["/ekologiya", "ECOLOGY"],
  ["/nir", "RESEARCH"],
  ["/kadastrovye-raboty", "CADASTRAL"],
  ["/sudebnaya-ekspertiza", "FORENSIC"],
];

function detectDirection(html: string): string | undefined {
  return DIRECTION_BY_HREF.find(([href]) => html.includes(`href="${href}"`))?.[1];
}

interface Props {
  article: ArticleDetail;
  related: ArticleListItem[];
  homeHref?: string;
  sectionHrefPrefix?: string;
  initialReactions?: ReactionState;
  initialComments?: ArticleComment[];
  interactive?: boolean;
  discussionEnabled?: boolean;
}

export function ArticleView({
  article,
  related,
  homeHref = "/",
  sectionHrefPrefix = "",
  initialReactions,
  initialComments,
  interactive = true,
  discussionEnabled = true,
}: Props) {
  const isNews = article.kind === "news";
  const sectionTitle = isNews ? "Новости" : "Блог";
  const sectionHref = `${sectionHrefPrefix}${isNews ? "/news" : "/blog"}`;
  const publicPath = `${isNews ? "/news" : "/blog"}/${article.slug}`;
  const publicUrl = `${SITE_URL}${publicPath}`;
  const { html, toc: headings } = extractToc(article.content_html || "");
  const toc = headings.length
    ? [
        ...headings,
        {
          id: LEAD_FORM_ID,
          num: String(headings.length + 1).padStart(2, "0"),
          label: "Оставить заявку",
        },
      ]
    : [];
  const [htmlBeforeCta, htmlAfterCta] = splitByMiddleHeading(html);
  const [htmlTail, trailingImage] = splitTrailingImage(htmlAfterCta || htmlBeforeCta);
  const leadDirection = detectDirection(html);
  const dateLabel = formatArticleDate(article.published_at);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}${homeHref}` },
      { "@type": "ListItem", position: 2, name: sectionTitle, item: `${SITE_URL}${sectionHref}` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}${sectionHref}/${article.slug}` },
    ],
  };

  return (
    <article className={s.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: sectionTitle, href: sectionHref },
          { label: article.title },
        ]}
      />

      <header className={s.head}>
        <Title text={article.title} as="h1" className={s.title} />
        {article.excerpt ? <Subtitle text={article.excerpt} className={s.subtitle} /> : null}
        <div className={s.meta}>
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={s.tag}>{tag}</span>
          ))}
          {dateLabel ? <time dateTime={article.published_at || undefined}>{dateLabel}</time> : null}
        </div>
      </header>

      <div className={s.layout}>
        {toc.length > 0 ? <DocToc items={toc} className={s.toc} /> : null}
        <div className={s.body}>
          {htmlAfterCta ? (
            <>
              <div className={s.content} dangerouslySetInnerHTML={{ __html: htmlBeforeCta }} />
              <NewsCtaWidget />
              <div className={s.content} dangerouslySetInnerHTML={{ __html: htmlTail }} />
            </>
          ) : (
            <>
              <div className={s.content} dangerouslySetInnerHTML={{ __html: htmlTail }} />
              <NewsCtaWidget />
            </>
          )}
          <LeadFormWidget defaultDirection={leadDirection} />
          {trailingImage ? (
            <div
              className={`${s.content} ${s.trailingImage}`}
              dangerouslySetInnerHTML={{ __html: trailingImage }}
            />
          ) : null}
          {interactive ? <ArticleViewTracker articleId={article.id} /> : null}
          <div className={s.shareRow}>
            <ArticleShareButton url={publicUrl} />
          </div>
          {interactive ? (
            <>
              <ArticleReactions articleId={article.id} initial={initialReactions} views={article.views_count} />
              {discussionEnabled ? (
                <ArticleDiscussion articleId={article.id} initialComments={initialComments} />
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {related.length > 0 && (
        <ArticlesRelatedSlider title="Смотрите также" items={related} />
      )}
    </article>
  );
}
