"use client";

import { useOrderForm } from "@/entities/order";
import {
  DesignSpecialistsMap,
  DirectionExpertsMap,
  ExpertiseExpertsMap,
  SurveySpecialistsMap,
} from "@/features/filter-experts-map";
import { FormSection } from "@/shared/ui/form-section";

/** Зачем заказчику карта исполнителей. */
const MAP_HINT = "Посмотрите, где находятся исполнители площадки, — это поможет выбрать "
  + "исполнителя ближе к объекту. Нажмите на маркер, чтобы увидеть исполнителя";

/** Показывает карту и фильтры исполнителей для текущего направления заказа. */
export function OrderExpertsMap() {
  const { values } = useOrderForm();
  const workType = values.workType;
  const isOtherDirection = workType !== "EXPERTISE"
    && workType !== "DESIGN"
    && workType !== "SURVEY";

  return (
    <FormSection
      title="Исполнители на карте"
      hint={MAP_HINT}
    >
      {workType === "EXPERTISE" && (
        <ExpertiseExpertsMap
          height={420}
          contactsHref="/landing/expert-contacts"
        />
      )}
      {workType === "DESIGN" && <DesignSpecialistsMap />}
      {workType === "SURVEY" && <SurveySpecialistsMap />}
      {isOtherDirection && <DirectionExpertsMap direction={workType} />}
    </FormSection>
  );
}
