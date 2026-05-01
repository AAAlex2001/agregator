"use client";

import s from "./SortPill.module.scss";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { SortPillCloseIcon } from "./SortPillCloseIcon";
import type { CustomerSortBy, SortDir } from "@/source/entities/response";

export interface PillSpec {
  key: CustomerSortBy;
  label: string;
  ascLabel: string;
  descLabel: string;
}

interface Props {
  pill: PillSpec;
  sortBy: CustomerSortBy | null;
  sortDir: SortDir | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (sortBy: CustomerSortBy | null, sortDir: SortDir | null) => void;
}

export function SortPill({ pill, sortBy, sortDir, isOpen, onToggle, onClose, onChange }: Props) {
  const isActive = sortBy === pill.key;

  const reset = () => onChange(null, null);
  const pickDefault = () => { reset(); onClose(); };
  const pickDesc = () => { onChange(pill.key, "desc"); onClose(); };
  const pickAsc  = () => { onChange(pill.key, "asc");  onClose(); };

  const checkedDefault = !isActive;
  const checkedDesc = isActive && sortDir === "desc";
  const checkedAsc  = isActive && sortDir === "asc";
  const showActiveStyle = isActive || isOpen;

  return (
    <div className={s.wrap}>
      <button
        type="button"
        className={`${s.pill} ${showActiveStyle ? s.pillActive : ""}`}
        onClick={onToggle}
      >
        <span>{pill.label}</span>
        {isActive ? (
          <span
            className={s.close}
            role="button"
            onClick={(e) => { e.stopPropagation(); reset(); }}
          >
            <SortPillCloseIcon />
          </span>
        ) : (
          <ChevronIcon className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`} color="#1E1E1E" />
        )}
      </button>

      {isOpen && (
        <div className={s.menu}>
          <Option checked={checkedDefault} onClick={pickDefault} text="По умолчанию" />
          <Option checked={checkedDesc}    onClick={pickDesc}    text={pill.descLabel} />
          <Option checked={checkedAsc}     onClick={pickAsc}     text={pill.ascLabel} />
        </div>
      )}
    </div>
  );
}

function Option({ checked, onClick, text }: { checked: boolean; onClick: () => void; text: string }) {
  return (
    <button type="button" className={s.option} onClick={onClick}>
      <span className={`${s.radio} ${checked ? s.radioChecked : ""}`}>
        {checked && <span className={s.radioDot} />}
      </span>
      <span className={s.optionText}>{text}</span>
    </button>
  );
}
