import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./LaborListingsSkeleton.module.scss";

export function LaborListingsSkeleton() {
  return (
    <div className={s.list} aria-hidden="true">
      {Array.from({ length: 2 }, (_, index) => (
        <article key={index} className={s.card}>
          <div className={s.header}>
            <div className={s.heading}>
              <Skeleton className={s.title} rounded="pill" />
              <Skeleton className={s.kind} rounded="pill" />
            </div>
            <Skeleton className={s.region} rounded="pill" />
          </div>

          <div className={s.certificates}>
            <Skeleton className={s.certificate} rounded="pill" />
            <Skeleton className={s.certificateShort} rounded="pill" />
            <Skeleton className={s.certificate} rounded="pill" />
          </div>

          <div className={s.meta}>
            {Array.from({ length: 3 }, (_, metaIndex) => (
              <div key={metaIndex} className={s.metaItem}>
                <Skeleton className={s.metaLabel} rounded="pill" />
                <Skeleton className={s.metaValue} rounded="pill" />
              </div>
            ))}
          </div>

          <Skeleton className={s.action} rounded="md" />
        </article>
      ))}
    </div>
  );
}
