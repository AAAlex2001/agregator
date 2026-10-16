"use client";

import { useEffect, useState } from "react";
import { loadYandexMaps, YANDEX_MAPS_API_KEY } from "./load-yandex-maps";
import type { YandexMapsState } from "./types";

/** Подключает SDK карты и перестаёт обновлять состояние после ухода со страницы. */
export function useYandexMaps() {
  const [state, setState] = useState<YandexMapsState>({
    api: null,
    status: YANDEX_MAPS_API_KEY ? "loading" : "no-key",
  });

  useEffect(() => {
    if (!YANDEX_MAPS_API_KEY) {
      return;
    }

    let isMounted = true;

    loadYandexMaps()
      .then((api) => {
        if (isMounted) {
          setState({ api, status: "ready" });
        }
      })
      .catch(() => {
        if (isMounted) {
          setState({ api: null, status: "error" });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
