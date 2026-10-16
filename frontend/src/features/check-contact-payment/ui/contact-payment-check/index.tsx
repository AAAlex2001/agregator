"use client";

import { Button } from "@/shared/ui/button";
import { TextInput } from "@/shared/ui/text-input";
import { useCheckContactPayment } from "../../model/use-check-contact-payment";
import styles from "./style.module.scss";

/** Сделка, оплату по которой проверяет исполнитель. */
interface ContactPaymentCheckProps {
  dealId: number;
}

/** Даёт исполнителю подтвердить оплату или отклонить чек с причиной. */
export function ContactPaymentCheck({ dealId }: ContactPaymentCheckProps) {
  const check = useCheckContactPayment(dealId);

  return (
    <section
      className={styles.check}
      aria-label="Проверка оплаты"
    >
      <Button
        variant="green"
        size="sm"
        onClick={check.confirm}
        isLoading={check.isSubmitting}
      >
        Подтвердить оплату и открыть контакты
      </Button>
      <TextInput
        value={check.reason}
        onChange={(event) => check.changeReason(event.target.value)}
        placeholder="Причина отклонения чека"
        aria-label="Причина отклонения чека"
      />
      <Button
        variant="danger"
        size="sm"
        onClick={check.reject}
        disabled={!check.canReject || check.isSubmitting}
      >
        Отклонить чек
      </Button>
    </section>
  );
}
