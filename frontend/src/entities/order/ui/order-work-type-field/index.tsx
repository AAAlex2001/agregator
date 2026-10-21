"use client";

import { FormSection } from "@/shared/ui/form-section";
import { RadioGroup } from "@/shared/ui/radio-group";
import { ORDER_WORK_OPTIONS } from "../../config/work-types";
import { useOrderForm } from "../../model/order-form-provider";

/** Направления, выбранные заказчиком в своём профиле. */
interface OrderWorkTypeFieldProps {
  directions: string[];
}

/** Предлагает виды работ только из направлений заказчика. */
export function OrderWorkTypeField({ directions }: OrderWorkTypeFieldProps) {
  const { values, dispatch } = useOrderForm();
  const options = ORDER_WORK_OPTIONS.filter((option) => directions.includes(option.value));

  /** Меняет направление заказа и его дополнительные условия. */
  function changeDirection(value: string) {
    const option = options.find((item) => item.value === value);

    if (option) {
      dispatch({ type: "direction/changed", workType: option.value });
    }
  }

  return (
    <FormSection
      title="Вид работ"
      hint="Список — по направлениям из вашего профиля. От вида работ зависят следующие шаги"
    >
      <RadioGroup
        name="order-work-type"
        value={values.workType}
        options={options}
        onChange={changeDirection}
      />
    </FormSection>
  );
}
