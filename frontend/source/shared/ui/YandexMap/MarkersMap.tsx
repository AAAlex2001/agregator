"use client";

import { useEffect, useRef } from "react";
import Loader from "@/source/shared/ui/Loader";
import { useYandexMaps } from "./useYandexMaps";
import type { MapMarker, YmapsMap } from "./types";
import s from "./YandexMap.module.scss";

interface Props {
  markers: MapMarker[];
  height?: number | string;
  emptyText?: string;
}

const RUSSIA_CENTER: [number, number] = [61.524, 105.3188];

function balloonRow(label: string, value: string): string {
  return `<div style="margin-top:4px"><b>${label}:</b> ${value}</div>`;
}

function balloonBody(marker: MapMarker): string {
  const parts: string[] = [];
  if (marker.city) parts.push(marker.city);
  if (marker.rating != null) parts.push(`Рейтинг ${marker.rating.toFixed(1)}`);
  if (marker.travelsToOtherRegions) parts.push("Выезжает в другие регионы");

  const head = parts.join("<br>");
  const rows: string[] = [];
  if (marker.certificates?.length) {
    rows.push(balloonRow("Удостоверения", marker.certificates.join("<br>")));
  }
  if (marker.phone) rows.push(balloonRow("Телефон", marker.phone));
  if (marker.email) rows.push(balloonRow("Email", marker.email));

  return [head, ...rows].filter(Boolean).join("");
}

export function YandexMarkersMap({ markers, height = 420, emptyText }: Props) {
  const { ymaps, status } = useYandexMaps();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YmapsMap | null>(null);

  useEffect(() => {
    if (!ymaps || !mapEl.current) return;
    const map = new ymaps.Map(
      mapEl.current,
      { center: RUSSIA_CENTER, zoom: 3, controls: ["zoomControl"] },
      { suppressMapOpenBlock: true },
    );
    mapRef.current = map;
    return () => {
      map.destroy();
      mapRef.current = null;
    };
  }, [ymaps]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ymaps || !map) return;
    map.geoObjects.removeAll();
    if (markers.length === 0) return;
    const clusterer = new ymaps.Clusterer({
      preset: "islands#orangeClusterIcons",
      groupByCoordinates: false,
    });
    clusterer.add(
      markers.map(
        (marker) =>
          new ymaps.Placemark(
            [marker.lat, marker.lng],
            {
              balloonContentHeader: marker.title,
              balloonContentBody: balloonBody(marker),
              hintContent: marker.title,
            },
            { preset: "islands#orangeIcon" },
          ),
      ),
    );
    map.geoObjects.add(clusterer);
  }, [ymaps, markers]);

  return (
    <div className={s.mapBox} style={{ height }}>
      <div ref={mapEl} className={s.mapRoot} />
      {status !== "ready" && (
        <div className={s.overlay}>
          {status === "loading" && <Loader size="md" />}
          {status === "error" && <span className={s.note}>Карта временно недоступна</span>}
          {status === "no-key" && (
            <span className={s.note}>Карта станет доступна после подключения ключа</span>
          )}
        </div>
      )}
      {status === "ready" && markers.length === 0 && emptyText && (
        <div className={s.overlay}>
          <span className={s.note}>{emptyText}</span>
        </div>
      )}
    </div>
  );
}
