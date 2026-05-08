"use client";

import { TYPES, type ExpertiseType } from "../model/data";
import { TypeBadge } from "./TypeBadge";
import s from "./TypesPicker.module.scss";

interface Props {
  value: ExpertiseType[];
  onChange: (next: ExpertiseType[]) => void;
  label?: string;
  hint?: string;
  error?: string;
}

export function TypesPicker({ value, onChange, label, hint, error }: Props) {
  const toggle = (type: ExpertiseType) => {
    onChange(value.includes(type) ? value.filter((t) => t !== type) : [...value, type]);
  };

  return (
    <div className={s.wrap}>
      {label && <span className={s.label}>{label}</span>}
      {hint && <span className={s.hint}>{hint}</span>}
      <div className={s.row}>
        {TYPES.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            active={value.includes(type)}
            onClick={() => toggle(type)}
          />
        ))}
      </div>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
}
