import { OrderCardSkeleton } from "@/source/entities/order";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ExpertOrdersSkeleton.module.scss";

export function ExpertOrdersSkeleton() {
  return (
    <div className={s.wrapper} aria-hidden="true">
      <div className={s.pageHead}>
        <Skeleton className={s.title} />
        <Skeleton className={s.subtitle} rounded="pill" />
      </div>

      <div className={s.container}>
        <div className={s.shadeL} />
        <div className={s.shadeR} />
        <div className={s.grid}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={s.item}>
              <OrderCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}