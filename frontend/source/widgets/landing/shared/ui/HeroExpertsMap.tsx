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
}: { hideHead?: boolean; mapOnly?: boolean; direction?: string | null } = {}) {
  const { user } = useSession();
  const { items, isLoading } = useExpertsMap(direction);

  const emptyText =
    direction === null
      ? "Исполнители этого направления скоро появятся на площадке"
      : isLoading
        ? "Загрузка карты исполнителей…"
        : "Пока нет исполнителей этого направления с указанной локацией";

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
          emptyText={emptyText}
          contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
          mapOnly={mapOnly}
        />
      </div>
    </div>
  );
}
