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
      <span className={base.label}>Эксперты на карте</span>
      <p className={s.hint}>
        Посмотрите, где находятся эксперты площадки, — это поможет выбрать исполнителя ближе к объекту.
        Точки кластеризуются; нажмите на маркер, чтобы увидеть эксперта.
      </p>
      <FilterableExpertsMap items={items} height={420} emptyText="Пока нет экспертов с указанной локацией" />
    </section>
  );
}
