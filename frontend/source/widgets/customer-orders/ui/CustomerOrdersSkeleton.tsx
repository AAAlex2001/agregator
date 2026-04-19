import { OrderCardSkeleton } from "@/source/entities/order";
import Skeleton from "@/source/shared/ui/Skeleton";
import layout from "./CustomerOrdersWidget.module.scss";
import s from "./CustomerOrdersSkeleton.module.scss";

export function CustomerOrdersSkeleton() {
  return (
    <div className={layout.wrapper} aria-hidden="true">
      <div className={layout.pageHead}>
        <div className={layout.titleRow}>
          <Skeleton className={s.title} />
          <Skeleton className={s.hint} rounded="pill" />
        </div>
        <Skeleton className={s.subtitle} rounded="pill" />
      </div>

      <Skeleton className={`${layout.createBtn} ${s.createBtn}`.trim()} rounded="lg" />

      <div className={layout.container}>
        <div className={layout.shadeL} />
        <div className={layout.shadeR} />
        <div className={layout.grid}>
          {Array.from({ length: 8 }, (_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}