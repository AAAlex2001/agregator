import { useEffect, useRef, useState } from "react";
import cn from "classnames";
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
  placeholder?: string;
  multi?: boolean;
}

export function Select({ options, value, onChange, placeholder = "Выберите", multi = false }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

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
    <div className={s.wrap} ref={ref}>
      <button
        type="button"
        className={cn(s.trigger, { [s.empty]: chosen.length === 0 })}
        onClick={() => {
          tapHaptic();
          setOpen((v) => !v);
        }}
      >
        <span className={s.value}>{text}</span>
        <ChevronDownIcon width={18} height={18} className={cn(s.chev, { [s.chevOpen]: open })} />
      </button>

      {open ? (
        <ul className={s.list}>
          {options.map((o) => {
            const on = value.includes(o.key);
            return (
              <li key={o.key}>
                <button type="button" className={cn(s.option, { [s.on]: on })} onClick={() => choose(o.key)}>
                  <span>{o.label}</span>
                  {on ? <CheckIcon width={16} height={16} className={s.check} /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
