/** Уровень риска для цвета отметки: низкий, средний или высокий. */
export type LiningRiskTone = "low" | "medium" | "high";

/** Срок службы в годах, при котором шкала срока заполнена полностью. */
const FULL_SCALE_YEARS = 20;

/** Определяет цвет отметки по началу лингвистической категории сервера. */
export function getLiningRiskTone(category: string): LiningRiskTone {
  if (category.startsWith("Низк") || category.startsWith("Умерен")) {
    return "low";
  }

  if (category.startsWith("Средн") || category.startsWith("Значит")) {
    return "medium";
  }

  return "high";
}

/** Убирает из категории хвост « уровень …» для компактной отметки. */
export function getShortLiningCategory(category: string): string {
  return category.split(" уровень")[0];
}

/** Доля заполнения шкалы срока службы: 20 лет и больше заполняют её целиком. */
export function getServiceLifeFraction(years: number): number {
  return Math.min(years / FULL_SCALE_YEARS, 1);
}
