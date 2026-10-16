/** Смещение московского времени от UTC в миллисекундах. */
const MOSCOW_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Дополняет компонент даты до двух цифр. */
function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

/** Представляет московские дату и время в локальных полях календаря. */
export function parseCalendarValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

  if (value.includes("T") && hasTimezone) {
    const instant = new Date(value);

    if (Number.isNaN(instant.getTime())) {
      return null;
    }

    const moscow = new Date(instant.getTime() + MOSCOW_OFFSET_MS);

    return new Date(
      moscow.getUTCFullYear(),
      moscow.getUTCMonth(),
      moscow.getUTCDate(),
      moscow.getUTCHours(),
      moscow.getUTCMinutes(),
    );
  }

  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

/** Готовит дату для API, указывая московский часовой пояс при наличии времени. */
export function formatCalendarValue(date: Date, withTime: boolean): string {
  const day = [
    date.getFullYear(),
    twoDigits(date.getMonth() + 1),
    twoDigits(date.getDate()),
  ].join("-");

  if (!withTime) {
    return day;
  }

  return `${day}T${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}:00+03:00`;
}

/** Форматирует выбранную дату для ручного ввода. */
export function formatManualDate(date: Date, withTime: boolean): string {
  const day = [
    twoDigits(date.getDate()),
    twoDigits(date.getMonth() + 1),
    date.getFullYear(),
  ].join(".");

  return withTime
    ? `${day} ${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`
    : day;
}

/** Проверяет полный ручной ввод, включая существование даты в календаре. */
export function parseManualDate(value: string, withTime: boolean): Date | null {
  const match = value
    .trim()
    .match(
      withTime
        ? /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/
        : /^(\d{2})\.(\d{2})\.(\d{4})$/,
    );

  if (!match) {
    return null;
  }

  const [, day, month, year, hour = "12", minute = "00"] = match;
  const date = new Date(+year, +month - 1, +day, +hour, +minute);
  const isValid =
    date.getFullYear() === +year &&
    date.getMonth() === +month - 1 &&
    date.getDate() === +day &&
    date.getHours() === +hour &&
    date.getMinutes() === +minute;

  return isValid ? date : null;
}

/** Расставляет разделители в набранных цифрах даты и времени. */
export function maskManualDate(value: string, withTime: boolean): string {
  const digits = value.replace(/\D/g, "").slice(0, withTime ? 12 : 8);
  const date = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join(".");

  if (!withTime || digits.length <= 8) {
    return date;
  }

  const time = [digits.slice(8, 10), digits.slice(10, 12)].filter(Boolean).join(":");

  return `${date} ${time}`;
}

/** Отображает дату на кнопке календаря в привычном русском формате. */
export function formatCalendarLabel(date: Date, withTime: boolean): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (withTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleString("ru-RU", options);
}
