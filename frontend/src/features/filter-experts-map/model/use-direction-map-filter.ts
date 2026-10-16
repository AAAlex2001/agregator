"use client";

import { useState } from "react";
import type { ExpertMapItem } from "@/entities/expert";
import { toggleFilterValue } from "./toggle-filter-value";
import type { MapFilterGroup, MapFilterSelection } from "./types";

/** Отбирает исполнителей по всем группам параметров выбранного направления. */
export function useDirectionMapFilter(
  items: ExpertMapItem[],
  groups: MapFilterGroup[],
) {
  const [selected, setSelected] = useState<MapFilterSelection[]>([]);

  /** Возвращает выбор группы по её названию, как в исходном фильтре. */
  function getSelected(label: string): string[] {
    return selected.find((group) => group.label === label)?.values ?? [];
  }

  /** Переключает значение одной группы, сохраняя фильтры других направлений. */
  function toggle(label: string, value: string) {
    setSelected((current) => {
      const values = current.find((group) => group.label === label)?.values ?? [];
      const otherGroups = current.filter((group) => group.label !== label);

      return [
        ...otherGroups,
        {
          label,
          values: toggleFilterValue(values, value),
        },
      ];
    });
  }

  const filtered = items.filter((item) => (
    groups.every((group) => {
      const values = getSelected(group.label);

      return values.length === 0 || values.some((value) => (
        item.certificate_codes.includes(value)
      ));
    })
  ));

  return {
    filtered,
    getSelected,
    toggle,
  };
}
