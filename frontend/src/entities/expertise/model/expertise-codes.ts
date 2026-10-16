import { EXPERTISE_CODE_GROUPS } from "../config/expertise-codes";
import type { ExpertiseType } from "./types";

/** Все коды экспертных требований, которые принимает фильтр новых заказов. */
const EXPERTISE_CODES = new Set(
  EXPERTISE_CODE_GROUPS.flatMap((group) => (
    group.areas.map((area) => `Э${area} ${group.type}`)
  )),
);

/** Отличает код экспертизы от кода другого направления работы. */
export function isExpertiseCode(code: string): boolean {
  return EXPERTISE_CODES.has(code);
}

/** Возвращает код допустимого сочетания области и объекта экспертизы. */
export function getExpertiseCode(area: string, type: ExpertiseType): string | null {
  const group = EXPERTISE_CODE_GROUPS.find((item) => item.type === type);

  if (!group?.areas.includes(area)) {
    return null;
  }

  return `Э${area} ${type}`;
}

/** Находит выбранные области одного объекта в прежнем порядке таблицы. */
export function getSelectedExpertiseAreas(
  codes: string[],
  type: ExpertiseType,
): string[] {
  const group = EXPERTISE_CODE_GROUPS.find((item) => item.type === type);

  return group?.areas.filter((area) => codes.includes(`Э${area} ${type}`)) ?? [];
}

/** Меняет одну область выбранного объекта, сохраняя остальные экспертные требования. */
export function toggleExpertiseArea(
  codes: string[],
  type: ExpertiseType,
  area: string,
): string[] {
  if (!getExpertiseCode(area, type)) {
    return codes;
  }

  return EXPERTISE_CODE_GROUPS.flatMap((group) => {
    const selectedAreas = getSelectedExpertiseAreas(codes, group.type);

    if (group.type !== type) {
      return selectedAreas.map((selectedArea) => `Э${selectedArea} ${group.type}`);
    }

    const nextAreas = selectedAreas.includes(area)
      ? selectedAreas.filter((selectedArea) => selectedArea !== area)
      : [...selectedAreas, area];

    return nextAreas.map((selectedArea) => `Э${selectedArea} ${type}`);
  });
}
