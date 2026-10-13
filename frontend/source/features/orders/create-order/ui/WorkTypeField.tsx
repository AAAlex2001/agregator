"use client";

import cn from "classnames";
import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import type { OrderFormProps } from "../model/types";
import { FormSection } from "./FormSection";
import s from "./WorkTypeField.module.scss";

/** Вид работ — только из направлений, отмеченных заказчиком в профиле. */
export function WorkTypeField({ state, dispatch }: OrderFormProps) {
  const { user } = useSession();
  const options = ORDER_WORK_OPTIONS.filter((option) => user?.directions.includes(option.value));

  return (
    <FormSection label={<span className={s.title}>Вид работ</span>}>
      <div className={s.options}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(s.option, { [s.optionActive]: state.workType === option.value })}
            onClick={() => dispatch({ type: "workType", value: option.value })}
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
    </FormSection>
  );
}
