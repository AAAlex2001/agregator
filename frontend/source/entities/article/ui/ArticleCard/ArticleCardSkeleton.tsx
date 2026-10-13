import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ArticleCardSkeleton.module.scss";

/** Заглушка карточки статьи той же формы, что и ArticleCard. */
export function ArticleCardSkeleton() {
  return (
    <div className={s.card} aria-hidden="true">
      <div className={s.body}>
        <Skeleton className={s.cover} rounded="md" />
        <div className={s.info}>
          <Skeleton className={s.title} rounded="md" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.lineShort} rounded="md" />
        </div>
      </div>
      <div className={s.footer}>
        <Skeleton className={s.date} rounded="pill" />
        <Skeleton className={s.read} rounded="pill" />
      </div>
    </div>
  );
}
