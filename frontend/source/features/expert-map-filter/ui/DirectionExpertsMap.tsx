"use client";

import { useState } from "react";
import { useExpertsMap } from "@/source/entities/expert";
import { useSession } from "@/source/features/session";
import { YandexMarkersMap } from "@/source/shared/ui/YandexMap";
import { toMarker } from "../model/toMarker";
import { useDirectionFilterGroups } from "../model/useDirectionFilterGroups";
import { FilterDropdown } from "./FilterDropdown";
import s from "./directionExpertsMap.module.scss";

export function DirectionExpertsMap({ direction }: { direction: string | null }) {
  const { user } = useSession();
  const { items, isLoading } = useExpertsMap(direction);
  const groups = useDirectionFilterGroups(direction);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const toggle = (label: string, value: string) =>
    setSelected((current) => {
      const values = current[label] ?? [];
      return {
        ...current,
        [label]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
      };
    });

  const filtered = items.filter((item) =>
    groups.every((group) => {
      const values = selected[group.label] ?? [];
      return values.length === 0 || values.some((value) => item.certificate_codes.includes(value));
    }),
  );

  const emptyText =
    direction === null
      ? "Исполнители этого направления скоро появятся на площадке"
      : isLoading
        ? "Загрузка карты исполнителей…"
        : items.length > 0
          ? "По выбранным фильтрам исполнителей не нашлось — снимите часть фильтров"
          : "Пока нет исполнителей этого направления";

  return (
    <div className={s.layout}>
      {groups.length > 0 && (
        <div className={s.filters}>
          {groups.map((group) => (
            <FilterDropdown
              key={group.label}
              label={group.label}
              options={group.options}
              selected={selected[group.label] ?? []}
              onToggle={(value) => toggle(group.label, value)}
            />
          ))}
        </div>
      )}

      <div className={s.mapBox}>
        <YandexMarkersMap
          markers={filtered.map(toMarker)}
          height="100%"
          emptyText={emptyText}
          contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
        />
      </div>
    </div>
  );
}
