import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./QuestionsSkeleton.module.scss";

export function QuestionsSkeleton() {
  return (
    <ul className={s.list} aria-hidden="true">
      {[0, 1].map((i) => (
        <li key={i} className={s.card}>
          <div className={s.head}>
            <Skeleton className={s.avatar} rounded="pill" />
            <div className={s.headText}>
              <Skeleton className={s.name} rounded="md" />
              <Skeleton className={s.date} rounded="md" />
            </div>
          </div>
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.lineShort} rounded="md" />
        </li>
      ))}
    </ul>
  );
}
