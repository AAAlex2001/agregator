import { OrderCardSkeleton } from "@/source/entities/order";
import Skeleton from "@/source/shared/ui/Skeleton";
import layout from "./ExpertOrdersWidget.module.scss";
import s from "./ExpertOrdersSkeleton.module.scss";

export function ExpertOrdersSkeleton() {
  return (
    <div className={layout.wrapper} aria-hidden="true">
      <div className={layout.pageHead}>
        <div className={layout.titleRow}>
          <Skeleton className={s.title} />
          <Skeleton className={s.hint} rounded="pill" />
        </div>
        <Skeleton className={s.subtitle} rounded="pill" />
      </div>

      <div className={layout.container}>
        <div className={layout.shadeL} />
        <div className={layout.shadeR} />
        <div className={layout.grid}>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className={layout.item}>
              <OrderCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}