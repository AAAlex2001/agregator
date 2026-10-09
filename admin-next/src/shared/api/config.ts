/** Префикс адресов админки: она живёт в подпапке сайта. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Адрес API админки для запросов из браузера. Запросы проксируются на бэкенд сервером Next. */
export const API_URL = `${BASE_PATH}/api`;

/** Адрес публичного сайта — для ссылок на опубликованные страницы. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://plus-resurs.com";
