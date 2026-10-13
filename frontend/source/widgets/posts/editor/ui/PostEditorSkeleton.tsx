import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./PostEditor.module.scss";

/** Повторяет расположение полей загружаемой формы. */
export function PostEditorSkeleton() {
  return (
    <div
      className={s.skeleton}
      role="status"
      aria-label="Загрузка формы публикации"
    >
      <div className={s.skeletonAuthor}>
        <Skeleton className={s.skeletonAvatar} rounded="pill" />
        <Skeleton className={s.skeletonName} />
      </div>
      <Skeleton className={s.skeletonToolbar} />
      <Skeleton className={s.skeletonText} />
      <Skeleton className={s.skeletonButton} />
      <div className={s.skeletonActions}>
        <Skeleton className={s.skeletonButton} />
        <Skeleton className={s.skeletonButton} />
      </div>
    </div>
  );
}
