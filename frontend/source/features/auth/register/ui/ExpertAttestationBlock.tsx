"use client";

import { OPO_ROWS, TABLE, TypesPicker, type ExpertiseType } from "@/source/entities/expertise";
import s from "./ExpertAttestationBlock.module.scss";

const AREA_CODES: string[] = OPO_ROWS.flat();

const CATEGORY_OPTIONS = ["1", "2", "3"];

const MAP_FIELD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "name", label: "ФИО" },
  { value: "object", label: "Объект экспертизы" },
  { value: "area", label: "Область аттестации" },
  { value: "category", label: "Категория" },
  { value: "contacts", label: "Контактные данные" },
];

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

interface Props {
  confirmed: boolean;
  areas: string[];
  objects: ExpertiseType[];
  categories: string[];
  mapFields: string[];
  onToggleConfirmed: (value: boolean) => void;
  onChangeAreas: (value: string[]) => void;
  onChangeObjects: (value: ExpertiseType[]) => void;
  onChangeCategories: (value: string[]) => void;
  onChangeMapFields: (value: string[]) => void;
}

export function ExpertAttestationBlock({
  confirmed,
  areas,
  objects,
  categories,
  mapFields,
  onToggleConfirmed,
  onChangeAreas,
  onChangeObjects,
  onChangeCategories,
  onChangeMapFields,
}: Props) {
  return (
    <div className={s.block}>
      <button
        type="button"
        className={`${s.plate} ${confirmed ? s.plateActive : ""}`}
        onClick={() => onToggleConfirmed(!confirmed)}
      >
        <span className={s.check} aria-hidden />
        <span className={s.plateText}>
          <span className={s.plateTitle}>Я являюсь аттестованным экспертом</span>
          <span className={s.plateHint}>
            Укажите аттестацию — она поможет заказчикам найти вас на карте России
          </span>
        </span>
      </button>

      {confirmed && (
        <div className={s.reveal}>
          <div className={s.section}>
            <span className={s.sectionLabel}>Область аттестации</span>
            <span className={s.sectionHint}>Выберите области ОПО, по которым вы аттестованы</span>
            <div className={s.chips}>
              {AREA_CODES.map((code) => {
                const value = `Э${code}`;
                const active = areas.includes(value);
                return (
                  <button
                    key={code}
                    type="button"
                    title={TABLE[code]?.name}
                    className={`${s.chip} ${active ? s.chipActive : ""}`}
                    onClick={() => onChangeAreas(toggle(areas, value))}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <TypesPicker
            value={objects}
            onChange={onChangeObjects}
            label="Объект экспертизы"
            hint="Выберите типы объектов, по которым вы работаете"
          />

          <div className={s.section}>
            <span className={s.sectionLabel}>Категория</span>
            <span className={s.sectionHint}>Можно выбрать несколько</span>
            <div className={s.chips}>
              {CATEGORY_OPTIONS.map((cat) => {
                const active = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`${s.chip} ${active ? s.chipActive : ""}`}
                    onClick={() => onChangeCategories(toggle(categories, cat))}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={s.section}>
            <span className={s.sectionLabel}>Что показать на карте России</span>
            <span className={s.sectionHint}>
              Отметьте, какую информацию видят заказчики в вашей точке на карте
            </span>
            <div className={s.chips}>
              {MAP_FIELD_OPTIONS.map((opt) => {
                const active = mapFields.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${s.chip} ${s.chipWide} ${active ? s.chipActive : ""}`}
                    onClick={() => onChangeMapFields(toggle(mapFields, opt.value))}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
