"use client";

import { TYPE_COLOR, type ExpertiseType } from "../model/data";
import s from "./TypeBadge.module.scss";

interface Props {
  type: ExpertiseType;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function TypeBadge({ type, active = false, disabled = false, onClick }: Props) {
  const className = `${s.badge} ${s[TYPE_COLOR[type]]} ${active ? s.active : ""} ${
    disabled ? s.disabled : ""
  }`;

  if (!onClick) {
    return <span className={className}>{type}</span>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {type}
    </button>
  );
}
