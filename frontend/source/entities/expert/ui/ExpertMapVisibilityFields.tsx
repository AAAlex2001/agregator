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

const CERTIFICATE_FIELDS = ["object", "area", "category"];

export const DEFAULT_MAP_FIELDS = ["name", "area", "object", "category"];

interface Props {
  showOnMap: boolean;
  mapFields: string[];
  onChangeShowOnMap: (value: boolean) => void;
  onChangeMapFields: (value: string[]) => void;
  certificateFieldsVisible?: boolean;
}

export function ExpertMapVisibilityFields({
  showOnMap,
  mapFields,
  onChangeShowOnMap,
  onChangeMapFields,
  certificateFieldsVisible = true,
}: Props) {
  const options = certificateFieldsVisible
    ? MAP_FIELD_OPTIONS
    : MAP_FIELD_OPTIONS.filter((option) => !CERTIFICATE_FIELDS.includes(option.value));
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
          <span className={s.hint}>
            {certificateFieldsVisible
              ? "Что отразить на карте — отметьте нужное. Область, объект и категория относятся к удостоверениям экспертизы ОПО; на картах других направлений показываются данные их анкет."
              : "Что отразить на карте — отметьте нужное. Данные направлений показываются из их анкет."}
          </span>
          <div className={s.options}>
            {options.map((option) => (
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
