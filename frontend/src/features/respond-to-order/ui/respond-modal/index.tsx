"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { OrderListItem } from "@/entities/order";
import { Modal } from "@/shared/ui/modal";
import type { RespondCallbacks } from "../../model/types";
import { useRespondForm } from "../../model/use-respond-form";
import { OrderDetailsStep } from "../order-details-step";
import { RespondWizard } from "../respond-wizard";
import styles from "./style.module.scss";

/** Выбранный заказ, обсуждение и переходы по результату отклика. */
interface RespondModalProps extends RespondCallbacks {
  order: OrderListItem;
  questions: ReactNode;
  onClose: () => void;
}

/** Сначала заказ и обсуждение, по «Откликнуться» — отклик по шагам; черновик живёт с окном. */
export function RespondModal({
  order,
  questions,
  onClose,
  onResponded,
  onSubscriptionRequired,
}: RespondModalProps) {
  const [isResponding, setIsResponding] = useState(false);
  const form = useRespondForm(order, { onResponded, onSubscriptionRequired });

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      isBusy={form.isSubmitting}
      dialogClassName={styles.dialog}
    >
      {isResponding ? (
        <RespondWizard
          order={order}
          form={form}
          onCancel={() => setIsResponding(false)}
        />
      ) : (
        <OrderDetailsStep
          order={order}
          questions={questions}
          onRespond={() => setIsResponding(true)}
        />
      )}
    </Modal>
  );
}