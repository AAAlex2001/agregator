"use client";

import { useEffect, useState } from "react";
import { fetchExpertsMap, type ExpertMapItemApi } from "@/source/entities/expert";
import { FilterableExpertsMap } from "@/source/features/expert-map-filter";
import s from "./heroExpertsMap.module.scss";

export function HeroExpertsMap() {
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
    <div className={s.wrap}>
      <h2 className={s.heading}>Эксперты промышленной безопасности на карте России</h2>
      <p className={s.sub}>
        Аттестованные эксперты Ростехнадзора по всей стране — выбирайте исполнителя ближе к вашему
        опасному производственному объекту.
      </p>
      <div className={s.mapArea}>
        <FilterableExpertsMap items={items} height="100%" emptyText="Загрузка карты экспертов…" />
      </div>
    </div>
  );
}
