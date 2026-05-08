"use client";

import { type ReactNode } from "react";
import s from "./RadioGroup.module.scss";

export interface RadioOption<V extends string> {
  value: V;
  label: string;
  description?: string;
  trailing?: ReactNode;
}

interface Props<V extends string> {
  name: string;
  value: V;
  options: RadioOption<V>[];
  onChange: (next: V) => void;
  legend?: string;
  className?: string;
}

export function RadioGroup<V extends string>({
  name,
  value,
  options,
  onChange,
  legend,
  className,
}: Props<V>) {
  return (
    <fieldset className={[s.group, className].filter(Boolean).join(" ")}>
      {legend && <legend className={s.legend}>{legend}</legend>}
      <div className={s.options}>
        {options.map((opt) => {
          const checked = opt.value === value;
          return (
            <label key={opt.value} className={`${s.option} ${checked ? s.optionChecked : ""}`}>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className={s.input}
              />
              <span className={s.indicator} aria-hidden="true">
                <span className={s.dot} />
              </span>
              <span className={s.text}>
                <span className={s.label}>{opt.label}</span>
                {opt.description && <span className={s.description}>{opt.description}</span>}
              </span>
              {opt.trailing && <span className={s.trailing}>{opt.trailing}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
