"use client";

import { useExpertsMap } from "@/source/entities/expert";
import { SURVEY_KINDS } from "@/source/entities/survey";
import { useSession } from "@/source/features/session";
import { FilterDropdown, toMarker } from "@/source/features/expert-map-filter";
import { YandexMarkersMap } from "@/source/shared/ui/YandexMap";
import { useSurveyMapFilter } from "../model/useSurveyMapFilter";
import s from "./surveySpecialistsMap.module.scss";

const KIND_SHORTS = Object.fromEntries(SURVEY_KINDS.map((kind) => [kind.code, kind.short]));

export function SurveySpecialistsMap() {
  const { user } = useSession();
  const { items, isLoading } = useExpertsMap("SURVEY");
  const {
    kinds,
    specialists,
    availableKinds,
    availableSpecialists,
    toggleKind,
    toggleSpecialist,
    filtered,
  } = useSurveyMapFilter(items);

  const emptyText = isLoading
    ? "Загрузка карты исполнителей…"
    : items.length > 0
      ? "По выбранным фильтрам исполнителей не нашлось — снимите часть фильтров"
      : "Пока нет исполнителей этого направления";

  return (
    <div className={s.layout}>
      <div className={s.filters}>
        <FilterDropdown
          label="Виды изысканий"
          options={availableKinds.map((kind) => ({
            value: kind.code,
            short: kind.short,
            title: kind.title,
          }))}
          selected={kinds}
          onToggle={(value) => toggleKind(value as (typeof kinds)[number])}
        />
        <FilterDropdown
          label="Специалисты"
          options={availableSpecialists.map((specialist) => ({
            value: specialist.key,
            short: KIND_SHORTS[specialist.kind],
            title: specialist.title,
          }))}
          selected={specialists}
          onToggle={toggleSpecialist}
        />
      </div>

      <div className={s.mapBox}>
        <YandexMarkersMap
          markers={filtered.map(toMarker)}
          height="100%"
          emptyText={emptyText}
          contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
        />
      </div>
    </div>
  );
}
