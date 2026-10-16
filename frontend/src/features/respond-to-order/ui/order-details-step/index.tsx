import type { ReactNode } from "react";
import {
  isResponsesClosed,
  OrderBrief,
  OrderDocumentsGallery,
} from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Условия выбранного заказа, обсуждение и переход к заполнению отклика. */
interface OrderDetailsStepProps {
  order: OrderListItem;
  questions: ReactNode;
  onRespond: () => void;
}

/** Показывает заказ и разрешает отклик до окончания приёма предложений. */
export function OrderDetailsStep({
  order,
  questions,
  onRespond,
}: OrderDetailsStepProps) {
  const isExpired = isResponsesClosed(order.responses_deadline);

  return (
    <div className={styles.step}>
      <OrderBrief order={order} />
      <OrderDocumentsGallery documents={order.documents} />
      {questions}

      <div className={styles.actions}>
        {isExpired && (
          <span className={styles.expiredHint}>
            На заказ больше нельзя откликнуться
          </span>
        )}

        <Button
          variant="primary"
          size="md"
          fullWidth
          showArrow
          disabled={isExpired}
          onClick={onRespond}
        >
          Откликнуться
        </Button>
      </div>
    </div>
  );
}
