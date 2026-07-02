import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface Props {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, active, onChange }: Props) {
  return (
    <div className={s.tabs}>
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          className={cn(s.tab, { [s.on]: t.id === active })}
          onClick={() => {
            tapHaptic();
            onChange(t.id);
          }}
        >
          {t.label}
          {t.count != null && t.count > 0 && <span className={s.count}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
