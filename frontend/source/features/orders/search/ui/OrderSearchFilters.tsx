"use client";

import { useTouchScrollGuard } from "../model/useTouchScrollGuard";
import { ExpertiseFilter } from "./ExpertiseFilter";
import s from "./OrderSearchFilters.module.scss";

interface OrderSearchFiltersProps {
  onClose: () => void;
  onSelect: (badgeCode: string, label: string) => void;
}

export function OrderSearchFilters({ onClose, onSelect }: OrderSearchFiltersProps) {
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

        <ExpertiseFilter onSelect={onSelect} />
      </div>
    </>
  );
}
