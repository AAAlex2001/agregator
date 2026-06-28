"use client";

import { useEffect, useState } from "react";
import { YANDEX_MAPS_API_KEY } from "@/source/shared/api/config";
import type { Ymaps } from "./types";

export type YandexMapsStatus = "no-key" | "loading" | "ready" | "error";

let loadPromise: Promise<Ymaps> | null = null;

function loadYandexMaps(): Promise<Ymaps> {
  const existing = window.ymaps;
  if (existing) {
    return new Promise((resolve) => existing.ready(() => resolve(existing)));
  }
  if (!loadPromise) {
    loadPromise = new Promise<Ymaps>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        const api = window.ymaps;
        if (api) api.ready(() => resolve(api));
        else reject(new Error("Яндекс.Карты не инициализировались"));
      };
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("Не удалось загрузить Яндекс.Карты"));
      };
      document.head.appendChild(script);
    });
  }
  return loadPromise;
}

export function useYandexMaps(): { ymaps: Ymaps | null; status: YandexMapsStatus } {
  const [ymaps, setYmaps] = useState<Ymaps | null>(null);
  const [status, setStatus] = useState<YandexMapsStatus>(YANDEX_MAPS_API_KEY ? "loading" : "no-key");

  useEffect(() => {
    if (!YANDEX_MAPS_API_KEY) return;
    let active = true;
    loadYandexMaps()
      .then((api) => {
        if (!active) return;
        setYmaps(api);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  return { ymaps, status };
}
