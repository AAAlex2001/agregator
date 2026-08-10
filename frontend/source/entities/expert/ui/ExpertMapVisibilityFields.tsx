"use client";

import { Checkbox } from "@/source/shared/ui";
import {
  COMMON_MAP_FIELD_OPTIONS,
  DIRECTION_MAP_FIELD_GROUPS,
  type MapFieldOption,
} from "../model/mapFields";
import s from "./ExpertMapVisibilityFields.module.scss";

interface Props {
  showOnMap: boolean;
  mapFields: string[];
  onChangeShowOnMap: (value: boolean) => void;
  onChangeMapFields: (value: string[]) => void;
  activeDirections?: string[];
}

export function ExpertMapVisibilityFields({
  showOnMap,
  mapFields,
  onChangeShowOnMap,
  onChangeMapFields,
  activeDirections,
}: Props) {
  const groups = activeDirections
    ? DIRECTION_MAP_FIELD_GROUPS.filter((group) => activeDirections.includes(group.direction))
    : DIRECTION_MAP_FIELD_GROUPS;

  const toggle = (item: string) =>
    onChangeMapFields(
      mapFields.includes(item) ? mapFields.filter((x) => x !== item) : [...mapFields, item],
    );

  const renderOption = (option: MapFieldOption) => (
    <button
      key={option.value}
      type="button"
      className={`${s.option} ${mapFields.includes(option.value) ? s.optionActive : ""}`}
      onClick={() => toggle(option.value)}
    >
      {option.label}
    </button>
  );

  return (
    <div className={s.block}>
      <Checkbox id="expert-show-on-map" checked={showOnMap} onChange={onChangeShowOnMap}>
        Показывать меня на карте России
      </Checkbox>

      {showOnMap && (
        <div className={s.fields}>
          <span className={s.hint}>
            Что отразить в метке на карте — отметьте нужное. Пока ничего не отмечено, направление
            показывает все данные своей анкеты.
          </span>

          <div className={s.options}>{COMMON_MAP_FIELD_OPTIONS.map(renderOption)}</div>

          {groups.map((group) => (
            <div key={group.direction} className={s.group}>
              <span className={s.groupTitle}>{group.title}</span>
              <div className={s.options}>{group.options.map(renderOption)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
