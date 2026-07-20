"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicOrderSearchFilters } from "@/source/entities/order";
import {
  OPO_ROWS,
  TABLE,
  TYPES,
  TypeBadge,
  cell,
  type ExpertiseType,
} from "@/source/entities/expertise";
import s from "./OrderSearchFilters.module.scss";

interface Props {
  onSelect: (filters: PublicOrderSearchFilters, label: string) => void;
}

const OPO_CODES = OPO_ROWS.flat();
const enabledTypes = (opo: string): ExpertiseType[] => TYPES.filter((type) => cell(opo, type).length > 0);

export function ExpertiseFilter({ onSelect }: Props) {
  const [activeOpo, setActiveOpo] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const openOpo = (opo: string) => {
    cancelClose();
    setActiveOpo(opo);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setActiveOpo(null), 220);
  };

  useEffect(() => () => cancelClose(), []);

  const choose = (opo: string, type: ExpertiseType) => {
    const badgeCode = cell(opo, type)[0];
    if (badgeCode) onSelect({ workType: "EXPERTISE", badgeCode }, badgeCode);
  };

  return (
    <section className={s.expertiseColumn} aria-label="Экспертиза">
      <span className={s.srOnly}>Экспертиза</span>
      <div className={s.opoGrid}>
        {OPO_CODES.map((opo) => (
          <div
            key={opo}
            className={s.opoItem}
            onMouseEnter={() => openOpo(opo)}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              className={`${s.opoButton} ${activeOpo === opo ? s.opoButtonActive : ""}`}
              aria-expanded={activeOpo === opo}
              onFocus={() => openOpo(opo)}
              onClick={() => openOpo(opo)}
            >
              Э{opo}
            </button>

            {activeOpo === opo && (
              <div className={s.expertisePopover} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                <strong>Э{opo}</strong>
                <span>{TABLE[opo]?.name}</span>
                <div className={s.typeRow}>
                  {enabledTypes(opo).map((type) => (
                    <TypeBadge key={type} type={type} onClick={() => choose(opo, type)} />
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
            {enabledTypes(activeOpo).map((type) => (
              <TypeBadge key={type} type={type} onClick={() => choose(activeOpo, type)} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
