import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ReviewCardSkeleton.module.scss";

export function ReviewCardSkeleton() {
  return (
    <article className={s.card}>
      <Skeleton className={s.customer} />
      <Skeleton className={s.order} />

      <div className={s.ratingDate}>
        <div className={s.stars}>
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className={s.star} rounded="sm" />
          ))}
        </div>

        <Skeleton className={s.date} rounded="pill" />
      </div>

      <div className={s.commentBlock}>
        <div className={s.commentText}>
          <Skeleton className={s.line} />
          <Skeleton className={s.lineWide} />
          <Skeleton className={s.lineShort} />
        </div>
      </div>
    </article>
  );
}