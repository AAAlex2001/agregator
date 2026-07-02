import { type WheelEvent, useEffect, useRef } from "react";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

export type TabItem = { key: string; label: string; badge?: string };

interface Props {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
}

export function Tabs({ tabs, active, onChange }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    const bar = barRef.current;
    if (!bar || bar.scrollWidth <= bar.clientWidth) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    bar.scrollLeft += e.deltaY;
  };

  return (
    <div className={s.tabs} ref={barRef} onWheel={onWheel}>
      {tabs.map((t) => (
        <button
          key={t.key}
          ref={t.key === active ? activeRef : undefined}
          type="button"
          className={cn(s.tab, { [s.active]: t.key === active })}
          onClick={() => {
            tapHaptic();
            onChange(t.key);
          }}
        >
          {t.badge ? <span className={s.badge}>{t.badge}</span> : null}
          {t.label}
        </button>
      ))}
    </div>
  );
}
