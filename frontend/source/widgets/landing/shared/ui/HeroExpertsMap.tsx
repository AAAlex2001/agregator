"use client";

import { useExpertsMap } from "@/source/entities/expert";
import { FilterableExpertsMap } from "@/source/features/expert-map-filter";
import { useSession } from "@/source/features/session";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./heroExpertsMap.module.scss";

export function HeroExpertsMap({
  hideHead = false,
  mapOnly = false,
  direction,
}: { hideHead?: boolean; mapOnly?: boolean; direction?: string } = {}) {
  const { user } = useSession();
  const { items } = useExpertsMap(direction);

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
