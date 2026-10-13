"use client";

import cn from "classnames";
import { type ReactNode } from "react";
import s from "./RadioGroup.module.scss";
import checkbox from "../Checkbox/checkbox.module.scss";

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
  variant?: "default" | "checklist";
}

export function RadioGroup<V extends string>({
  name,
  value,
  options,
  onChange,
  legend,
  className,
  variant = "default",
}: Props<V>) {
  return (
    <fieldset className={cn(s.group, { [s.checklist]: variant === "checklist" }, className)}>
      {legend && <legend className={s.legend}>{legend}</legend>}
      <div className={s.options}>
        {options.map((opt) => {
          const checked = opt.value === value;
          return (
            <label key={opt.value} className={cn(s.option, { [s.optionChecked]: checked })}>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className={cn(s.input, { [checkbox.input]: variant === "checklist" })}
              />
              {variant === "checklist" ? (
                <span className={checkbox.box} aria-hidden="true">
                  <svg className={checkbox.check} viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.2L5.7 10L11 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <span className={s.indicator} aria-hidden="true">
                  <span className={s.dot} />
                </span>
              )}
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
