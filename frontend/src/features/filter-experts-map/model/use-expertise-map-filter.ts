"use client";

import { useState } from "react";
import type { ExpertMapItem } from "@/entities/expert";
import {
  ATTESTATION_AREAS,
  EXPERTISE_TYPES,
  getExpertiseCode,
} from "@/entities/expertise";
import type { ExpertiseType } from "@/entities/expertise";
import { matchesExpertise } from "./matches-expertise";
import { toggleFilterValue } from "./toggle-filter-value";

/** Отбирает экспертов и доступные сочетания областей аттестации с объектами экспертизы. */
export function useExpertiseMapFilter(items: ExpertMapItem[]) {
  const [areas, setAreas] = useState<string[]>([]);
  const [objects, setObjects] = useState<ExpertiseType[]>([]);
  const availableAreas = ATTESTATION_AREAS.filter((area) => (
    objects.every((object) => (
      getExpertiseCode(area.value.slice(1), object) !== null
    ))
  ));
  const availableObjects = EXPERTISE_TYPES.filter((object) => (
    areas.every((area) => getExpertiseCode(area.slice(1), object) !== null)
  ));
  const filtered = items.filter((item) => (
    matchesExpertise(item.certificate_codes, areas, objects)
  ));

  /** Переключает область аттестации в фильтре карты. */
  function toggleArea(area: string) {
    setAreas((current) => toggleFilterValue(current, area));
  }

  /** Переключает объект экспертизы, сохраняя остальные выбранные объекты. */
  function toggleObject(object: ExpertiseType) {
    setObjects((current) => (
      current.includes(object)
        ? current.filter((selectedObject) => selectedObject !== object)
        : [...current, object]
    ));
  }

  return {
    areas,
    objects,
    availableAreas,
    availableObjects,
    filtered,
    toggleArea,
    toggleObject,
  };
}
