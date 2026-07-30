"use client";

import { useEffect, useState } from "react";
import { fetchExpertsMap, type ExpertMapItemApi } from "@/source/entities/expert";
import { FilterableExpertsMap } from "@/source/features/expert-map-filter";
import base from "./sectionBase.module.scss";
import s from "./expertsMapSection.module.scss";

export function ExpertsMapSection() {
  const [items, setItems] = useState<ExpertMapItemApi[]>([]);

  useEffect(() => {
    let active = true;
    fetchExpertsMap()
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={base.section}>
      <span className={base.label}>Исполнители на карте</span>
      <p className={s.hint}>
        Посмотрите, где находятся исполнители площадки, — это поможет выбрать исполнителя ближе к объекту.
        Точки кластеризуются; нажмите на маркер, чтобы увидеть исполнителя.
      </p>
      <FilterableExpertsMap
        items={items}
        height={420}
        emptyText="Пока нет исполнителей с указанной локацией"
        contactsHref="/landing/expert-contacts"
      />
    </section>
  );
}
