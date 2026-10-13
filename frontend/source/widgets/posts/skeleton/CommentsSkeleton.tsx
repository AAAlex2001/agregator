import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./skeleton.module.scss";

/** Повторяет аватар, имя и текст комментария. */
function CommentSkeleton() {
  return (
    <div className={s.comment}>
      <Skeleton
        className={s.commentAvatar}
        rounded="pill"
      />
      <div className={s.text}>
        <Skeleton className={s.name} />
        <Skeleton className={s.line} />
        <Skeleton className={s.shortLine} />
      </div>
    </div>
  );
}

/** Показывает место двух комментариев во время загрузки обсуждения. */
export function CommentsSkeleton() {
  return (
    <div
      className={s.list}
      role="status"
      aria-label="Загружаются комментарии"
      aria-busy="true"
    >
      <CommentSkeleton />
      <CommentSkeleton />
    </div>
  );
}
