import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  TYPES,
  TypeBadge,
  cell,
  computeBadgeCodes,
  type ExpertiseType,
} from "@/source/entities/expertise";
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

  const resultCodes = Array.from(
    new Set(
      Object.entries(selections).flatMap(([type, opos]) =>
        computeBadgeCodes([type as ExpertiseType], opos),
      ),
    ),
  );

  const HelpTrigger = (
    <button type="button" className={s.helpTrigger} onClick={onShowHelp}>
      (Что это?)
    </button>
  );

  return (
    <>
      <div className={s.requirementsGroup}>
        <h3 className={s.requirementsTitle}>Буквенно-цифровые обозначения областей аттестации исполнителей в области промышленной безопасности</h3>

        <section className={base.section}>
          <span className={base.label}>
            Выберите основной(-ые) объект(-ы) экспертизы
            {HelpTrigger}
          </span>

          <div className={s.row}>
            {TYPES.map((type) => (
              <TypeBadge
                key={type}
                type={type}
                active={activeType === type || (selections[type]?.length ?? 0) > 0}
                onClick={() => toggleType(type)}
              />
            ))}
          </div>
        </section>

        <section className={base.section}>
          <span className={base.label}>
            Выберите область(-и) аттестации исполнителя(-ов)
            {HelpTrigger}
          </span>

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
        </section>
      </div>

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
