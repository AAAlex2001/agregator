import { ArticleCardSkeleton } from "@/source/entities/article";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ArticlesListSkeleton.module.scss";

/** Заглушка страницы списка статей, пока сервер отдаёт первую страницу. */
export function ArticlesListSkeleton() {
  return (
    <div className={s.wrapper} aria-busy="true">
      <div className={s.head}>
        <Skeleton className={s.title} rounded="md" />
        <Skeleton className={s.subtitle} rounded="md" />
      </div>
      <div className={s.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((key) => (
          <ArticleCardSkeleton key={key} />
        ))}
      </div>
    </div>
  );
}
