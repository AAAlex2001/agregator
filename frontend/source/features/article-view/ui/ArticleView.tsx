import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { DocToc } from "@/source/shared/ui/DocToc";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import {
  ArticleCard,
  formatArticleDate,
  type ArticleDetail,
  type ArticleListItem,
} from "@/source/entities/article";
import { extractToc } from "../lib/extractToc";
import s from "./ArticleView.module.scss";

interface Props {
  article: ArticleDetail;
  related: ArticleListItem[];
  homeHref?: string;
  sectionHrefPrefix?: string;
}

export function ArticleView({ article, related, homeHref = "/", sectionHrefPrefix = "" }: Props) {
  const isNews = article.kind === "news";
  const sectionTitle = isNews ? "Новости" : "Блог";
  const sectionHref = `${sectionHrefPrefix}${isNews ? "/news" : "/blog"}`;
  const { html, toc } = extractToc(article.content_html || "");
  const dateLabel = formatArticleDate(article.published_at);

  return (
    <article className={s.wrapper}>
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
          <div className={s.content} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>

      {related.length > 0 && (
        <section className={s.related}>
          <h2 className={s.relatedTitle}>Смотрите также</h2>
          <div className={s.relatedGrid}>
            {related.map((item) => (
              <ArticleCard
                key={item.id}
                kind={item.kind}
                slug={item.slug}
                title={item.title}
                excerpt={item.excerpt}
                cover_image={item.cover_image}
                tags={item.tags}
                published_at={item.published_at}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
