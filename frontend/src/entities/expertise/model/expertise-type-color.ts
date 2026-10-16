import type { BadgeColor } from "@/shared/ui/badge";

/** Определяет цвет известного объекта экспертизы для подписей и карточек заказа. */
export function getExpertiseTypeColor(type: string): BadgeColor | null {
  if (type === "КЛ" || type === "ТП" || type === "КЛ/ТП") {
    return "blue";
  }

  if (type === "ТУ") {
    return "orange";
  }

  if (type === "ЗС") {
    return "green";
  }

  if (type === "Д") {
    return "brown";
  }

  if (type === "ОБ") {
    return "gray";
  }

  return null;
}
