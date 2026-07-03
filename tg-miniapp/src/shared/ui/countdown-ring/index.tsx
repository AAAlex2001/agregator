import { useEffect, useState } from "react";
import cn from "classnames";
import { FULL_MS, HOUR, countdownLabel, countdownTone, deadlineTime } from "@/shared/lib/countdown";
import s from "./style.module.scss";

const SIZE = 68;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

export function CountdownRing({ deadline, from }: { deadline: string; from?: string }) {
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
  const offset = CIRC * (1 - fraction);

  return (
    <span className={cn(s.ring, s[countdownTone(remaining)])}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle className={s.track} cx={CENTER} cy={CENTER} r={RADIUS} strokeWidth={STROKE} fill="none" />
        <circle
          className={s.progress}
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      </svg>
      <span className={s.label}>{countdownLabel(remaining)}</span>
    </span>
  );
}
