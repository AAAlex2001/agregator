export function formatDateRu(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateRuOrEmpty(input: string | Date | null | undefined): string {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatChatListTime(input: string | Date | null | undefined): string {
  if (!input) return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday
    ? date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export function formatRelative(input: string | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (sameDay) {
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function formatWithTime(input: string | Date): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function formatMoscowDateTime(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseMoscowWallClock(value: string): Date | null {
  if (!value) return null;
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  if (value.includes("T") && hasTimezone) {
    const instant = new Date(value);
    if (Number.isNaN(instant.getTime())) return null;
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Moscow",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(instant);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((item) => item.type === type)?.value);
    return new Date(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
  }
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);
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
