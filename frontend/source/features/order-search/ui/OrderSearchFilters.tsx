"use client";

import { useMemo, useState } from "react";
import {
  ORDER_WORK_OPTIONS,
  type OrderWorkType,
  type PublicOrderSearchFilters,
} from "@/source/entities/order";
import {
  OPO_ROWS,
  TABLE,
  TYPES,
  TypeBadge,
  cell,
  type ExpertiseType,
} from "@/source/entities/expertise";
import { WorkTypeIcon } from "./WorkTypeIcon";
import s from "./OrderSearchFilters.module.scss";

interface Props {
  onClose: () => void;
  onSelect: (filters: PublicOrderSearchFilters, label: string) => void;
}

const OPO_CODES = OPO_ROWS.flat();

function enabledTypes(opo: string): ExpertiseType[] {
  return TYPES.filter((type) => cell(opo, type).length > 0);
}

export function OrderSearchFilters({ onClose, onSelect }: Props) {
  const [activeOpo, setActiveOpo] = useState<string | null>(null);
  const activeTypes = useMemo(() => (activeOpo ? enabledTypes(activeOpo) : []), [activeOpo]);

  const chooseExpertise = (opo: string, type: ExpertiseType) => {
    const badgeCode = cell(opo, type)[0];
    if (!badgeCode) return;
    onSelect({ workType: "EXPERTISE", badgeCode }, badgeCode);
  };

  const chooseWork = (workType: OrderWorkType, label: string) => {
    onSelect({ workType }, label);
  };

  return (
    <>
      <button type="button" className={s.mobileBackdrop} aria-label="Закрыть фильтры" onClick={onClose} />
      <div className={s.panel} onMouseDown={(event) => event.preventDefault()}>
        <div className={s.mobileHead}>
          <strong>Направление работ</strong>
          <button type="button" onClick={onClose} aria-label="Закрыть">×</button>
        </div>

        <div className={s.columns}>
          <section className={s.expertiseColumn} aria-label="Экспертиза">
            <span className={s.srOnly}>Экспертиза</span>
            <div className={s.opoGrid}>
              {OPO_CODES.map((opo) => (
                <div
                  key={opo}
                  className={s.opoItem}
                  onMouseEnter={() => setActiveOpo(opo)}
                  onMouseLeave={() => setActiveOpo(null)}
                >
                  <button
                    type="button"
                    className={`${s.opoButton} ${activeOpo === opo ? s.opoButtonActive : ""}`}
                    aria-expanded={activeOpo === opo}
                    onFocus={() => setActiveOpo(opo)}
                    onClick={() => setActiveOpo((current) => (current === opo ? null : opo))}
                  >
                    Э{opo}
                  </button>

                  {activeOpo === opo && (
                    <div className={s.expertisePopover}>
                      <strong>Э{opo}</strong>
                      <span>{TABLE[opo]?.name}</span>
                      <div className={s.typeRow}>
                        {enabledTypes(opo).map((type) => (
                          <TypeBadge key={type} type={type} onClick={() => chooseExpertise(opo, type)} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {activeOpo && (
              <div className={s.mobileExpertiseDetail}>
                <strong>Э{activeOpo}</strong>
                <span>{TABLE[activeOpo]?.name}</span>
                <div className={s.typeRow}>
                  {activeTypes.map((type) => (
                    <TypeBadge key={type} type={type} onClick={() => chooseExpertise(activeOpo, type)} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className={s.workColumn} aria-label="Иная инженерная работа">
            <span className={s.srOnly}>Иная инженерная работа</span>
            <div className={s.workGrid}>
              {ORDER_WORK_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={s.workButton}
                  onClick={() => chooseWork(option.value, option.label)}
                >
                  <span className={s.workIcon}>
                    <WorkTypeIcon type={option.value} />
                  </span>
                  <span className={s.workText}>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
