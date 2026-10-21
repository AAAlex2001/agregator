import type { MouseEvent } from "react";
import {
  hasOrderDetails,
  isResponsesClosed,
  OrderCard,
  OrderDetails,
} from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { ShareOrderButton } from "@/features/share-order";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Заказ из ленты исполнителя, переход на его страницу и сразу к отклику. */
interface ExpertOrderCardProps {
  order: OrderListItem;
  onOpen: (orderId: number) => void;
  onRespond: (orderId: number) => void;
}

/** Собирает карточку с публичной ссылкой и переходом к отклику. */
export function ExpertOrderCard({ order, onOpen, onRespond }: ExpertOrderCardProps) {
  /** Открывает страницу заказа. */
  function openOrder() {
    onOpen(order.id);
  }

  /** Открывает отклик, не повторяя нажатие на родительскую карточку. */
  function respond(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onRespond(order.id);
  }

  return (
    <OrderCard
      order={order}
      onClick={openOrder}
      details={hasOrderDetails(order) ? (
        <OrderDetails order={order} />
      ) : undefined}
      actions={
        <div className={styles.actions}>
          <ShareOrderButton publicId={order.public_id} />
          <Button
            variant="primary"
            size="sm"
            className={styles.button}
            disabled={isResponsesClosed(order.responses_deadline)}
            onClick={respond}
          >
            Откликнуться
          </Button>
        </div>
      }
    />
  );
}
