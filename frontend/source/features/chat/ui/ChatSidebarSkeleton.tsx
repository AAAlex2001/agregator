import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ChatSidebarSkeleton.module.scss";

export function ChatSidebarSkeleton() {
  return (
    <div className={s.list} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className={s.item}>
          <Skeleton className={s.avatar} rounded="pill" />
          <div className={s.meta}>
            <Skeleton className={s.name} />
            <Skeleton className={s.preview} rounded="pill" />
          </div>
          <Skeleton className={s.time} rounded="pill" />
        </div>
      ))}
    </div>
  );
}