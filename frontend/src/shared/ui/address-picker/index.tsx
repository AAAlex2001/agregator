"use client";

import { useEffect, useRef, useState } from "react";
import { useYandexMaps } from "@/shared/lib/yandex-maps";
import type { YandexMap } from "@/shared/lib/yandex-maps";
import { Loader } from "@/shared/ui/loader";
import { getAddressByCoordinates } from "./api/get-address-by-coordinates";
import { getAddressSuggestions } from "./api/get-address-suggestions";
import { getMapCoordinates } from "./model/get-map-coordinates";
import type { SelectedLocation } from "./model/types";
import styles from "./style.module.scss";

/** Поле выбранного адреса; onChange получает подтверждённую точку с координатами. */
interface YandexAddressPickerProps {
  value: SelectedLocation | null;
  onChange: (value: SelectedLocation) => void;
  height?: number;
  placeholder?: string;
}

/** Результат поиска хранится вместе с запросом, чтобы не показывать старые адреса. */
interface AddressSuggestions {
  query: string;
  items: SelectedLocation[];
}

/** Выбор адреса из подсказок, нажатием на карту или перетаскиванием метки. */
export function YandexAddressPicker({
  value,
  onChange,
  height = 320,
  placeholder = "Введите адрес",
}: YandexAddressPickerProps) {
  const { api, status } = useYandexMaps();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YandexMap | null>(null);
  const initialLocation = useRef(value);
  const onChangeRef = useRef(onChange);
  const [location, setLocation] = useState(value);
  const [query, setQuery] = useState(value?.address ?? "");
  const [suggestions, setSuggestions] = useState<AddressSuggestions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const results = suggestions?.query === query ? suggestions.items : [];

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!api || !mapElement.current) {
      return;
    }

    let isMounted = true;
    const initial = initialLocation.current;
    const map = new api.Map(
      mapElement.current,
      {
        center: initial ? [initial.lat, initial.lng] : [55.751244, 37.618423],
        zoom: initial ? 12 : 4,
        controls: ["zoomControl"],
      },
      { suppressMapOpenBlock: true },
    );

    mapRef.current = map;

    map.events.add("click", async (event) => {
      const coordinates = getMapCoordinates(event);

      if (!coordinates) {
        return;
      }

      const address = await getAddressByCoordinates(coordinates[0], coordinates[1]);

      if (address && isMounted) {
        setLocation(address);
        setQuery(address.address);
        setIsOpen(false);
        onChangeRef.current(address);
      }
    });

    return () => {
      isMounted = false;
      map.destroy();
      mapRef.current = null;
    };
  }, [api]);

  useEffect(() => {
    const map = mapRef.current;

    if (!api || !map || !location) {
      return;
    }

    let isCurrentMarker = true;
    map.geoObjects.removeAll();

    const marker = new api.Placemark(
      [location.lat, location.lng],
      {},
      { preset: "islands#orangeDotIcon", draggable: true },
    );

    marker.events.add("dragend", async () => {
      const [latitude, longitude] = marker.geometry.getCoordinates();
      const address = await getAddressByCoordinates(latitude, longitude);

      if (address && isCurrentMarker) {
        setLocation(address);
        setQuery(address.address);
        setIsOpen(false);
        onChangeRef.current(address);
      }
    });

    map.geoObjects.add(marker);
    map.setCenter([location.lat, location.lng], 12);

    return () => {
      isCurrentMarker = false;
    };
  }, [api, location]);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    let isCurrentQuery = true;
    const timer = setTimeout(async () => {
      const items = await getAddressSuggestions(query.trim());

      if (isCurrentQuery) {
        setSuggestions({ query, items });
      }
    }, 350);

    return () => {
      isCurrentQuery = false;
      clearTimeout(timer);
    };
  }, [query]);

  /** Применяет выбранную подсказку к полю, метке и родительской форме. */
  function selectAddress(address: SelectedLocation) {
    setLocation(address);
    setQuery(address.address);
    setIsOpen(false);
    onChange(address);
  }

  return (
    <div className={styles.picker}>
      <div className={styles.searchBox}>
        <input
          className={styles.search}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(results.length > 0)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          autoComplete="off"
        />

        {isOpen && results.length > 0 && (
          <ul className={styles.suggestions}>
            {results.map((address, index) => (
              <li key={`${address.lat}-${address.lng}-${index}`}>
                <button
                  type="button"
                  className={styles.suggestion}
                  onClick={() => selectAddress(address)}
                >
                  {address.address}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
      </div>
    </div>
  );
}

export { getAddressSuggestions } from "./api/get-address-suggestions";
export type { SelectedLocation } from "./model/types";
