import type { OrderDirection } from "./order-direction";
import type { OrderFormValues } from "./order-form-types";

/** Соединяет направление и его условия, согласованные редьюсером формы. */
export function getOrderFormDirection(values: OrderFormValues): OrderDirection {
  return {
    work_type: values.workType,
    details: values.details,
  } as OrderDirection;
}
