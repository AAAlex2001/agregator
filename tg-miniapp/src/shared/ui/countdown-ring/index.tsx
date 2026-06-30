import { useEffect, useState } from "react";
import cn from "classnames";
import s from "./style.module.scss";

const SIZE = 68;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const FULL_MS = 3 * DAY;
const RED_MS = 6 * HOUR;

function deadlineTime(deadline: string): number {
  if (deadline.includes("T")) return new Date(deadline).getTime();
  const [year, month, day] = deadline.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
}

function label(ms: number): string {
  if (ms <= 0) return "Истёк";
  const minutes = Math.floor(ms / 60000);
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  if (days > 0) return `${days}д ${hours}ч`;
  if (hours > 0) return `${hours}ч ${minutes % 60}м`;
  return `${minutes % 60}м`;
}

function tone(ms: number): "green" | "amber" | "red" {
  if (ms <= RED_MS) return "red";
  if (ms < FULL_MS) return "amber";
  return "green";
}

export function CountdownRing({ deadline }: { deadline: string }) {
  const target = deadlineTime(deadline);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, target - now);
  const fraction = Math.min(1, remaining / FULL_MS);
  const offset = CIRC * (1 - fraction);

  return (
    <span className={cn(s.ring, s[tone(remaining)])}>
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
      <span className={s.label}>{label(remaining)}</span>
    </span>
  );
}
