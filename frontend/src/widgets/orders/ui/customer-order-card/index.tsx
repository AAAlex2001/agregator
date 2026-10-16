import {
  hasOrderDetails,
  OrderCard,
  OrderDetails,
} from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { DeleteOrderButton } from "@/features/delete-order";
import { Button } from "@/shared/ui/button";
import { OrderQuestions } from "../order-questions";
import styles from "./style.module.scss";

/** Заказ заказчика и открытие его редактора. */
interface CustomerOrderCardProps {
  order: OrderListItem;
  onEdit: (order: OrderListItem) => void;
}

/** Собирает условия заказа, редактирование, удаление и вопросы исполнителей. */
export function CustomerOrderCard({
  order,
  onEdit,
}: CustomerOrderCardProps) {
  /** Передаёт выбранный заказ в редактор страницы. */
  function editOrder() {
    onEdit(order);
  }

  return (
    <OrderCard
      order={order}
      actions={
        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            onClick={editOrder}
          >
            Редактировать
          </Button>
          <DeleteOrderButton orderId={order.id} />
        </div>
      }
      details={hasOrderDetails(order) ? (
        <OrderDetails order={order} />
      ) : undefined}
      footer={
        <OrderQuestions
          orderId={order.id}
          customerId={order.customer_id}
          canAsk={false}
        />
      }
    />
  );
}
