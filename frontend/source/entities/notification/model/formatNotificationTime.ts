const TIME = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });
const DAY = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

/** «Сегодня, 14:05» или «12.10.2026, 14:05». */
export function formatNotificationTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = DAY.format(date) === DAY.format(new Date()) ? "Сегодня" : DAY.format(date);
  return `${day}, ${TIME.format(date)}`;
}
