"use client";

import { postBlitzAction } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import { Button } from "@/shared/ui/button";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Руководитель группы принимает цену заказчика или отказывается от заявки. */
export function CounterAnswerPanel({ order, onChange }: BlitzStepProps) {
  const { isPending, run } = useBlitzAction(onChange);
  const counter = order.counter_price ?? 0;

  /** Отправляет ответ на цену заказчика. */
  function answer(accept: boolean) {
    void run(
      () => postBlitzAction(order.id, "counter/answer", { accept }, "Не удалось ответить на цену"),
      accept ? "Цена принята: ждём подписи договора" : "Вы отказались от заявки",
    );
  }

  return (
    <StepNote
      title={`Заказчик предлагает ${formatRub(counter)}`}
      text={`Вместо вашей цены ${formatRub(order.offer_price ?? 0)}. `
        + "Если откажетесь, заявка вернётся в общий список."}
    >
      <div className={styles.actions}>
        <Button
          isLoading={isPending}
          onClick={() => answer(true)}
        >
          Согласен на {formatRub(counter)}
        </Button>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => answer(false)}
        >
          Отказаться от заявки
        </Button>
      </div>
    </StepNote>
  );
}