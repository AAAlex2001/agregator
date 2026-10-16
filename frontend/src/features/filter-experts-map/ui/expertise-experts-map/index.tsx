"use client";

import { ExpertsMap, useExpertsMap } from "@/entities/expert";
import { useUser } from "@/entities/user";
import { getMapEmptyText, NO_MATCH_TEXT } from "../../model/get-map-empty-text";
import type { ExpertsMapOptions } from "../../model/types";
import { useExpertiseMapFilter } from "../../model/use-expertise-map-filter";
import { ExpertiseMapArea } from "../expertise-map-area";
import { ExpertiseMapObject } from "../expertise-map-object";
import styles from "./style.module.scss";

/** Карта экспертов с необязательным скрытием фильтров для компактного размещения. */
interface ExpertiseExpertsMapProps extends ExpertsMapOptions {
  mapOnly?: boolean;
}

/** Загружает экспертов и отбирает их по областям аттестации и объектам экспертизы. */
export function ExpertiseExpertsMap({
  height = "100%",
  contactsHref,
  mapOnly = false,
}: ExpertiseExpertsMapProps) {
  const { user } = useUser();
  const { items, isLoading } = useExpertsMap();
  const {
    areas,
    objects,
    availableAreas,
    availableObjects,
    filtered,
    toggleArea,
    toggleObject,
  } = useExpertiseMapFilter(items);
  const noMatch = items.length > 0 && filtered.length === 0;
  const emptyText = noMatch
    ? NO_MATCH_TEXT
    : getMapEmptyText(isLoading, 0);
  const contactsPath = contactsHref ?? (
    user ? "/landing/expert-contacts" : "/expert-contacts"
  );
  const map = (
    <ExpertsMap
      items={filtered}
      height={height}
      emptyText={emptyText}
      contactsHref={contactsPath}
    />
  );

  if (mapOnly) {
    return (
      <div className={styles.mapOnly}>
        {map}
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div
        className={styles.objectsAxis}
        role="group"
        aria-label="Фильтр по объектам экспертизы"
      >
        {availableObjects.map((object) => (
          <ExpertiseMapObject
            key={object}
            object={object}
            isSelected={objects.includes(object)}
            onToggle={toggleObject}
          />
        ))}
      </div>

      <div className={styles.mapBox}>
        {map}
      </div>

      <div
        className={styles.areasAxis}
        role="group"
        aria-label="Фильтр по областям аттестации"
      >
        {availableAreas.map((area) => (
          <ExpertiseMapArea
            key={area.value}
            value={area.value}
            title={area.name}
            isSelected={areas.includes(area.value)}
            onToggle={toggleArea}
          />
        ))}
      </div>
    </div>
  );
}

