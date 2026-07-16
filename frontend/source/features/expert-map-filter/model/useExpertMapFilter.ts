"use client";

import { useState } from "react";
import type { ExpertMapItemApi } from "@/source/entities/expert";
import { AREA_OPTIONS, TYPES, cell, type ExpertiseType } from "@/source/entities/expertise";
import { expertMatches } from "./match";

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function useExpertMapFilter(items: ExpertMapItemApi[]) {
  const [areas, setAreas] = useState<string[]>([]);
  const [objects, setObjects] = useState<ExpertiseType[]>([]);

  const toggleArea = (value: string) => setAreas((current) => toggleValue(current, value));
  const toggleObject = (value: ExpertiseType) => setObjects((current) => toggleValue(current, value) as ExpertiseType[]);

  const availableAreas = AREA_OPTIONS.filter((area) => {
    const opo = area.value.slice(1);
    return objects.length === 0 || objects.every((object) => cell(opo, object).length > 0);
  });
  const availableObjects = TYPES.filter((object) => (
    areas.length === 0 || areas.every((area) => cell(area.slice(1), object).length > 0)
  ));

  const filtered = items.filter((item) => expertMatches(item.certificate_codes, areas, objects));

  return { areas, objects, availableAreas, availableObjects, toggleArea, toggleObject, filtered };
}
