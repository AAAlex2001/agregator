"use client";

import { useExpertsMap } from "@/source/entities/expert";
import type { OrderWorkType } from "@/source/entities/order";
import { DesignSpecialistsMap } from "@/source/features/design-map-filter";
import { FilterableExpertsMap } from "@/source/features/expert-map-filter";
import base from "./sectionBase.module.scss";
import s from "./expertsMapSection.module.scss";

function DirectionMap({ workType }: { workType: OrderWorkType }) {
  const { items, isLoading } = useExpertsMap(workType === "EXPERTISE" ? undefined : workType);

  return (
    <FilterableExpertsMap
      items={items}
      height={420}
      emptyText={
        isLoading ? "Загрузка карты исполнителей…" : "Пока нет исполнителей этого направления"
      }
      contactsHref="/landing/expert-contacts"
      mapOnly={workType !== "EXPERTISE"}
    />
  );
}

export function ExpertsMapSection({ workType }: { workType: OrderWorkType }) {
  return (
    <section className={base.section}>
      <span className={base.label}>Исполнители на карте</span>
      <p className={s.hint}>
        Посмотрите, где находятся исполнители площадки, — это поможет выбрать исполнителя ближе к объекту.
        Точки кластеризуются; нажмите на маркер, чтобы увидеть исполнителя.
      </p>
      {workType === "DESIGN" ? <DesignSpecialistsMap /> : <DirectionMap workType={workType} />}
    </section>
  );
}
