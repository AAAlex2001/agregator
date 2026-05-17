import Image from "next/image";
import Link from "next/link";
import { formatArticleDate } from "../../lib/formatArticleDate";
import type { ArticleKind } from "../../api/article.api";
import styles from "./ArticleCard.module.scss";

export interface ArticleCardProps {
  kind: ArticleKind;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  tags: string[];
  published_at: string | null;
}

export function ArticleCard({ kind, slug, title, excerpt, cover_image, tags, published_at }: ArticleCardProps) {
  const href = `/${kind === "news" ? "news" : "blog"}/${slug}`;
  const badge = tags[0] || (kind === "news" ? "Новость" : "Статья");

  return (
    <Link href={href} className={styles.card} aria-label={title}>
      <div className={styles.body}>
        <div className={styles.cover}>
          {cover_image ? (
            <Image src={cover_image} alt={title} fill sizes="(max-width: 768px) 100vw, 280px" className={styles.coverImage} />
          ) : null}
          <span className={styles.badge}>{badge}</span>
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
        </div>
      </div>
      <div className={styles.footer}>
        <time className={styles.date} dateTime={published_at || undefined}>
          {formatArticleDate(published_at)}
        </time>
        <span className={styles.read}>
          Читать
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
