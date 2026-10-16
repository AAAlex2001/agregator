/** Формат даты уведомления: «12.10.2026». */
const DAY_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Формат времени уведомления: «14:05». */
const TIME_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

/** Время уведомления: «Сегодня, 14:05» или «12.10.2026, 14:05». */
export function formatNotificationTime(value: string): string {
  const date = new Date(value);
  const day = DAY_FORMAT.format(date);
  const isToday = day === DAY_FORMAT.format(new Date());

  return `${isToday ? "Сегодня" : day}, ${TIME_FORMAT.format(date)}`;
}
