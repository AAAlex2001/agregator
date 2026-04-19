import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ResponseCardSkeleton.module.scss";

export function ResponseCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.content}>
        <div className={s.statusRow}>
          <div className={s.statusMeta}>
            <Skeleton className={s.dateLabel} rounded="pill" />
            <Skeleton className={s.dateValue} rounded="pill" />
          </div>
          <Skeleton className={s.statusBadge} rounded="pill" />
        </div>

        <div className={s.expertBlock}>
          <Skeleton className={s.expertName} />
          <Skeleton className={s.expertMeta} rounded="pill" />
        </div>

        <div className={s.orderBlock}>
          <Skeleton className={s.orderTitle} />
          <Skeleton className={s.orderTitleShort} />

          <div className={s.badges}>
            <Skeleton className={s.badge} rounded="pill" />
            <Skeleton className={s.badgeShort} rounded="pill" />
          </div>

          <div className={s.terms}>
            <div className={s.termRow}>
              <Skeleton className={s.termLabel} rounded="pill" />
              <Skeleton className={s.termValue} rounded="pill" />
            </div>
            <div className={s.termRow}>
              <Skeleton className={s.termLabelShort} rounded="pill" />
              <Skeleton className={s.termValueWide} rounded="pill" />
            </div>
          </div>
        </div>

        <div className={s.infoBlock}>
          <Skeleton className={s.infoTitle} rounded="pill" />
          <Skeleton className={s.infoLine} />
          <Skeleton className={s.infoLineWide} />
        </div>

        <div className={s.infoBlock}>
          <Skeleton className={s.infoTitleShort} rounded="pill" />
          <Skeleton className={s.infoLine} />
          <Skeleton className={s.infoLineShort} />
        </div>
      </div>

      <div className={s.actions}>
        <Skeleton className={s.actionPrimary} rounded="pill" />
        <Skeleton className={s.actionSecondary} rounded="pill" />
      </div>
    </article>
  );
}