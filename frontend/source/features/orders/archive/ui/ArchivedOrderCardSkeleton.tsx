import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ArchivedOrderCardSkeleton.module.scss";

export function ArchivedOrderCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.body}>
        <div className={s.left}>
          <div className={s.headRow}>
            <Skeleton className={s.meta} rounded="pill" />
            <Skeleton className={s.statusBadge} rounded="pill" />
          </div>
          <div className={s.titleBlock}>
            <Skeleton className={s.titleLabel} rounded="pill" />
            <Skeleton className={s.title} rounded="md" />
            <Skeleton className={s.titleShort} rounded="md" />
          </div>
          <Skeleton className={s.badges} rounded="pill" />
          <div className={s.bottomLeft}>
            <Skeleton className={s.label} rounded="pill" />
            <Skeleton className={s.value} rounded="pill" />
          </div>
        </div>
        <div className={s.right}>
          {[1, 2, 3, 4].map((key) => (
            <div key={key} className={s.rightItem}>
              <Skeleton className={s.label} rounded="pill" />
              <Skeleton className={s.value} rounded="pill" />
            </div>
          ))}
        </div>
      </div>
      <div className={s.details}>
        <div className={s.detailsSection}>
          <Skeleton className={s.sectionTitle} rounded="pill" />
          <Skeleton className={s.commentLine} rounded="md" />
          <Skeleton className={s.commentLineShort} rounded="md" />
        </div>
      </div>
    </article>
  );
}
