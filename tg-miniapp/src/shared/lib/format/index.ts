export function toKopecks(value: string): number {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}

export function formatRub(kopecks: number): string {
  const rub = Math.round(kopecks / 100);
  return `${String(rub).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

export function formatDateRu(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function moscowParts(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
    hour: part("hour"),
    minute: part("minute"),
  };
}

export function formatMoscowDateTime(iso: string): string {
  const parts = moscowParts(iso);
  if (!parts) return "";
  return `${parts.day}.${parts.month}.${parts.year}, ${parts.hour}:${parts.minute}`;
}

export function toMoscowDateTimeInput(iso: string): string {
  const parts = moscowParts(iso);
  if (!parts) return "";
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:00+03:00`;
}

export function parseMoscowWallClock(value: string): Date | null {
  if (!value) return null;
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  if (value.includes("T") && hasTimezone) {
    const parts = moscowParts(value);
    return parts
      ? new Date(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute)
      : null;
  }
  const date = new Date(value.includes("T") ? value : `${value}T12:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatMoscowApiValue(date: Date, withTime: boolean): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return withTime
    ? `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}:00+03:00`
    : day;
}

export function formatManualDateValue(date: Date, withTime: boolean): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const day = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
  return withTime ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}` : day;
}

export function parseManualDateValue(value: string, withTime: boolean): Date | null {
  const match = value.trim().match(
    withTime
      ? /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/
      : /^(\d{2})\.(\d{2})\.(\d{4})$/,
  );
  if (!match) return null;
  const [, day, month, year, hour = "12", minute = "00"] = match;
  const date = new Date(+year, +month - 1, +day, +hour, +minute);
  const valid =
    date.getFullYear() === +year &&
    date.getMonth() === +month - 1 &&
    date.getDate() === +day &&
    date.getHours() === +hour &&
    date.getMinutes() === +minute;
  return valid ? date : null;
}

export function maskManualDateValue(value: string, withTime: boolean): string {
  const digits = value.replace(/\D/g, "").slice(0, withTime ? 12 : 8);
  const date = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join(".");
  if (!withTime || digits.length <= 8) return date;
  const timeDigits = digits.slice(8);
  const time = [timeDigits.slice(0, 2), timeDigits.slice(2, 4)]
    .filter(Boolean)
    .join(":");
  return `${date} ${time}`;
}

export function parseDateRu(display: string): string {
  const [day, month, year] = display.split(".");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function formatDeadline(iso: string): string {
  const parts = moscowParts(iso);
  if (!parts) return "";
  return `${parts.day}.${parts.month}, ${parts.hour}:${parts.minute} МСК`;
}

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function formatClock(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDayRu(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  const year = d.getFullYear() === now.getFullYear() ? "" : ` ${d.getFullYear()}`;
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]}${year}`;
}

export function formatChatStamp(iso: string): string {
  const day = formatDayRu(iso);
  return day === "Сегодня" ? formatClock(iso) : day;
}
