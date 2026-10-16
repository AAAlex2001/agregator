/** Значение справочника и его подпись в условиях заказа. */
export interface OrderDetailOption {
  value: string;
  label: string;
}

/** Подставляет подписи справочника, сохраняя неизвестные значения старых заказов. */
export function describeOrderOptions(
  values: string[],
  options: OrderDetailOption[],
): string {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}
