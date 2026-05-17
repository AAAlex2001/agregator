import Link from "next/link";
import { DocToc } from "@/source/shared/ui/DocToc";
import {
  ArticleCard,
  formatArticleDate,
  type ArticleDetail,
  type ArticleListItem,
} from "@/source/entities/article";
import { extractToc } from "../lib/extractToc";
import styles from "./ArticleView.module.scss";

interface Props {
  article: ArticleDetail;
  related: ArticleListItem[];
}

export function ArticleView({ article, related }: Props) {
  const isNews = article.kind === "news";
  const sectionTitle = isNews ? "Новости" : "Блог";
  const sectionHref = isNews ? "/news" : "/blog";
  const { html, toc } = extractToc(article.content_html || "");
  const dateLabel = formatArticleDate(article.published_at);

  return (
    <article className={styles.wrapper}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.sep}>·</span>
        <Link href={sectionHref}>{sectionTitle}</Link>
        <span className={styles.sep}>·</span>
        <span aria-current="page">{article.title}</span>
      </nav>

      <header className={styles.head}>
        <h1 className={styles.title}>{article.title}</h1>
        {article.excerpt ? <p className={styles.subtitle}>{article.excerpt}</p> : null}
        <div className={styles.meta}>
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
          {dateLabel ? <time dateTime={article.published_at || undefined}>{dateLabel}</time> : null}
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.body}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        {toc.length > 0 ? <DocToc items={toc} /> : null}
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>Смотрите также</h2>
          <div className={styles.relatedGrid}>
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
