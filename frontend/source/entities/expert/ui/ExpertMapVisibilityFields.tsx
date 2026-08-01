"use client";

import { Checkbox } from "@/source/shared/ui";
import s from "./ExpertMapVisibilityFields.module.scss";

export const MAP_FIELD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "name", label: "ФИО" },
  { value: "object", label: "Объект экспертизы" },
  { value: "area", label: "Область аттестации" },
  { value: "category", label: "Категория" },
  { value: "contacts", label: "Контактные данные" },
];

export const DEFAULT_MAP_FIELDS = ["name", "area", "object", "category"];

interface Props {
  showOnMap: boolean;
  mapFields: string[];
  onChangeShowOnMap: (value: boolean) => void;
  onChangeMapFields: (value: string[]) => void;
}

export function ExpertMapVisibilityFields({
  showOnMap,
  mapFields,
  onChangeShowOnMap,
  onChangeMapFields,
}: Props) {
  const toggle = (item: string) =>
    onChangeMapFields(
      mapFields.includes(item) ? mapFields.filter((x) => x !== item) : [...mapFields, item],
    );

  return (
    <div className={s.block}>
      <Checkbox id="expert-show-on-map" checked={showOnMap} onChange={onChangeShowOnMap}>
        Показывать меня на карте России
      </Checkbox>

      {showOnMap && (
        <div className={s.fields}>
          <span className={s.hint}>Что отразить на карте — отметьте нужное</span>
          <div className={s.options}>
            {MAP_FIELD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${s.option} ${mapFields.includes(option.value) ? s.optionActive : ""}`}
                onClick={() => toggle(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
