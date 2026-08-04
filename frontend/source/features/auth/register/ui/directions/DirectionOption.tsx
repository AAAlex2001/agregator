"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/source/shared/ui";
import s from "./DirectionsPicker.module.scss";

interface Props {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  error?: string;
  onToggle: () => void;
  children?: ReactNode;
}

export function DirectionOption({ id, title, description, checked, error, onToggle, children }: Props) {
  return (
    <li
      className={checked ? `${s.item} ${s.itemActive}` : s.item}
      data-invalid={error ? "true" : undefined}
    >
      <Checkbox id={`service-${id}`} checked={checked} onChange={onToggle} className={s.checkbox}>
        <span className={s.itemTitle}>{title}</span>
        <span className={s.itemText}>{description}</span>
      </Checkbox>

      {checked && (
        <div className={s.body}>
          {children}
          {error && <span className={s.error}>{error}</span>}
        </div>
      )}
    </li>
  );
}
