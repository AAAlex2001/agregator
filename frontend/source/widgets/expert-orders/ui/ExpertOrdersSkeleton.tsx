import { OrderCardSkeleton } from "@/source/entities/order";
import layout from "./ExpertOrdersWidget.module.scss";

export function ExpertOrdersSkeleton() {
  return (
    <div className={layout.container} aria-hidden="true">
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
  );
}