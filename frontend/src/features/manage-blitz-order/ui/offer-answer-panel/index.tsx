"use client";

import { useState } from "react";
import { isNegotiable, parseBlitzPrice, postBlitzAction } from "@/entities/blitz-order";
import type { BlitzOfferAnswer } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { CancelButton } from "../cancel-button";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Что сообщить после ответа. */
const ANSWER_SUCCESS = {
  accept: "Цена принята. Подпишите договор",
  counter: "Ваша цена отправлена аудитору",
  decline: "Заявка вернулась в общий список",
};

/** Заказчик принимает цену аудитора, предлагает свою ниже или отказывается. */
export function OfferAnswerPanel({ order, onChange }: BlitzStepProps) {
  const [price, setPrice] = useState("");
  const { isPending, run } = useBlitzAction(onChange);
  const negotiable = isNegotiable(order);
  const offer = order.offer_price ?? 0;
  const counter = parseBlitzPrice(price);

  /** Отправляет ответ на предложение. */
  function answer(choice: BlitzOfferAnswer) {
    void run(
      () => postBlitzAction(
        order.id,
        "offer/answer",
        { answer: choice, price: choice === "counter" ? counter : null },
        "Не удалось ответить на цену",
      ),
      ANSWER_SUCCESS[choice],
    );
  }

  return (
    <StepNote
      title={`Аудитор предлагает ${formatRub(offer)}`}
      text={negotiable
        ? "Примите цену, предложите свою ниже или откажитесь — заявка вернётся в общий список."
        : "Вы указали, что бюджет фиксирован: примите цену или откажитесь."}
    >
      <div className={styles.actions}>
        <Button
          size="field"
          isLoading={isPending}
          onClick={() => answer("accept")}
        >
          Принять {formatRub(offer)}
        </Button>
        <Button
          size="field"
          variant="outline"
          disabled={isPending}
          onClick={() => answer("decline")}
        >
          Отказаться
        </Button>
        <CancelButton
          order={order}
          onChange={onChange}
        />
      </div>
      {negotiable && (
        <div className={styles.offer}>
          <Field
            label="Своя цена, ₽"
            hint="Ниже предложенной аудитором и не меньше 100 000 ₽"
          >
            <TextInput
              value={price}
              inputMode="decimal"
              placeholder="Например, 280 000"
              onChange={(event) => setPrice(event.target.value)}
            />
          </Field>
          <div className={styles.actions}>
            <Button
              size="field"
              variant="outline"
              isLoading={isPending}
              disabled={!(counter > 0 && counter < offer)}
              onClick={() => answer("counter")}
            >
              Предложить свою цену
            </Button>
          </div>
        </div>
      )}
    </StepNote>
  );
}