"use client";

import type { ExpertMapItemApi } from "@/source/entities/expert";
import { TypeBadge } from "@/source/entities/expertise";
import { YandexMarkersMap } from "@/source/shared/ui/YandexMap";
import { toMarker } from "../model/toMarker";
import { useExpertMapFilter } from "../model/useExpertMapFilter";
import s from "./filterableExpertsMap.module.scss";

interface Props {
  items: ExpertMapItemApi[];
  height?: number | string;
  emptyText: string;
  contactsHref?: string;
  mapOnly?: boolean;
}

const NO_MATCH_TEXT = "По выбранным фильтрам исполнителей не нашлось — снимите часть фильтров";

export function FilterableExpertsMap({
  items,
  height = "100%",
  emptyText,
  contactsHref,
  mapOnly = false,
}: Props) {
  const { areas, objects, availableAreas, availableObjects, toggleArea, toggleObject, filtered } = useExpertMapFilter(items);
  const noMatch = items.length > 0 && filtered.length === 0;

  if (mapOnly) {
    return (
      <div className={s.mapOnly}>
        <YandexMarkersMap
          markers={filtered.map(toMarker)}
          height={height}
          emptyText={noMatch ? NO_MATCH_TEXT : emptyText}
          contactsHref={contactsHref}
        />
      </div>
    );
  }

  return (
    <div className={s.layout}>
      <div className={s.objectsAxis} role="group" aria-label="Фильтр по объектам экспертизы">
        {availableObjects.map((object) => (
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
          contactsHref={contactsHref}
        />
      </div>

      <div className={s.areasAxis} role="group" aria-label="Фильтр по областям аттестации">
        {availableAreas.map((area) => (
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
