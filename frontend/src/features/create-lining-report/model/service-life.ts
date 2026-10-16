/** Оставляет во вводе срока эксплуатации только цифры, точку и запятую. */
export function cleanServiceLife(value: string): string {
  return value.replace(/[^\d.,]/g, "");
}

/** Переводит введённый срок в годы; пустой или неразборчивый ввод даёт 0. */
export function toServiceLifeYears(value: string): number {
  return Number(value.replace(",", ".")) || 0;
}
