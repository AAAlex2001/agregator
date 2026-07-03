import { useEffect, useState } from "react";
import cn from "classnames";
import { FULL_MS, HOUR, countdownLabel, countdownTone, deadlineTime } from "@/shared/lib/countdown";
import s from "./style.module.scss";

interface Props {
  deadline: string;
  from?: string;
  label: string;
}

export function CountdownBar({ deadline, from, label }: Props) {
  const target = deadlineTime(deadline);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, target - now);
  const start = from ? deadlineTime(from) : target - FULL_MS;
  const total = Math.max(target - start, HOUR);
  const fraction = Math.min(1, Math.max(0, remaining / total));

  return (
    <div className={cn(s.wrap, s[countdownTone(remaining)])}>
      <div className={s.head}>
        <span className={s.lab}>{label}</span>
        <span className={s.time}>{countdownLabel(remaining)}</span>
      </div>
      <div className={s.track}>
        <div className={s.fill} style={{ width: `${fraction * 100}%` }} />
      </div>
    </div>
  );
}
