import { ArticleCardSkeleton } from "@/source/entities/article";
import Skeleton from "@/source/shared/ui/Skeleton";
import styles from "./ArticlesList.module.scss";
import s from "./ArticlesListSkeleton.module.scss";

interface Props {
  count?: number;
}

export function ArticlesListSkeleton({ count = 6 }: Props) {
  return (
    <div className={styles.wrapper} aria-busy="true">
      <div className={styles.head}>
        <Skeleton className={s.title} rounded="md" />
        <Skeleton className={s.subtitle} rounded="md" />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: count }).map((_, idx) => (
          <ArticleCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
