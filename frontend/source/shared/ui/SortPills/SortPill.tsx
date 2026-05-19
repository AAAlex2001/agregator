"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { SortPillCloseIcon } from "./SortPillCloseIcon";
import s from "./SortPill.module.scss";

export type SortDir = "asc" | "desc";

export interface SortPillSpec<K extends string> {
  key: K;
  label: string;
  ascLabel: string;
  descLabel: string;
}

interface Props<K extends string> {
  pill: SortPillSpec<K>;
  sortBy: K | null;
  sortDir: SortDir | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (sortBy: K | null, sortDir: SortDir | null) => void;
}

export function SortPill<K extends string>({
  pill,
  sortBy,
  sortDir,
  isOpen,
  onToggle,
  onClose,
  onChange,
}: Props<K>) {
  const isActive = sortBy === pill.key;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCoords(null);
      return;
    }
    const update = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.left });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen]);

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
        ref={buttonRef}
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

      {isOpen && coords && typeof document !== "undefined" && createPortal(
        <div
          className={s.menu}
          style={{ position: "fixed", top: coords.top, left: coords.left }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Option checked={checkedDefault} onClick={pickDefault} text="По умолчанию" />
          <Option checked={checkedDesc}    onClick={pickDesc}    text={pill.descLabel} />
          <Option checked={checkedAsc}     onClick={pickAsc}     text={pill.ascLabel} />
        </div>,
        document.body,
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
