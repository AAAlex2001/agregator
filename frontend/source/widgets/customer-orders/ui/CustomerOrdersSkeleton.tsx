import { OrderCardSkeleton } from "@/source/entities/order";
import layout from "./CustomerOrdersWidget.module.scss";

export function CustomerOrdersSkeleton() {
  return (
    <>
      <div className={layout.skeletonSpacer} aria-hidden="true" />
      <div className={layout.container} aria-hidden="true">
        <div className={layout.shadeL} />
        <div className={layout.shadeR} />
        <div className={layout.grid}>
          {Array.from({ length: 10 }, (_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
