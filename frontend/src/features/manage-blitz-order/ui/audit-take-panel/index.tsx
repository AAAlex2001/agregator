"use client";

import { useState } from "react";
import { isNegotiable, parseBlitzPrice, postBlitzAction } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Что видит руководитель группы в новой заявке на аудит. */
function takeText(price: number | null, canPropose: boolean): string {
  if (price === null) {
    return "Заказчик не указал бюджет: посмотрите анкету и документы и предложите свою цену.";
  }

  const offer = canPropose ? " или предложите свою" : "";

  return `Заказчик предлагает ${formatRub(price)}. Посмотрите анкету и документы: `
    + `возьмите заявку по этой цене${offer}. Заявку получит тот, кто ответит первым.`;
}

/** Руководитель группы берёт аудит по цене заказчика или предлагает свою. */
export function AuditTakePanel({ order, onChange }: BlitzStepProps) {
  const [price, setPrice] = useState("");
  const { isPending, run } = useBlitzAction(onChange);
  const canPropose = order.price === null || isNegotiable(order);

  /** Берёт заявку по цене заказчика. */
  function accept() {
    void run(
      () => postBlitzAction(order.id, "accept", { contract_kind: null }, "Не удалось взять заявку"),
      "Заявка ваша: ждём подписи договора",
    );
  }

  /** Предлагает свою цену. */
  function propose() {
    void run(
      () => postBlitzAction(
        order.id,
        "offer",
        { price: parseBlitzPrice(price) },
        "Не удалось предложить цену",
      ),
      "Цена отправлена заказчику",
    );
  }

  return (
    <StepNote
      title="Возьмёте аудит?"
      text={takeText(order.price, canPropose)}
    >
      {order.price !== null && (
        <div className={styles.actions}>
          <Button
            size="field"
            isLoading={isPending}
            onClick={accept}
          >
            Готов провести за {formatRub(order.price)}
          </Button>
        </div>
      )}
      {canPropose && (
        <div className={styles.offer}>
          <Field
            label="Ваша цена за аудит, ₽"
            hint="Не меньше 100 000 ₽"
          >
            <TextInput
              value={price}
              inputMode="decimal"
              placeholder="Например, 350 000"
              onChange={(event) => setPrice(event.target.value)}
            />
          </Field>
          <div className={styles.actions}>
            <Button
              size="field"
              variant="outline"
              isLoading={isPending}
              disabled={!(parseBlitzPrice(price) > 0)}
              onClick={propose}
            >
              Предложить цену
            </Button>
          </div>
        </div>
      )}
    </StepNote>
  );
}