"use client";

import { useState } from "react";
import type { ExpertMapItemApi } from "@/source/entities/expert";
import { SURVEY_KINDS, SURVEY_SPECIALISTS, type SurveyKindCode } from "@/source/entities/directions/survey";

export function useSurveyMapFilter(items: ExpertMapItemApi[]) {
  const [kinds, setKinds] = useState<SurveyKindCode[]>([]);
  const [specialists, setSpecialists] = useState<string[]>([]);

  const toggleKind = (code: SurveyKindCode) =>
    setKinds((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
  const toggleSpecialist = (key: string) =>
    setSpecialists((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));

  const selectedSpecialists = SURVEY_SPECIALISTS.filter((specialist) =>
    specialists.includes(specialist.key),
  );

  const availableKinds = SURVEY_KINDS.filter(
    (kind) =>
      selectedSpecialists.length === 0 ||
      selectedSpecialists.some((specialist) => specialist.kind === kind.code),
  );
  const availableSpecialists = SURVEY_SPECIALISTS.filter(
    (specialist) => kinds.length === 0 || kinds.includes(specialist.kind),
  );

  const specialistKinds = selectedSpecialists.map((specialist) => specialist.kind);
  const filtered = items.filter((item) => {
    const tags = item.certificate_codes;
    if (kinds.length > 0 && !kinds.some((code) => tags.includes(code))) return false;
    if (specialists.length > 0 && !specialistKinds.some((code) => tags.includes(code))) return false;
    return true;
  });

  return {
    kinds,
    specialists,
    availableKinds,
    availableSpecialists,
    toggleKind,
    toggleSpecialist,
    filtered,
  };
}
