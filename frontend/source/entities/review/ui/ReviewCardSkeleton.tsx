import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ReviewCardSkeleton.module.scss";

export function ReviewCardSkeleton() {
  return (
    <article className={s.card}>
      <div className={s.header}>
        <Skeleton className={s.headerLabel} />
        <Skeleton className={s.headerValue} />
      </div>

      <div className={s.dropdown}>
        <div className={s.orderSection}>
          <div className={s.detailRow}>
            <Skeleton className={s.detailLabel} />
            <Skeleton className={s.detailValue} />
          </div>

          <div className={s.detailRow}>
            <Skeleton className={s.detailLabel} />
            <Skeleton className={s.badges} />
          </div>

          <div className={s.termsRow}>
            <div className={s.termItem}>
              <Skeleton className={s.termLabel} />
              <Skeleton className={s.termValue} />
            </div>

            <div className={s.termCost}>
              <Skeleton className={s.termWideLabel} />
              <Skeleton className={s.termValue} />
            </div>
          </div>
        </div>

        <div className={s.info}>
          <div className={s.termsRow}>
            <div className={s.termItem}>
              <Skeleton className={s.termWideLabel} />
              <Skeleton className={s.termValue} />
            </div>

            <div className={s.termCost}>
              <Skeleton className={s.termWideLabel} />
              <Skeleton className={s.termValue} />
            </div>
          </div>

          <Skeleton className={s.filesLabel} />
        </div>
      </div>

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