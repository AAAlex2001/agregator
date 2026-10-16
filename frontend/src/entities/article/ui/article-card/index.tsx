import Image from "next/image";
import Link from "next/link";
import { formatDateLong } from "@/shared/lib/format-date";
import { EyeIcon, ThumbDownIcon, ThumbUpIcon } from "@/shared/ui/icons";
import type { ArticleListItem } from "../../model/types";
import styles from "./style.module.scss";

/** Статья и адрес её страницы в публичном разделе или кабинете. */
interface ArticleCardProps {
  article: ArticleListItem;
  href: string;
}

/** Показывает обложку, краткое описание и статистику статьи. */
export function ArticleCard({ article, href }: ArticleCardProps) {
  const badge = article.tags[0]
    || (article.kind === "news" ? "Новость" : "Статья");

  return (
    <Link
      href={href}
      className={styles.card}
      aria-label={article.title}
    >
      <div className={styles.body}>
        <div className={styles.cover}>
          {article.cover_image && (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              sizes="(min-width: 1440px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={styles.coverImage}
            />
          )}
          <span className={styles.badge}>{badge}</span>
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{article.title}</h3>
          {article.excerpt && (
            <p className={styles.excerpt}>{article.excerpt}</p>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.footer}>
          <time
            className={styles.date}
            dateTime={article.published_at || undefined}
          >
            {formatDateLong(article.published_at)}
          </time>
          <span className={styles.read}>
            Читать
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="var(--color-orange-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className={styles.stats}>
          <span className={styles.reactions}>
            <span className={styles.stat}>
              <ThumbUpIcon className={styles.statIcon} />
              {article.likes_count}
            </span>
            <span className={styles.stat}>
              <ThumbDownIcon className={styles.statIcon} />
              {article.dislikes_count}
            </span>
          </span>
          <span className={styles.stat}>
            <EyeIcon className={styles.statIcon} />
            {article.views_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
