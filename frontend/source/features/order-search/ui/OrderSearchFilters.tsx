"use client";

import type { PublicOrderSearchFilters } from "@/source/entities/order";
import { useTouchScrollGuard } from "../model/useTouchScrollGuard";
import { EngineeringWorkFilter } from "./EngineeringWorkFilter";
import { ExpertiseFilter } from "./ExpertiseFilter";
import s from "./OrderSearchFilters.module.scss";

interface Props {
  onClose: () => void;
  onSelect: (filters: PublicOrderSearchFilters, label: string) => void;
}

export function OrderSearchFilters({ onClose, onSelect }: Props) {
  const touchScrollGuard = useTouchScrollGuard();

  return (
    <>
      <button type="button" className={s.mobileBackdrop} aria-label="Закрыть фильтры" onClick={onClose} />
      <div
        className={s.panel}
        {...touchScrollGuard}
      >
        <div className={s.mobileHead}>
          <strong>Направление работ</strong>
          <button type="button" onClick={onClose} aria-label="Закрыть">×</button>
        </div>

        <div className={s.columns}>
          <ExpertiseFilter onSelect={onSelect} />
          <EngineeringWorkFilter onSelect={onSelect} />
        </div>
      </div>
    </>
  );
}
