import { ResponseCardSkeleton } from "@/source/entities/response";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ResponsesSkeleton.module.scss";

interface ResponsesSkeletonProps {
  compact?: boolean;
}

export function ResponsesSkeleton({ compact = false }: ResponsesSkeletonProps) {
  const cardsSection = (
    <div className={s.cardsSection}>
      <div className={s.shadeLeft} />
      <div className={s.shadeRight} />

      <div className={s.cardsTrack}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={s.slide}>
            <div className={`${s.slideInner} ${index === 1 ? s.slideActive : ""}`}>
              <ResponseCardSkeleton />
            </div>
          </div>
        ))}
      </div>

      <div className={s.pagination}>
        <Skeleton className={s.navButton} rounded="md" />
        <div className={s.pages}>
          <Skeleton className={s.pageActive} rounded="md" />
          <Skeleton className={s.page} rounded="md" />
          <Skeleton className={s.page} rounded="md" />
        </div>
        <Skeleton className={s.navButton} rounded="md" />
      </div>
    </div>
  );

  if (compact) {
    return <div aria-hidden="true">{cardsSection}</div>;
  }

  return (
    <div className={s.wrapper} aria-hidden="true">
      <div className={s.pageHead}>
        <Skeleton className={s.title} />
        <Skeleton className={s.subtitle} rounded="pill" />
      </div>

      <div className={s.tabs}>
        <Skeleton className={s.tabPrimary} rounded="pill" />
        <Skeleton className={s.tabSecondary} rounded="pill" />
        <Skeleton className={s.tabTertiary} rounded="pill" />
      </div>

      {cardsSection}
    </div>
  );
}