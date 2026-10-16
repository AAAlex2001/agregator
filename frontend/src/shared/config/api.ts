/** Адрес API для запросов из браузера без завершающей косой черты. */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "/api"
).replace(/\/$/, "");
