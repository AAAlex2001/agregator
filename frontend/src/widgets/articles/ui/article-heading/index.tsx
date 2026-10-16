import type { Article } from "@/entities/article";
import { formatDateLong } from "@/shared/lib/format-date";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Статья для заголовка, краткого описания и даты публикации. */
interface ArticleHeadingProps {
  article: Article;
}

/** Показывает заголовок статьи, первые три тега и дату публикации. */
export function ArticleHeading({ article }: ArticleHeadingProps) {
  const dateLabel = formatDateLong(article.published_at);

  return (
    <header className={styles.head}>
      <Title
        text={article.title}
        as="h1"
        className={styles.title}
      />
      {article.excerpt && (
        <Subtitle
          text={article.excerpt}
          className={styles.subtitle}
        />
      )}
      <div className={styles.meta}>
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className={styles.tag}
          >
            {tag}
          </span>
        ))}
        {dateLabel && (
          <time dateTime={article.published_at || undefined}>
            {dateLabel}
          </time>
        )}
      </div>
    </header>
  );
}
