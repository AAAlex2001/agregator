"use client";

import { ExpertsMap, useExpertsMap } from "@/entities/expert";
import { useUser } from "@/entities/user";
import { getMapEmptyText } from "../../model/get-map-empty-text";
import type { ExpertsMapOptions } from "../../model/types";
import { useDirectionFilterGroups } from "../../model/use-direction-filter-groups";
import { useDirectionMapFilter } from "../../model/use-direction-map-filter";
import { DirectionMapFilterGroup } from "../direction-map-filter-group";
import { DirectionMapLayout } from "../direction-map-layout";

/** Направление исполнителей и параметры размещения карты. */
interface DirectionExpertsMapProps extends ExpertsMapOptions {
  direction: string | null;
}

/** Загружает исполнителей направления и фильтрует их по профильным параметрам. */
export function DirectionExpertsMap({
  direction,
  height,
  contactsHref,
}: DirectionExpertsMapProps) {
  const { user } = useUser();
  const { items, isLoading } = useExpertsMap(direction);
  const groups = useDirectionFilterGroups(direction);
  const { filtered, getSelected, toggle } = useDirectionMapFilter(items, groups);
  const emptyText = direction === null
    ? "Исполнители этого направления скоро появятся на площадке"
    : getMapEmptyText(isLoading, items.length);
  const contactsPath = contactsHref ?? (
    user ? "/landing/expert-contacts" : "/expert-contacts"
  );

  return (
    <DirectionMapLayout
      height={height}
      filters={groups.length > 0 && groups.map((group) => (
        <DirectionMapFilterGroup
          key={group.label}
          group={group}
          selected={getSelected(group.label)}
          onToggle={toggle}
        />
      ))}
      map={(
        <ExpertsMap
          items={filtered}
          height="100%"
          emptyText={emptyText}
          contactsHref={contactsPath}
        />
      )}
    />
  );
}

