"use client";

import { Checkbox } from "@/source/shared/ui/Checkbox";
import { useDirectionMarks } from "../model/useDirectionMarks";
import s from "./DirectionMarks.module.scss";

/** Список направлений без анкеты: галочка «работаю по этому направлению» сохраняется сразу. */
export function DirectionMarks() {
  const { options, checked, toggle } = useDirectionMarks();

  return (
    <div className={s.marks}>
      <span className={s.hint}>
        Отметьте направления, по которым работаете, — сохраняются сразу, анкеты для них не нужны.
      </span>

      <ul className={s.list}>
        {options.map((option) => (
          <li key={option.value} className={s.item}>
            <Checkbox
              id={`direction-mark-${option.value.toLowerCase()}`}
              checked={checked.includes(option.value)}
              onChange={() => toggle(option.value)}
            >
              <span className={s.title}>{option.label}</span>
              <span className={s.text}>{option.description}</span>
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
}
