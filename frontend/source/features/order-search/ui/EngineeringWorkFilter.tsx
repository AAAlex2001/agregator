"use client";

import { useState } from "react";
import {
  ORDER_WORK_OPTIONS,
  type OrderWorkType,
  type PublicOrderSearchFilters,
} from "@/source/entities/order";
import { WorkTypeIcon } from "./WorkTypeIcon";
import s from "./EngineeringWorkFilter.module.scss";

interface Props {
  onSelect: (filters: PublicOrderSearchFilters, label: string) => void;
}

export function EngineeringWorkFilter({ onSelect }: Props) {
  const [activeWorkType, setActiveWorkType] = useState<Exclude<OrderWorkType, "EXPERTISE"> | null>(null);
  const activeOption = ORDER_WORK_OPTIONS.find((option) => option.value === activeWorkType);

  const hasDesktopHover = () =>
    window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;

  const openFromClick = (workType: Exclude<OrderWorkType, "EXPERTISE">) => {
    if (!hasDesktopHover()) setActiveWorkType(workType);
  };

  const choose = (option: (typeof ORDER_WORK_OPTIONS)[number]) => {
    onSelect({ workType: option.value }, option.label);
  };

  return (
    <section className={s.workColumn} aria-label="Иная инженерная работа">
      <span className={s.srOnly}>Иная инженерная работа</span>
      <div className={s.workGrid}>
        {ORDER_WORK_OPTIONS.map((option) => {
          const isActive = activeWorkType === option.value;
          const detailId = `engineering-work-${option.value.toLowerCase()}`;

          return (
            <div key={option.value} className={s.workItem}>
              <button
                type="button"
                className={`${s.workButton} ${isActive ? s.workButtonActive : ""}`}
                aria-expanded={isActive}
                aria-controls={`${detailId} ${detailId}-mobile`}
                onClick={() => openFromClick(option.value)}
              >
                <span className={s.workIcon}><WorkTypeIcon type={option.value} /></span>
                <span className={s.workText}><strong>{option.label}</strong></span>
              </button>

              <div id={detailId} className={s.workPopover}>
                <button
                  type="button"
                  className={s.workChoice}
                  onClick={() => choose(option)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeOption && (
        <div
          id={`engineering-work-${activeOption.value.toLowerCase()}-mobile`}
          className={s.mobileWorkDetail}
        >
          <button
            type="button"
            className={s.mobileWorkChoice}
            onClick={() => choose(activeOption)}
          >
            <strong>{activeOption.label}</strong>
            <span>{activeOption.description}</span>
          </button>
        </div>
      )}
    </section>
  );
}
