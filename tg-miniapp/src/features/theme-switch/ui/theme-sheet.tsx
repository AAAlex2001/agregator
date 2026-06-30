import type { ComponentType, SVGProps } from "react";
import cn from "classnames";
import { BottomSheet } from "@/shared/ui";
import { MonitorIcon, MoonIcon, SunIcon } from "@/shared/ui/icons/interface";
import { getThemePref, setThemePref, tapHaptic, type ThemePref } from "@/shared/services/telegram";
import s from "./theme-sheet.module.scss";

const OPTIONS: { key: ThemePref; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "auto", label: "Системная", Icon: MonitorIcon },
  { key: "light", label: "Светлая", Icon: SunIcon },
  { key: "dark", label: "Тёмная", Icon: MoonIcon },
];

export function ThemeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const current = getThemePref();
  return (
    <BottomSheet open={open} title="Тема оформления" onClose={onClose}>
      <div className={s.list}>
        {OPTIONS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={cn(s.row, { [s.active]: current === key })}
            onClick={() => {
              tapHaptic();
              setThemePref(key);
              onClose();
            }}
          >
            <Icon width={22} height={22} />
            <span>{label}</span>
            <span className={s.spacer} />
            {current === key && <span className={s.dot} />}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
