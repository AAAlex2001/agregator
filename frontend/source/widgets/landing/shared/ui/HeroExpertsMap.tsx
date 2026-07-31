"use client";

import { useEffect, useState } from "react";
import { fetchExpertsMap, type ExpertMapItemApi } from "@/source/entities/expert";
import { FilterableExpertsMap } from "@/source/features/expert-map-filter";
import { useSession } from "@/source/features/session";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./heroExpertsMap.module.scss";

export function HeroExpertsMap({
  hideHead = false,
  mapOnly = false,
}: { hideHead?: boolean; mapOnly?: boolean } = {}) {
  const { user } = useSession();
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
      {!hideHead && (
        <div className={s.head}>
          <Title text="Исполнители промышленной безопасности на карте России" />
          <Subtitle text="Аттестованные исполнители Ростехнадзора по всей стране — выбирайте исполнителя ближе к вашему опасному производственному объекту." />
        </div>
      )}
      <div className={s.mapArea}>
        <FilterableExpertsMap
          items={items}
          height="100%"
          emptyText="Загрузка карты исполнителей…"
          contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
          mapOnly={mapOnly}
        />
      </div>
    </div>
  );
}
