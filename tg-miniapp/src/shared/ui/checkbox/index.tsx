import { type ReactNode } from "react";
import cn from "classnames";
import { CheckIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

export function Checkbox({ checked, onChange, children }: Props) {
  return (
    <label className={s.wrap}>
      <input type="checkbox" className={s.native} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={cn(s.box, { [s.on]: checked })}>{checked && <CheckIcon width={14} height={14} />}</span>
      <span className={s.label}>{children}</span>
    </label>
  );
}
