import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

interface ToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function Toggle({ on, onChange, disabled = false, ariaLabel = "Переключатель" }: ToggleProps) {
  return (
    <button
      type="button"
      className={cn(s.toggle, { [s.on]: on })}
      disabled={disabled}
      onClick={() => {
        tapHaptic();
        onChange(!on);
      }}
      aria-pressed={on}
      aria-label={ariaLabel}
    >
      <span className={s.knob} />
    </button>
  );
}
