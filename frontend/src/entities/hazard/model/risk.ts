/** Уровень риска для цвета отметки: низкий, средний или высокий. */
export type HazardRiskTone = "low" | "medium" | "high";

/** Определяет цвет отметки по началу лингвистической категории сервера. */
export function getHazardRiskTone(category: string): HazardRiskTone {
  if (category.startsWith("Низк") || category.startsWith("Умерен")) {
    return "low";
  }

  if (category.startsWith("Средн") || category.startsWith("Значит")) {
    return "medium";
  }

  return "high";
}

/** Убирает из категории хвост « уровень …» для компактной отметки. */
export function getShortHazardCategory(category: string): string {
  return category.split(" уровень")[0];
}
