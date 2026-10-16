import type { YandexMapsApi } from "./types";

/** Ключ браузерного SDK, заданный в окружении приложения. */
export const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "";

/** Общая загрузка SDK, которую ждут все карты страницы. */
let loadingMaps: Promise<YandexMapsApi> | null = null;

/** Читает API, который внешний скрипт публикует в window. */
function getLoadedApi(): YandexMapsApi | undefined {
  return Reflect.get(window, "ymaps") as YandexMapsApi | undefined;
}

/** Загружает SDK один раз для всех карт и допускает повтор после сетевой ошибки. */
export function loadYandexMaps(): Promise<YandexMapsApi> {
  const existingApi = getLoadedApi();

  if (existingApi) {
    return new Promise((resolve) => {
      existingApi.ready(() => resolve(existingApi));
    });
  }

  if (loadingMaps) {
    return loadingMaps;
  }

  loadingMaps = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const apiKey = encodeURIComponent(YANDEX_MAPS_API_KEY);
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;

    script.onload = () => {
      const api = getLoadedApi();

      if (api) {
        api.ready(() => resolve(api));
      } else {
        script.remove();
        reject(new Error("Яндекс.Карты не инициализировались"));
      }
    };

    script.onerror = () => {
      script.remove();
      reject(new Error("Не удалось загрузить Яндекс.Карты"));
    };

    document.head.appendChild(script);
  });

  loadingMaps.catch(() => {
    loadingMaps = null;
  });

  return loadingMaps;
}
