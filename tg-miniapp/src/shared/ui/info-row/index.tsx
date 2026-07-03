import cn from "classnames";
import s from "./style.module.scss";

interface Props {
  label: string;
  value: string;
  accent?: boolean;
}

export function InfoRow({ label, value, accent = false }: Props) {
  return (
    <div className={s.row}>
      <span className={s.label}>{label}</span>
      <span className={cn(s.value, { [s.accent]: accent })}>{value}</span>
    </div>
  );
}
