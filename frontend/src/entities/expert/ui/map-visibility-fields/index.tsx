"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import { MapFieldOption } from "../map-field-option";
import {
  COMMON_MAP_FIELD_OPTIONS,
  DIRECTION_MAP_FIELD_GROUPS,
} from "../../config/map-fields";
import styles from "./style.module.scss";

/** Настройки публикации анкеты на карте; mapFields содержит серверные ключи полей. */
interface ExpertMapVisibilityFieldsProps {
  showOnMap: boolean;
  mapFields: string[];
  onChangeShowOnMap: (value: boolean) => void;
  onChangeMapFields: (value: string[]) => void;
  activeDirections?: string[];
}

/** Управляет показом исполнителя и выбранных данных его анкеты на карте. */
export function ExpertMapVisibilityFields({
  showOnMap,
  mapFields,
  onChangeShowOnMap,
  onChangeMapFields,
  activeDirections,
}: ExpertMapVisibilityFieldsProps) {
  const groups = activeDirections
    ? DIRECTION_MAP_FIELD_GROUPS.filter((group) =>
        activeDirections.includes(group.direction),
      )
    : DIRECTION_MAP_FIELD_GROUPS;

  /** Добавляет поле на карту или убирает его из выбранных. */
  function toggleField(field: string) {
    onChangeMapFields(
      mapFields.includes(field)
        ? mapFields.filter((selected) => selected !== field)
        : [...mapFields, field],
    );
  }

  return (
    <div className={styles.block}>
      <Checkbox
        id="expert-show-on-map"
        checked={showOnMap}
        onChange={onChangeShowOnMap}
      >
        Показывать меня на карте России
      </Checkbox>

      {showOnMap && (
        <div className={styles.fields}>
          <span className={styles.hint}>
            Что отразить в метке на карте — отметьте нужное. Пока ничего не отмечено,
            направление показывает все данные своей анкеты.
          </span>

          <div className={styles.options}>
            {COMMON_MAP_FIELD_OPTIONS.map((option) => (
              <MapFieldOption
                key={option.value}
                option={option}
                selected={mapFields.includes(option.value)}
                onToggle={toggleField}
              />
            ))}
          </div>

          {groups.map((group) => (
            <div
              key={group.direction}
              className={styles.group}
            >
              <span className={styles.groupTitle}>{group.title}</span>

              <div className={styles.options}>
                {group.options.map((option) => (
                  <MapFieldOption
                    key={option.value}
                    option={option}
                    selected={mapFields.includes(option.value)}
                    onToggle={toggleField}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
