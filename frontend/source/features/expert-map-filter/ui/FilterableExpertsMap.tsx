"use client";

import type { ExpertMapItemApi } from "@/source/entities/expert";
import { AREA_OPTIONS, TYPES, TypeBadge } from "@/source/entities/expertise";
import { YandexMarkersMap, type MapMarker } from "@/source/shared/ui/YandexMap";
import { useExpertMapFilter } from "../model/useExpertMapFilter";
import s from "./filterableExpertsMap.module.scss";

interface Props {
  items: ExpertMapItemApi[];
  height?: number | string;
  emptyText: string;
}

const NO_MATCH_TEXT = "По выбранным фильтрам экспертов не нашлось — снимите часть фильтров";

function toMarker(item: ExpertMapItemApi): MapMarker {
  return {
    id: item.public_id,
    lat: item.lat,
    lng: item.lng,
    title: item.full_name,
    city: item.city,
    rating: item.rating,
    travelsToOtherRegions: item.travels_to_other_regions,
    certificates: item.certificates,
    phone: item.phone,
    email: item.email,
  };
}

export function FilterableExpertsMap({ items, height = "100%", emptyText }: Props) {
  const { areas, objects, toggleArea, toggleObject, filtered } = useExpertMapFilter(items);
  const noMatch = items.length > 0 && filtered.length === 0;

  return (
    <div className={s.layout}>
      <div className={s.objectsAxis} role="group" aria-label="Фильтр по объектам экспертизы">
        {TYPES.map((object) => (
          <TypeBadge
            key={object}
            type={object}
            active={objects.includes(object)}
            onClick={() => toggleObject(object)}
          />
        ))}
      </div>

      <div className={s.mapBox}>
        <YandexMarkersMap
          markers={filtered.map(toMarker)}
          height={height}
          emptyText={noMatch ? NO_MATCH_TEXT : emptyText}
        />
      </div>

      <div className={s.areasAxis} role="group" aria-label="Фильтр по областям аттестации">
        {AREA_OPTIONS.map((area) => (
          <button
            key={area.value}
            type="button"
            className={`${s.chip} ${areas.includes(area.value) ? s.chipActive : ""}`}
            onClick={() => toggleArea(area.value)}
            title={area.name}
          >
            {area.value}
          </button>
        ))}
      </div>
    </div>
  );
}
