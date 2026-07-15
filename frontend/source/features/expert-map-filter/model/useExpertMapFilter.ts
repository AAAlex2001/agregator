"use client";

import { useState } from "react";
import type { ExpertMapItemApi } from "@/source/entities/expert";
import { expertMatches } from "./match";

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function useExpertMapFilter(items: ExpertMapItemApi[]) {
  const [areas, setAreas] = useState<string[]>([]);
  const [objects, setObjects] = useState<string[]>([]);

  const toggleArea = (value: string) => setAreas((current) => toggleValue(current, value));
  const toggleObject = (value: string) => setObjects((current) => toggleValue(current, value));

  const filtered = items.filter((item) => expertMatches(item.certificate_codes, areas, objects));

  return { areas, objects, toggleArea, toggleObject, filtered };
}
