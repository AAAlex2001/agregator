import { DIRECTIONS } from "@/entities/direction";

/** Направления писем о новых заказах; требования экспертизы выбираются отдельно. */
export const NOTIFICATION_DIRECTIONS = DIRECTIONS.filter(
  (direction) => direction.value !== "EXPERTISE",
);

/** Коды направлений, которые можно сохранить в фильтре уведомлений. */
const NOTIFICATION_DIRECTION_CODES: string[] = NOTIFICATION_DIRECTIONS.map(
  (direction) => direction.value,
);

/** Проверяет, относится ли значение фильтра к доступным направлениям. */
export function isNotificationDirection(code: string): boolean {
  return NOTIFICATION_DIRECTION_CODES.includes(code);
}
