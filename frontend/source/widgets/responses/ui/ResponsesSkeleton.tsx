import { ResponseCardSkeleton } from "@/source/entities/response";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ResponsesSkeleton.module.scss";

interface ResponsesSkeletonProps {
  compact?: boolean;
  hideTabs?: boolean;
}

export function ResponsesSkeleton({ compact = false, hideTabs = false }: ResponsesSkeletonProps) {
  const list = (
    <div className={s.list}>
      {Array.from({ length: 3 }, (_, index) => (
        <ResponseCardSkeleton key={index} />
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className={s.compact} aria-hidden="true">
        {!hideTabs && (
          <div className={s.tabs}>
            <Skeleton className={s.tabPrimary} rounded="pill" />
            <Skeleton className={s.tabSecondary} rounded="pill" />
            <Skeleton className={s.tabTertiary} rounded="pill" />
          </div>
        )}
        {list}
      </div>
    );
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
      {list}
    </div>
  );
}
