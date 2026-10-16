"use client";

import { useState } from "react";
import { EXPERTISE_AREA_ROWS } from "../../config/expertise-codes";
import { EXPERTISE_TYPES } from "../../config/attestation-areas";
import {
  getExpertiseCode,
  getSelectedExpertiseAreas,
  toggleExpertiseArea,
} from "../../model/expertise-codes";
import type { ExpertiseType } from "../../model/types";
import { ExpertiseAreaOption } from "../expertise-area-option";
import { ExpertiseTypeOption } from "../expertise-type-option";
import styles from "./style.module.scss";

/** Выбранные коды экспертных требований и подписи блоков выбора. */
interface ExpertiseCodesPickerProps {
  value: string[];
  onChange: (codes: string[]) => void;
  typeLabel?: string;
  areaLabel?: string;
  resultLabel?: string;
}

/** Собирает требования из объектов экспертизы и допустимых областей аттестации. */
export function ExpertiseCodesPicker({
  value,
  onChange,
  typeLabel = "Выберите основной(-ые) объект(-ы) экспертизы",
  areaLabel = "Выберите область(-и) аттестации исполнителя(-ов)",
  resultLabel = "Получаете уведомления по",
}: ExpertiseCodesPickerProps) {
  const [activeType, setActiveType] = useState<ExpertiseType | null>(null);
  const selectedAreas = activeType
    ? getSelectedExpertiseAreas(value, activeType)
    : [];
  const resultCodes = [...new Set(value)];

  /** Открывает области выбранного объекта; повторное нажатие закрывает выбор. */
  function toggleType(type: ExpertiseType) {
    setActiveType((currentType) => currentType === type ? null : type);
  }

  /** Меняет одну область активного объекта и передаёт полный список кодов. */
  function toggleArea(area: string) {
    if (activeType) {
      onChange(toggleExpertiseArea(value, activeType, area));
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.block}>
        <span className={styles.subLabel}>{typeLabel}</span>
        <div className={styles.row}>
          {EXPERTISE_TYPES.map((type) => (
            <ExpertiseTypeOption
              key={type}
              type={type}
              active={
                activeType === type
                || getSelectedExpertiseAreas(value, type).length > 0
              }
              onToggle={toggleType}
            />
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <span className={styles.subLabel}>{areaLabel}</span>
        <div className={styles.opoRows}>
          {EXPERTISE_AREA_ROWS.map((row) => (
            <div
              key={row[0]}
              className={styles.row}
            >
              {row.map((area) => (
                <ExpertiseAreaOption
                  key={area}
                  area={area}
                  active={selectedAreas.includes(area)}
                  disabled={!activeType || !getExpertiseCode(area, activeType)}
                  onToggle={toggleArea}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {resultCodes.length > 0 && (
        <div className={styles.block}>
          <span className={styles.subLabel}>{resultLabel}</span>
          <div className={styles.resultRow}>
            {resultCodes.map((code) => (
              <span
                key={code}
                className={styles.resultChip}
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
