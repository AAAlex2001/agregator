/** Сумма в рублях с пробелами между разрядами: «150 000 ₽», копейки — только если они есть. */
export function formatRub(value: number): string {
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₽`;
}
