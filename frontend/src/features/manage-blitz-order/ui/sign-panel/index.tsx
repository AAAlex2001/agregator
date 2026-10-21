"use client";

import { useState } from "react";
import {
  blitzPaperUrl,
  blitzPriceLabel,
  blitzWording,
  postBlitzAction,
} from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { CancelButton } from "../cancel-button";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Заказчик читает договор и соглашение о конфиденциальности и подписывает их. */
export function SignPanel({ order, onChange }: BlitzStepProps) {
  const [isAgreed, setIsAgreed] = useState(false);
  const { isPending, run } = useBlitzAction(onChange);
  const wording = blitzWording(order.service);

  /** Подписывает договор. */
  function sign() {
    void run(
      () => postBlitzAction(order.id, "sign", {}, "Не удалось подписать договор"),
      "Договор подписан. Оплатите аванс",
    );
  }

  return (
    <StepNote
      title={`${wording.executor} готов — подпишите договор`}
      text={`${order.expert_name ?? wording.executor} проведёт ${wording.work} `
        + `за ${blitzPriceLabel(order.price)}. `
        + "Проверьте документы: после подписи можно оплатить аванс 50 %."}
    >
      <div className={styles.papers}>
        <a
          className={styles.paper}
          href={blitzPaperUrl(order.id, "contract")}
        >
          Проект договора (Word)
        </a>
        <a
          className={styles.paper}
          href={blitzPaperUrl(order.id, "nda")}
        >
          Соглашение о конфиденциальности (Word)
        </a>
      </div>
      <Checkbox
        id={`blitz-sign-${order.id}`}
        checked={isAgreed}
        onChange={setIsAgreed}
      >
        Я прочитал договор и соглашение и согласен с ними.
        Нажатие «Подписать» — юридически значимое действие
      </Checkbox>
      <div className={styles.actions}>
        <Button
          size="field"
          isLoading={isPending}
          disabled={!isAgreed}
          onClick={sign}
        >
          Подписать
        </Button>
        <CancelButton
          order={order}
          onChange={onChange}
        />
      </div>
    </StepNote>
  );
}
