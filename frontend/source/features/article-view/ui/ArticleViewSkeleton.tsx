import Skeleton from "@/source/shared/ui/Skeleton";
import { ArticleCardSkeleton } from "@/source/entities/article";
import styles from "./ArticleView.module.scss";
import s from "./ArticleViewSkeleton.module.scss";

export function ArticleViewSkeleton() {
  return (
    <article className={styles.wrapper} aria-busy="true">
      <Skeleton className={s.breadcrumbs} rounded="md" />

      <div className={styles.head}>
        <Skeleton className={s.title} rounded="md" />
        <Skeleton className={s.subtitle} rounded="md" />
      </div>

      <div className={styles.layout}>
        <div className={styles.body}>
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.lineShort} rounded="md" />
          <Skeleton className={s.cover} rounded="lg" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.lineShort} rounded="md" />
        </div>
        <Skeleton className={s.toc} rounded="lg" />
      </div>

      <div className={s.related}>
        <Skeleton className={s.relatedTitle} rounded="md" />
        <div className={s.relatedGrid}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <ArticleCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </article>
  );
}
