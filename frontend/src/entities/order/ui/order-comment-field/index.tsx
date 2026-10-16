"use client";

import type { ChangeEvent } from "react";
import { useOrderForm } from "../../model/order-form-provider";
import { OrderFormSection } from "../order-form-section";
import styles from "./style.module.scss";

/** Добавляет свободное пояснение заказчика к условиям работ. */
export function OrderCommentField() {
  const { values, dispatch } = useOrderForm();

  /** Обновляет текст комментария в черновике заказа. */
  function changeComment(event: ChangeEvent<HTMLTextAreaElement>) {
    dispatch({
      type: "field/changed",
      field: "comment",
      value: event.target.value,
    });
  }

  return (
    <OrderFormSection label="Комментарий к заказу">
      <textarea
        className={styles.textarea}
        placeholder="Опишите детали заказа..."
        value={values.comment}
        onChange={changeComment}
      />
    </OrderFormSection>
  );
}
