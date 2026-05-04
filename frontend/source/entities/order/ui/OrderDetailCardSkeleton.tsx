import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./OrderDetailCardSkeleton.module.scss";

interface Props {
  showQuestions?: boolean;
  showActions?: boolean;
}

export function OrderDetailCardSkeleton({ showQuestions = false, showActions = true }: Props) {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.statusRow}>
        <Skeleton className={s.statusBadge} rounded="md" />
      </div>

      <div className={s.titleRow}>
        <Skeleton className={s.title} rounded="md" />
        <Skeleton className={s.chevron} rounded="pill" />
      </div>

      <div className={s.fileRow}>
        <Skeleton className={s.fileLabel} rounded="md" />
        <div className={s.files}>
          <Skeleton className={s.file} rounded="md" />
          <Skeleton className={s.file} rounded="md" />
          <Skeleton className={s.file} rounded="md" />
        </div>
      </div>

      {showQuestions && (
        <div className={s.questions}>
          <Skeleton className={s.qTitle} rounded="md" />
          <div className={s.qCard}>
            <div className={s.qHead}>
              <Skeleton className={s.avatar} rounded="pill" />
              <div className={s.qHeadText}>
                <Skeleton className={s.qName} rounded="md" />
                <Skeleton className={s.qDate} rounded="md" />
              </div>
            </div>
            <Skeleton className={s.qLine} rounded="md" />
            <Skeleton className={s.qLineShort} rounded="md" />
          </div>
        </div>
      )}

      {showActions && (
        <div className={s.actions}>
          <Skeleton className={s.actionPrimary} rounded="pill" />
          <Skeleton className={s.actionSecondary} rounded="pill" />
        </div>
      )}
    </article>
  );
}
