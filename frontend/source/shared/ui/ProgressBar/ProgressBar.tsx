import cn from "classnames";
import s from "./ProgressBar.module.scss";

interface Props {
  percent: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ percent, label, className }: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const text = label ?? `${clamped}%`;
  return (
    <div className={cn(s.track, className)} role="progressbar"
         aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped}>
      <div className={s.fill} style={{ width: `${clamped}%` }} />
      <span className={s.text}>{text}</span>
    </div>
  );
}
