"use client";

import { useEffect, useRef, useState } from "react";
import Loader from "@/source/shared/ui/Loader";
import { fetchGeoReverse, fetchGeoSuggest, type GeoPoint } from "@/source/shared/api/geo";
import { useYandexMaps } from "./useYandexMaps";
import type { SelectedLocation, YmapsMap } from "./types";
import s from "./YandexMap.module.scss";

interface Props {
  value: SelectedLocation | null;
  onChange: (value: SelectedLocation) => void;
  height?: number;
  placeholder?: string;
}

const RUSSIA_CENTER: [number, number] = [55.751244, 37.618423];
const SUGGEST_DELAY = 350;

export function YandexAddressPicker({
  value,
  onChange,
  height = 320,
  placeholder = "Введите адрес",
}: Props) {
  const { ymaps, status } = useYandexMaps();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YmapsMap | null>(null);
  const drawRef = useRef<(location: SelectedLocation) => void>(() => {});
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const initialValueRef = useRef(value);

  const [query, setQuery] = useState(value?.address ?? "");
  const [results, setResults] = useState<GeoPoint[]>([]);
  const [open, setOpen] = useState(false);

  const apply = (location: SelectedLocation) => {
    drawRef.current(location);
    setQuery(location.address);
    setResults([]);
    setOpen(false);
    onChangeRef.current(location);
  };
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    if (!ymaps || !mapEl.current) return;
    const initial = initialValueRef.current;
    const center: [number, number] = initial ? [initial.lat, initial.lng] : RUSSIA_CENTER;
    const map = new ymaps.Map(
      mapEl.current,
      { center, zoom: initial ? 12 : 4, controls: ["zoomControl"] },
      { suppressMapOpenBlock: true },
    );
    mapRef.current = map;

    drawRef.current = (location) => {
      map.geoObjects.removeAll();
      const placemark = new ymaps.Placemark(
        [location.lat, location.lng],
        {},
        { preset: "islands#orangeDotIcon", draggable: true },
      );
      placemark.events.add("dragend", () => {
        const [lat, lng] = placemark.geometry.getCoordinates();
        fetchGeoReverse(lat, lng).then((point) => {
          if (point) applyRef.current(point);
        });
      });
      map.geoObjects.add(placemark);
      map.setCenter([location.lat, location.lng], 12);
    };

    if (initial) drawRef.current(initial);

    map.events.add("click", (event) => {
      const coords = event.get("coords") as [number, number];
      fetchGeoReverse(coords[0], coords[1]).then((point) => {
        if (point) applyRef.current(point);
      });
    });

    return () => {
      map.destroy();
      mapRef.current = null;
      drawRef.current = () => {};
    };
  }, [ymaps]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    let active = true;
    const timer = setTimeout(() => {
      fetchGeoSuggest(query.trim()).then((items) => {
        if (active) setResults(items);
      });
    }, SUGGEST_DELAY);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className={s.picker}>
      <div className={s.searchBox}>
        <input
          className={s.search}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(results.length > 0)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          autoComplete="off"
        />
        {open && results.length > 0 && (
          <ul className={s.suggestions}>
            {results.map((item, index) => (
              <li key={`${item.lat}-${item.lng}-${index}`}>
                <button type="button" className={s.suggestion} onClick={() => apply(item)}>
                  {item.address}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
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
      </div>
    </div>
  );
}
