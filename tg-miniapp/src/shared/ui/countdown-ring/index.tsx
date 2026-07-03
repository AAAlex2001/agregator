import { useEffect, useState } from "react";
import cn from "classnames";
import { FULL_MS, countdownLabel, countdownTone, deadlineTime } from "@/shared/lib/countdown";
import s from "./style.module.scss";

const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  deadline: string;
  from?: string;
}

export function CountdownRing({ deadline, from }: Props) {
  const target = deadlineTime(deadline);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, target - now);
  const start = from ? deadlineTime(from) : target - FULL_MS;
  const total = Math.max(target - start, 1);
  const fraction = Math.min(1, Math.max(0, remaining / total));

  return (
    <div className={cn(s.ring, s[countdownTone(remaining)])}>
      <svg className={s.svg} viewBox="0 0 60 60">
        <circle className={s.track} cx="30" cy="30" r={RADIUS} />
        <circle
          className={s.arc}
          cx="30"
          cy="30"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>
      <span className={s.label}>{countdownLabel(remaining)}</span>
      <span className={s.shine} />
    </div>
  );
}
