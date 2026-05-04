import { OrderDetailCardSkeleton } from "@/source/entities/order";
import layout from "./CustomerOrdersWidget.module.scss";

export function CustomerOrdersSkeleton() {
  return (
    <div className={layout.container} aria-hidden="true">
      <div className={layout.shadeL} />
      <div className={layout.shadeR} />
      <div className={layout.grid}>
        {Array.from({ length: 2 }, (_, index) => (
          <OrderDetailCardSkeleton key={index} showQuestions />
        ))}
      </div>
    </div>
  );
}
