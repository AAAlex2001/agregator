import { OrderCardSkeleton } from "@/source/entities/order";
import layout from "./CustomerOrdersWidget.module.scss";

export function CustomerOrdersSkeleton() {
  return (
    <div className={layout.list} aria-hidden="true">
      {Array.from({ length: 2 }, (_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
}
