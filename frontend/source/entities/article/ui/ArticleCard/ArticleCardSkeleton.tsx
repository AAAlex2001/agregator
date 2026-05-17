import Skeleton from "@/source/shared/ui/Skeleton";
import styles from "./ArticleCard.module.scss";
import s from "./ArticleCardSkeleton.module.scss";

export function ArticleCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true" aria-busy="true">
      <div className={styles.body}>
        <Skeleton className={s.cover} rounded="md" />
        <div className={styles.info}>
          <Skeleton className={s.title} rounded="md" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.lineShort} rounded="md" />
        </div>
      </div>
      <div className={styles.footer}>
        <Skeleton className={s.date} rounded="pill" />
        <Skeleton className={s.read} rounded="pill" />
      </div>
    </div>
  );
}
