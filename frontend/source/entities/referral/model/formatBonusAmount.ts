const rublesFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Преобразует сумму в копейках в строку с рублями. */
export function formatBonusAmount(kopecks: number): string {
  return rublesFormatter.format(kopecks / 100);
}
