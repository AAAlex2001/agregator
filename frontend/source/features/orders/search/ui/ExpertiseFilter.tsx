"use client";

import cn from "classnames";
import { useState, type PointerEvent } from "react";
import {
  OPO_ROWS,
  TABLE,
  TYPES,
  TypeBadge,
  cell,
  type ExpertiseType,
} from "@/source/entities/expertise";
import s from "./ExpertiseFilter.module.scss";

interface ExpertiseFilterProps {
  onSelect: (badgeCode: string, label: string) => void;
}

const OPO_CODES = OPO_ROWS.flat();
const enabledTypes = (opo: string): ExpertiseType[] => TYPES.filter((type) => cell(opo, type).length > 0);

export function ExpertiseFilter({ onSelect }: ExpertiseFilterProps) {
  const [activeOpo, setActiveOpo] = useState<string | null>(null);

  const hasDesktopHover = () =>
    window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;

  const openFromPointer = (event: PointerEvent<HTMLElement>, opo: string) => {
    if (event.pointerType === "mouse" && hasDesktopHover()) setActiveOpo(opo);
  };

  const closeFromPointer = (event: PointerEvent<HTMLElement>, opo: string) => {
    if (event.pointerType !== "mouse" || !hasDesktopHover()) return;
    setActiveOpo((current) => current === opo ? null : current);
  };

  const choose = (opo: string, type: ExpertiseType) => {
    const badgeCode = cell(opo, type)[0];
    if (badgeCode) onSelect(badgeCode, badgeCode);
  };

  return (
    <section className={s.expertiseColumn} aria-label="Экспертиза">
      <span className={s.srOnly}>Экспертиза</span>
      <div className={s.opoGrid}>
        {OPO_CODES.map((opo) => (
          <div
            key={opo}
            className={cn(s.opoItem, { [s.opoItemActive]: activeOpo === opo })}
            onPointerEnter={(event) => openFromPointer(event, opo)}
            onPointerLeave={(event) => closeFromPointer(event, opo)}
          >
            <button
              type="button"
              className={cn(s.opoButton, { [s.opoButtonActive]: activeOpo === opo })}
              aria-expanded={activeOpo === opo}
              onClick={() => setActiveOpo(opo)}
            >
              Э{opo}
            </button>

            {activeOpo === opo && (
              <div className={s.expertisePopover}>
                <div className={s.expertisePopoverCard}>
                  <strong>Э{opo}</strong>
                  <span>{TABLE[opo]?.name}</span>
                  <div className={s.typeRow}>
                    {enabledTypes(opo).map((type) => (
                      <TypeBadge key={type} type={type} onClick={() => choose(opo, type)} />
                    ))}
                  </div>
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
