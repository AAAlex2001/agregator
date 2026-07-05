import { Card, Skeleton } from "@/shared/ui";
import s from "./style.module.scss";

export function ExpertCardSkeleton() {
  return (
    <Card className={s.card}>
      <div className={s.head}>
        <Skeleton className={s.avatar} />
        <div className={s.identity}>
          <Skeleton className={s.name} />
          <Skeleton className={s.joined} />
        </div>
        <Skeleton className={s.ring} />
      </div>

      <div className={s.info}>
        <div className={s.row}>
          <Skeleton className={s.label} />
          <Skeleton className={s.value} />
        </div>
        <div className={s.row}>
          <Skeleton className={s.label} />
          <Skeleton className={s.value} />
        </div>
      </div>
    </Card>
  );
}
