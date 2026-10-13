"use client";

import { useExpertsMap } from "@/source/entities/expert";
import type { OrderWorkType } from "@/source/entities/order";
import { DesignSpecialistsMap } from "@/source/features/design-map-filter";
import { DirectionExpertsMap, FilterableExpertsMap } from "@/source/features/expert-map-filter";
import { SurveySpecialistsMap } from "@/source/features/survey-map-filter";
import { FormSection } from "./FormSection";
import s from "./ExpertsMapSection.module.scss";

function ExpertiseMap() {
  const { items, isLoading } = useExpertsMap();
  return (
    <FilterableExpertsMap
      items={items}
      height={420}
      emptyText={isLoading ? "Загрузка карты исполнителей…" : "Пока нет исполнителей этого направления"}
      contactsHref="/landing/expert-contacts"
    />
  );
}

interface ExpertsMapSectionProps {
  workType: OrderWorkType;
}

/** Карта исполнителей выбранного направления. */
export function ExpertsMapSection({ workType }: ExpertsMapSectionProps) {
  return (
    <FormSection label="Исполнители на карте">
      <p className={s.hint}>
        Посмотрите, где находятся исполнители площадки, — это поможет выбрать исполнителя ближе к объекту. Точки кластеризуются; нажмите на
        маркер, чтобы увидеть исполнителя.
      </p>
      {workType === "EXPERTISE" && <ExpertiseMap />}
      {workType === "DESIGN" && <DesignSpecialistsMap />}
      {workType === "SURVEY" && <SurveySpecialistsMap />}
      {workType !== "EXPERTISE" && workType !== "DESIGN" && workType !== "SURVEY" && <DirectionExpertsMap direction={workType} />}
    </FormSection>
  );
}
