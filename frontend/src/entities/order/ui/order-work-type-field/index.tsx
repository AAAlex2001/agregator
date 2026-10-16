"use client";

import { ORDER_WORK_OPTIONS } from "../../config/work-types";
import { useOrderForm } from "../../model/order-form-provider";
import type { OrderListItem } from "../../model/order-list-item";
import { OrderFormSection } from "../order-form-section";
import { OrderWorkOption } from "../order-work-option";
import styles from "./style.module.scss";

/** Направления, выбранные заказчиком в своём профиле. */
interface OrderWorkTypeFieldProps {
  directions: string[];
}

/** Предлагает виды работ только из направлений заказчика. */
export function OrderWorkTypeField({ directions }: OrderWorkTypeFieldProps) {
  const { values, dispatch } = useOrderForm();
  const options = ORDER_WORK_OPTIONS.filter((option) => (
    directions.includes(option.value)
  ));

  /** Меняет направление заказа и его дополнительные условия. */
  function changeDirection(workType: OrderListItem["work_type"]) {
    dispatch({
      type: "direction/changed",
      workType,
    });
  }

  return (
    <OrderFormSection label={<span className={styles.title}>Вид работ</span>}>
      <div className={styles.options}>
        {options.map((option) => (
          <OrderWorkOption
            key={option.value}
            option={option}
            isSelected={values.workType === option.value}
            onSelect={changeDirection}
          />
        ))}
      </div>
    </OrderFormSection>
  );
}
