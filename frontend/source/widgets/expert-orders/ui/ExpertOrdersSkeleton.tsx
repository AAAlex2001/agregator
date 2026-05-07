import { OrderCardSkeleton } from "@/source/entities/order";
import layout from "./ExpertOrdersWidget.module.scss";

export function ExpertOrdersSkeleton() {
  return (
    <div className={layout.list} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
}
