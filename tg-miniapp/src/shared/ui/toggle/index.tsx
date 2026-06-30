import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

export function Toggle({ on, onChange }: { on: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      className={cn(s.toggle, { [s.on]: on })}
      onClick={() => {
        tapHaptic();
        onChange(!on);
      }}
      aria-pressed={on}
      aria-label="Переключатель"
    >
      <span className={s.knob} />
    </button>
  );
}
