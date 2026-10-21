"use client";

import { useState } from "react";
import { createBlitzPayment, postBlitzAction } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { useNotifications } from "@/shared/ui/notifications";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import styles from "./style.module.scss";

/** Физлицо платит картой на странице ЮKassa и возвращается в заявку. */
export function CardPayment({ order, onChange }: BlitzStepProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isPending, run } = useBlitzAction(onChange);
  const { showError } = useNotifications();

  /** Переходит на страницу оплаты. */
  async function pay() {
    setIsRedirecting(true);

    try {
      window.location.assign(await createBlitzPayment(order.id));
    } catch (error) {
      setIsRedirecting(false);
      showError(error instanceof Error ? error.message : "Не удалось перейти к оплате");
    }
  }

  /** Спрашивает ЮKassa, прошла ли оплата. */
  function check() {
    void run(() => postBlitzAction(order.id, "payment/refresh", {}, "Не удалось проверить оплату"));
  }

  return (
    <div className={styles.actions}>
      <Button
        isLoading={isRedirecting}
        onClick={() => void pay()}
      >
        Оплатить картой
      </Button>
      <Button
        variant="outline"
        isLoading={isPending}
        onClick={check}
      >
        Я оплатил — проверить
      </Button>
    </div>
  );
}
