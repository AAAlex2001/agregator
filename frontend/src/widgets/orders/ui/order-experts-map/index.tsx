"use client";

import { OrderFormSection, useOrderForm } from "@/entities/order";
import {
  DesignSpecialistsMap,
  DirectionExpertsMap,
  ExpertiseExpertsMap,
  SurveySpecialistsMap,
} from "@/features/filter-experts-map";
import styles from "./style.module.scss";

/** Показывает карту и фильтры исполнителей для текущего направления заказа. */
export function OrderExpertsMap() {
  const { values } = useOrderForm();
  const workType = values.workType;
  const isOtherDirection = workType !== "EXPERTISE"
    && workType !== "DESIGN"
    && workType !== "SURVEY";

  return (
    <OrderFormSection label="Исполнители на карте">
      <p className={styles.hint}>
        Посмотрите, где находятся исполнители площадки, — это поможет выбрать исполнителя
        ближе к объекту. Точки кластеризуются; нажмите на маркер, чтобы увидеть исполнителя.
      </p>
      {workType === "EXPERTISE" && (
        <ExpertiseExpertsMap
          height={420}
          contactsHref="/landing/expert-contacts"
        />
      )}
      {workType === "DESIGN" && <DesignSpecialistsMap />}
      {workType === "SURVEY" && <SurveySpecialistsMap />}
      {isOtherDirection && <DirectionExpertsMap direction={workType} />}
    </OrderFormSection>
  );
}
