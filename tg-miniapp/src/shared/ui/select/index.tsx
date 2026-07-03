import { useState } from "react";
import cn from "classnames";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { CheckIcon, ChevronDownIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

export interface SelectOption {
  key: string;
  label: string;
}

interface Props {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  title?: string;
  placeholder?: string;
  multi?: boolean;
}

export function Select({ options, value, onChange, title, placeholder = "Выберите", multi = false }: Props) {
  const [open, setOpen] = useState(false);

  const choose = (key: string) => {
    tapHaptic();
    if (multi) {
      onChange(value.includes(key) ? value.filter((v) => v !== key) : [...value, key]);
    } else {
      onChange([key]);
      setOpen(false);
    }
  };

  const chosen = options.filter((o) => value.includes(o.key));
  const text = chosen.length ? chosen.map((o) => o.label).join(", ") : placeholder;

  return (
    <>
      <button
        type="button"
        className={cn(s.trigger, { [s.empty]: chosen.length === 0 })}
        onClick={() => {
          tapHaptic();
          setOpen(true);
        }}
      >
        <span className={s.value}>{text}</span>
        <ChevronDownIcon width={18} height={18} className={s.chev} />
      </button>

      <BottomSheet open={open} title={title} onClose={() => setOpen(false)}>
        {options.map((o) => {
          const on = value.includes(o.key);
          return (
            <button key={o.key} type="button" className={cn(s.item, { [s.active]: on })} onClick={() => choose(o.key)}>
              <span className={s.name}>{o.label}</span>
              {on ? (
                <span className={s.check}>
                  <CheckIcon width={18} height={18} />
                </span>
              ) : null}
            </button>
          );
        })}
      </BottomSheet>
    </>
  );
}
