import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { TABLE, TYPES, type ExpertiseType } from "@/source/shared/ui/ExpertiseCodesModal/expertiseCodes.data";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./badgeSection.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
  onShowHelp: () => void;
}

const OPO_ROWS: string[][] = [
  ["1", "2", "3.1", "3.2", "4", "5"],
  ["6", "7", "8", "9", "10", "11", "12"],
  ["13", "14.1", "14.2", "14.3", "14.4", "15"],
];

const TYPE_COLOR: Record<ExpertiseType, string> = {
  "КЛ/ТП": "blue",
  "ТУ": "orange",
  "ЗС": "green",
  "Д": "brown",
  "ОБ": "gray",
};

export function BadgeSection({ form, onShowHelp }: Props) {
  const selections = (form.watch("selectionsByType") ?? {}) as Record<ExpertiseType, string[]>;
  const [activeType, setActiveType] = useState<ExpertiseType | null>(null);

  const setSelections = (next: Record<ExpertiseType, string[]>) =>
    form.setValue("selectionsByType", next, { shouldDirty: true });

  const toggleType = (type: ExpertiseType) => {
    setActiveType((prev) => (prev === type ? null : type));
  };

  const toggleOpo = (opo: string) => {
    if (!activeType) return;
    const current = selections[activeType] ?? [];
    const nextOpos = current.includes(opo) ? current.filter((x) => x !== opo) : [...current, opo];
    setSelections({ ...selections, [activeType]: nextOpos });
  };

  const activeOpos = activeType ? (selections[activeType] ?? []) : [];

  const resultCodes = Object.entries(selections).flatMap(([type, opos]) =>
    opos.flatMap((opo) => TABLE[opo]?.[type as ExpertiseType] ?? []),
  );

  const HelpTrigger = (
    <button type="button" className={s.helpTrigger} onClick={onShowHelp}>
      (Что это?)
    </button>
  );

  return (
    <>
      <section className={base.section}>
        <span className={base.label}>
          Выберите основной(-ые) объект(-ы) экспертизы
          {HelpTrigger}
        </span>

        <div className={s.row}>
          {TYPES.map((type) => {
            const active = activeType === type;
            const hasSelections = (selections[type]?.length ?? 0) > 0;
            return (
              <button
                key={type}
                type="button"
                className={`${s.mainBadge} ${s[TYPE_COLOR[type]]} ${active || hasSelections ? s.active : ""}`}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            );
          })}
        </div>
      </section>

      <section className={base.section}>
        <span className={base.label}>
          Выберите тип(-ы) опасных производственных объектов
          {HelpTrigger}
        </span>

        <div className={s.opoRows}>
          {OPO_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className={s.row}>
              {row.map((code) => {
                const active = activeOpos.includes(code);
                const enabled = activeType !== null && Boolean(TABLE[code]?.[activeType]);
                return (
                  <button
                    key={code}
                    type="button"
                    className={`${s.opoBadge} ${active ? s.active : ""} ${enabled ? "" : s.disabled}`}
                    onClick={() => toggleOpo(code)}
                    disabled={!enabled}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {resultCodes.length > 0 && (
        <section className={base.section}>
          <span className={base.label}>Будут добавлены к заказу</span>
          <div className={s.resultRow}>
            {resultCodes.map((code) => (
              <span key={code} className={s.resultChip}>
                {code}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
