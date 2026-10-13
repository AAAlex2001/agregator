"use client";

import cn from "classnames";
import type { ReactNode } from "react";
import { Checkbox } from "@/source/shared/ui";
import s from "./DirectionOption.module.scss";

interface DirectionOptionProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  note?: string;
  children?: ReactNode;
}

/** Направление в списке: галочка, описание и, когда выбрано, поля анкеты под ним. */
export function DirectionOption({ id, title, description, checked, onToggle, note, children }: DirectionOptionProps) {
  return (
    <li className={cn(s.item, { [s.itemActive]: checked })}>
      <Checkbox id={`direction-${id}`} checked={checked} onChange={onToggle} className={s.checkbox}>
        <span className={s.title}>{title}</span>
        <span className={s.text}>{description}</span>
      </Checkbox>

      {checked && (
        <div className={s.body}>
          {children}
          {note && <span className={s.text}>{note}</span>}
        </div>
      )}
    </li>
  );
}
