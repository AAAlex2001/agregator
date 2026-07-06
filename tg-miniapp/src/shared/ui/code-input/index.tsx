import cn from "classnames";
import s from "./style.module.scss";

export const CODE_LENGTH = 6;

interface Props {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export function CodeInput({ length = CODE_LENGTH, value, onChange }: Props) {
  const digits = value.split("");

  return (
    <div className={s.wrap}>
      {Array.from({ length }).map((_, i) => (
        <span key={i} className={cn(s.box, { [s.filled]: i < value.length, [s.active]: i === value.length })}>
          {digits[i] ?? ""}
        </span>
      ))}
      <input
        className={s.input}
        value={value}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
      />
    </div>
  );
}
