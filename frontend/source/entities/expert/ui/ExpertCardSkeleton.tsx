import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ExpertCardSkeleton.module.scss";

export function ExpertCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.body}>
        <div className={s.left}>
          <div className={s.header}>
            <Skeleton className={s.avatar} rounded="pill" />
            <div className={s.headerText}>
              <Skeleton className={s.name} rounded="pill" />
              <Skeleton className={s.joined} rounded="pill" />
            </div>
          </div>

          <div className={s.stats}>
            <div className={s.statRow}>
              <Skeleton className={s.statLabel} rounded="pill" />
              <Skeleton className={s.statValue} rounded="pill" />
            </div>
            <div className={s.statRow}>
              <Skeleton className={s.statLabel} rounded="pill" />
              <Skeleton className={s.statValue} rounded="pill" />
            </div>
            <div className={s.statRow}>
              <Skeleton className={s.statLabel} rounded="pill" />
              <Skeleton className={s.statValue} rounded="pill" />
            </div>
          </div>

          <Skeleton className={s.button} rounded="md" />
        </div>

        <div className={s.center}>
          <Skeleton className={s.centerLabel} rounded="pill" />
          <Skeleton className={s.meta} rounded="pill" />
          <div className={s.field}>
            <Skeleton className={s.fieldLabel} rounded="pill" />
            <Skeleton className={s.title} rounded="pill" />
          </div>
          <div className={s.field}>
            <Skeleton className={s.fieldLabel} rounded="pill" />
            <Skeleton className={s.fieldValue} rounded="pill" />
          </div>
        </div>

        <div className={s.side}>
          <div className={s.field}>
            <Skeleton className={s.fieldLabel} rounded="pill" />
            <Skeleton className={s.fieldAccent} rounded="pill" />
          </div>
          <div className={s.field}>
            <Skeleton className={s.fieldLabel} rounded="pill" />
            <Skeleton className={s.fieldValue} rounded="pill" />
          </div>
          <div className={s.field}>
            <Skeleton className={s.fieldLabel} rounded="pill" />
            <Skeleton className={s.fieldValue} rounded="pill" />
          </div>
          <div className={s.field}>
            <Skeleton className={s.fieldLabel} rounded="pill" />
            <Skeleton className={s.fieldValue} rounded="pill" />
          </div>
        </div>
      </div>
    </article>
  );
}
