import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./PublicReviewsSkeleton.module.scss";

export function PublicReviewsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={s.list} aria-busy="true">
      {Array.from({ length: count }).map((_, idx) => (
        <article key={idx} className={s.card} aria-hidden="true">
          <Skeleton className={s.meta} rounded="pill" />
          <Skeleton className={s.title} rounded="md" />
          <div className={s.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className={s.star} rounded="sm" />
            ))}
          </div>
          <Skeleton className={s.commentLine} rounded="md" />
          <Skeleton className={s.commentLineShort} rounded="md" />
          <Skeleton className={s.bottomLine} rounded="pill" />
        </article>
      ))}
    </div>
  );
}
