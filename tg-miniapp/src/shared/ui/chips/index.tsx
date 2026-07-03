import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

interface Props {
  options: { key: string; label: string }[];
  value: string[];
  onToggle: (key: string) => void;
}

export function Chips({ options, value, onToggle }: Props) {
  return (
    <div className={s.wrap}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          className={cn(s.chip, { [s.on]: value.includes(option.key) })}
          onClick={() => {
            tapHaptic();
            onToggle(option.key);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
