import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ReviewCardSkeleton.module.scss";

export function ReviewCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.body}>
        <div className={s.left}>
          <Skeleton className={s.meta} rounded="pill" />
          <Skeleton className={s.title} rounded="md" />
          <Skeleton className={s.titleShort} rounded="md" />
          <div className={s.stars}>
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className={s.star} rounded="sm" />
            ))}
          </div>
          <Skeleton className={s.commentLine} rounded="md" />
          <Skeleton className={s.commentLineShort} rounded="md" />
          <div className={s.bottomLeft}>
            <Skeleton className={s.label} rounded="pill" />
            <Skeleton className={s.value} rounded="pill" />
          </div>
        </div>
        <div className={s.right}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={s.rightItem}>
              <Skeleton className={s.label} rounded="pill" />
              <Skeleton className={s.value} rounded="pill" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
