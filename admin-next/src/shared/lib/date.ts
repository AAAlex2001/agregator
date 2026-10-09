const TIME_ZONE = "Europe/Moscow";

const DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const format = (formatter: Intl.DateTimeFormat, value: string | null | undefined): string => {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : formatter.format(date);
};

/** Дата в виде «09.10.2026». */
export const formatDate = (value: string | null | undefined) => format(DATE_FORMAT, value);

/** Дата и время в виде «09.10.2026, 14:05». */
export const formatDateTime = (value: string | null | undefined) => format(DATE_TIME_FORMAT, value);
