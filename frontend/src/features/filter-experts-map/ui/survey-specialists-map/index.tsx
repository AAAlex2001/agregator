"use client";

import { ExpertsMap, useExpertsMap } from "@/entities/expert";
import { SURVEY_MAP_KINDS } from "@/entities/survey";
import type { SurveyMapSpecialist } from "@/entities/survey";
import { useUser } from "@/entities/user";
import { FilterDropdown } from "@/shared/ui/filter-dropdown";
import type { FilterDropdownOption } from "@/shared/ui/filter-dropdown";
import { getMapEmptyText } from "../../model/get-map-empty-text";
import type { ExpertsMapOptions } from "../../model/types";
import { useSurveyMapFilter } from "../../model/use-survey-map-filter";
import { DirectionMapLayout } from "../direction-map-layout";

/** Добавляет к специалисту сокращение соответствующего вида изысканий. */
function toSpecialistOption(specialist: SurveyMapSpecialist): FilterDropdownOption {
  const kind = SURVEY_MAP_KINDS.find((item) => item.code === specialist.kind);

  return {
    value: specialist.key,
    short: kind?.short,
    title: specialist.title,
  };
}

/** Загружает изыскателей и отбирает их по видам работ и специальностям. */
export function SurveySpecialistsMap({
  height,
  contactsHref,
}: ExpertsMapOptions) {
  const { user } = useUser();
  const { items, isLoading } = useExpertsMap("SURVEY");
  const {
    kinds,
    specialists,
    availableKinds,
    availableSpecialists,
    filtered,
    toggleKind,
    toggleSpecialist,
  } = useSurveyMapFilter(items);
  const contactsPath = contactsHref ?? (
    user ? "/landing/expert-contacts" : "/expert-contacts"
  );

  return (
    <DirectionMapLayout
      height={height}
      filters={(
        <>
          <FilterDropdown
            label="Виды изысканий"
            options={availableKinds.map((kind) => ({
              value: kind.code,
              short: kind.short,
              title: kind.title,
            }))}
            selected={kinds}
            onToggle={toggleKind}
          />
          <FilterDropdown
            label="Специалисты"
            options={availableSpecialists.map(toSpecialistOption)}
            selected={specialists}
            onToggle={toggleSpecialist}
          />
        </>
      )}
      map={(
        <ExpertsMap
          items={filtered}
          height="100%"
          emptyText={getMapEmptyText(isLoading, items.length)}
          contactsHref={contactsPath}
        />
      )}
    />
  );
}

