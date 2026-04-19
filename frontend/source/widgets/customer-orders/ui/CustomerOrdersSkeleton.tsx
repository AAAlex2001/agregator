import { OrderCardSkeleton } from "@/source/entities/order";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./CustomerOrdersSkeleton.module.scss";

export function CustomerOrdersSkeleton() {
  return (
    <div className={s.wrapper} aria-hidden="true">
      <div className={s.pageHead}>
        <Skeleton className={s.title} />
        <Skeleton className={s.subtitle} rounded="pill" />
      </div>

      <Skeleton className={s.createBtn} rounded="lg" />

      <div className={s.container}>
        <div className={s.shadeL} />
        <div className={s.shadeR} />
        <div className={s.grid}>
          {Array.from({ length: 4 }, (_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}