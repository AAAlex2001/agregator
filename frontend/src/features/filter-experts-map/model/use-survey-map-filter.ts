"use client";

import { useState } from "react";
import type { ExpertMapItem } from "@/entities/expert";
import { SURVEY_MAP_KINDS, SURVEY_MAP_SPECIALISTS } from "@/entities/survey";
import { toggleFilterValue } from "./toggle-filter-value";

/** Отбирает изыскателей по видам работ и связанным с ними специалистам. */
export function useSurveyMapFilter(items: ExpertMapItem[]) {
  const [kinds, setKinds] = useState<string[]>([]);
  const [specialists, setSpecialists] = useState<string[]>([]);
  const selectedSpecialists = SURVEY_MAP_SPECIALISTS.filter((specialist) => (
    specialists.includes(specialist.key)
  ));
  const availableKinds = SURVEY_MAP_KINDS.filter((kind) => (
    selectedSpecialists.length === 0 ||
    selectedSpecialists.some((specialist) => specialist.kind === kind.code)
  ));
  const availableSpecialists = SURVEY_MAP_SPECIALISTS.filter((specialist) => (
    kinds.length === 0 || kinds.includes(specialist.kind)
  ));
  const specialistKinds = selectedSpecialists.map((specialist) => specialist.kind);

  /** Проверяет коды видов работ исполнителя по выбранным параметрам. */
  function matchesFilters(item: ExpertMapItem): boolean {
    const codes = item.certificate_codes;

    if (kinds.length > 0 && !kinds.some((kind) => codes.includes(kind))) {
      return false;
    }

    if (
      specialists.length > 0 &&
      !specialistKinds.some((kind) => codes.includes(kind))
    ) {
      return false;
    }

    return true;
  }

  /** Переключает вид изысканий. */
  function toggleKind(kind: string) {
    setKinds((current) => toggleFilterValue(current, kind));
  }

  /** Переключает специалиста соответствующего вида изысканий. */
  function toggleSpecialist(specialist: string) {
    setSpecialists((current) => toggleFilterValue(current, specialist));
  }

  return {
    kinds,
    specialists,
    availableKinds,
    availableSpecialists,
    filtered: items.filter(matchesFilters),
    toggleKind,
    toggleSpecialist,
  };
}
