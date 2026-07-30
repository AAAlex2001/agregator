"use client";

import { useState } from "react";
import {
  OPO_ROWS,
  TABLE,
  TYPES,
  cell,
  computeBadgeCodes,
  type ExpertiseType,
} from "../model/data";
import { TypeBadge } from "./TypeBadge";
import s from "./BadgeCodesPicker.module.scss";

interface Props {
  value: string[];
  onChange: (codes: string[]) => void;
  typeLabel?: string;
  areaLabel?: string;
  resultLabel?: string;
}

type SelectionsByType = Record<ExpertiseType, string[]>;

function emptySelections(): SelectionsByType {
  return TYPES.reduce<SelectionsByType>((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as SelectionsByType);
}

function selectionsFromCodes(codes: string[]): SelectionsByType {
  const result = emptySelections();
  const wanted = new Set(codes);
  for (const opo of Object.keys(TABLE)) {
    for (const type of TYPES) {
      const cellCodes = cell(opo, type);
      if (cellCodes.length === 0) continue;
      if (cellCodes.some((code) => wanted.has(code))) {
        if (!result[type].includes(opo)) result[type].push(opo);
      }
    }
  }
  return result;
}

export function BadgeCodesPicker({
  value,
  onChange,
  typeLabel = "Выберите основной(-ые) объект(-ы) экспертизы",
  areaLabel = "Выберите область(-и) аттестации исполнителя(-ов)",
  resultLabel = "Получаете уведомления по",
}: Props) {
  const [activeType, setActiveType] = useState<ExpertiseType | null>(null);
  const selections = selectionsFromCodes(value);

  const apply = (next: SelectionsByType) => {
    const allCodes = Array.from(
      new Set(
        Object.entries(next).flatMap(([type, opos]) =>
          computeBadgeCodes([type as ExpertiseType], opos),
        ),
      ),
    );
    onChange(allCodes);
  };

  const toggleType = (type: ExpertiseType) => {
    setActiveType((prev) => (prev === type ? null : type));
  };

  const toggleOpo = (opo: string) => {
    if (!activeType) return;
    const current = selections[activeType] ?? [];
    const nextOpos = current.includes(opo)
      ? current.filter((x) => x !== opo)
      : [...current, opo];
    apply({ ...selections, [activeType]: nextOpos });
  };

  const activeOpos = activeType ? selections[activeType] ?? [] : [];
  const resultCodes = Array.from(new Set(value));

  return (
    <div className={s.wrap}>
      <div className={s.block}>
        <span className={s.subLabel}>{typeLabel}</span>
        <div className={s.row}>
          {TYPES.map((type) => {
            const hasSelection = (selections[type]?.length ?? 0) > 0;
            return (
              <TypeBadge
                key={type}
                type={type}
                active={activeType === type || hasSelection}
                onClick={() => toggleType(type)}
              />
            );
          })}
        </div>
      </div>

      <div className={s.block}>
        <span className={s.subLabel}>{areaLabel}</span>
        <div className={s.opoRows}>
          {OPO_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className={s.row}>
              {row.map((code) => {
                const active = activeOpos.includes(code);
                const enabled = activeType !== null && cell(code, activeType).length > 0;
                return (
                  <button
                    key={code}
                    type="button"
                    className={`${s.opoBadge} ${active ? s.active : ""} ${enabled ? "" : s.disabled}`}
                    onClick={() => toggleOpo(code)}
                    disabled={!enabled}
                  >
                    Э{code}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {resultCodes.length > 0 && (
        <div className={s.block}>
          <span className={s.subLabel}>{resultLabel}</span>
          <div className={s.resultRow}>
            {resultCodes.map((code) => (
              <span key={code} className={s.resultChip}>
                {code}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
