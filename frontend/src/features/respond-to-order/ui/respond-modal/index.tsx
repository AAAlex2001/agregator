"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { OrderListItem } from "@/entities/order";
import { Modal } from "@/shared/ui/modal";
import type { RespondCallbacks, RespondStep } from "../../model/types";
import { useRespondForm } from "../../model/use-respond-form";
import { ConfirmationStep } from "../confirmation-step";
import { OfferStep } from "../offer-step";
import { OrderDetailsStep } from "../order-details-step";
import styles from "./style.module.scss";

/** Выбранный заказ, обсуждение и переходы по результату отклика. */
interface RespondModalProps extends RespondCallbacks {
  order: OrderListItem;
  questions: ReactNode;
  onClose: () => void;
}

/** Проводит исполнителя от просмотра заказа до отправки предложения. */
export function RespondModal({
  order,
  questions,
  onClose,
  onResponded,
  onSubscriptionRequired,
}: RespondModalProps) {
  const [step, setStep] = useState<RespondStep>("details");
  const form = useRespondForm(order, { onResponded, onSubscriptionRequired });

  /** Возвращает просмотр условий заказа. */
  function showOrderDetails() {
    setStep("details");
  }

  /** Открывает подтверждение условий перед заполнением предложения. */
  function showConfirmation() {
    setStep("confirmation");
  }

  /** Открывает поля предложения, сохраняя уже введённые данные. */
  function showOffer() {
    setStep("offer");
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      isBusy={form.isSubmitting}
      dialogClassName={styles.dialog}
    >
      {step === "details" && (
        <OrderDetailsStep
          order={order}
          questions={questions}
          onRespond={showConfirmation}
        />
      )}

      {step === "confirmation" && (
        <ConfirmationStep
          order={order}
          onBack={showOrderDetails}
          onContinue={showOffer}
        />
      )}

      {step === "offer" && (
        <OfferStep
          order={order}
          form={form}
          onBack={showConfirmation}
        />
      )}
    </Modal>
  );
}
