import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./RtnQuestionCard.module.scss";

export function RtnQuestionCardSkeleton() {
  return (
    <div className={s.card}>
      <div className={s.main}>
        <Skeleton className={s.skeletonDate} rounded="pill" />
        <Skeleton className={s.skeletonText} rounded="md" />
        <Skeleton className={s.skeletonTextShort} rounded="md" />
      </div>
      <Skeleton className={s.skeletonStatus} rounded="md" />
    </div>
  );
}
