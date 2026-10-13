"use client";

import { hasOrderDetails, isResponsesClosed, OrderCard, OrderDetails, type OrderCardData } from "@/source/entities/order";
import { copyOrderLink } from "@/source/shared/lib/copyOrderLink";
import Button from "@/source/shared/ui/Button";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ExpertOrderCard.module.scss";

interface ExpertOrderCardProps {
  order: OrderCardData;
  onOpen: () => void;
}

/** Заказ в ленте исполнителя: поделиться ссылкой или открыть и откликнуться. */
export function ExpertOrderCard({ order, onOpen }: ExpertOrderCardProps) {
  const { showSuccess } = useNotifications();

  return (
    <OrderCard
      order={order}
      onClick={onOpen}
      details={hasOrderDetails(order) ? <OrderDetails order={order} /> : undefined}
      actions={
        <div className={s.actions}>
          <Button
            variant="outline"
            size="sm"
            className={s.button}
            onClick={(event) => {
              event.stopPropagation();
              copyOrderLink(order.publicId).then(() => showSuccess("Ссылка скопирована"));
            }}
          >
            Поделиться
          </Button>
          <Button
            variant="primary"
            size="sm"
            className={s.button}
            disabled={isResponsesClosed(order)}
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
          >
            Откликнуться
          </Button>
        </div>
      }
    />
  );
}
