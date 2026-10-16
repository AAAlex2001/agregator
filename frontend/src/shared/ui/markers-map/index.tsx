"use client";

import { useEffect, useRef } from "react";
import { escapeHtml } from "@/shared/lib/escape-html";
import { useYandexMaps } from "@/shared/lib/yandex-maps";
import type { YandexMap } from "@/shared/lib/yandex-maps";
import { Loader } from "@/shared/ui/loader";
import type { MapMarker, MarkersMapProps } from "./model/types";
import styles from "./style.module.scss";

/** Показывает метки на карте России и объединяет соседние точки в кластеры. */
export function MarkersMap({
  markers,
  height = 420,
  emptyText,
}: MarkersMapProps) {
  const { api, status } = useYandexMaps();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YandexMap | null>(null);

  useEffect(() => {
    if (!api || !mapElement.current) {
      return;
    }

    const map = new api.Map(
      mapElement.current,
      {
        center: [61.524, 105.3188],
        zoom: 3,
        controls: ["zoomControl"],
      },
      { suppressMapOpenBlock: true },
    );

    mapRef.current = map;

    return () => {
      map.destroy();
      mapRef.current = null;
    };
  }, [api]);

  useEffect(() => {
    const map = mapRef.current;

    if (!api || !map) {
      return;
    }

    map.geoObjects.removeAll();

    if (markers.length === 0) {
      return;
    }

    const mapsApi = api;
    const clusterer = new mapsApi.Clusterer({
      preset: "islands#orangeClusterIcons",
      groupByCoordinates: false,
    });

    /** Создаёт метку с безопасным текстовым заголовком и готовой карточкой. */
    function createPlacemark(marker: MapMarker) {
      const title = escapeHtml(marker.title);

      return new mapsApi.Placemark(
        marker.coordinates,
        {
          balloonContentHeader: title,
          balloonContentBody: marker.body,
          hintContent: title,
        },
        { preset: "islands#orangeIcon" },
      );
    }

    clusterer.add(markers.map(createPlacemark));
    map.geoObjects.add(clusterer);
  }, [api, markers]);

  return (
    <div
      className={styles.mapBox}
      style={{ height }}
    >
      <div
        ref={mapElement}
        className={styles.mapRoot}
      />

      {status !== "ready" && (
        <div className={styles.overlay}>
          {status === "loading" && <Loader size="md" />}

          {status === "error" && (
            <span className={styles.note}>Карта временно недоступна</span>
          )}

          {status === "no-key" && (
            <span className={styles.note}>
              Карта станет доступна после подключения ключа
            </span>
          )}
        </div>
      )}

      {status === "ready" && markers.length === 0 && emptyText && (
        <div className={styles.overlay}>
          <span className={styles.note}>{emptyText}</span>
        </div>
      )}
    </div>
  );
}

export type { MapMarker } from "./model/types";
