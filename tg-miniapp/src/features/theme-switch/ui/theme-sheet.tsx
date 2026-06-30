import cn from "classnames";
import { BottomSheet } from "@/shared/ui";
import { CheckIcon } from "@/shared/ui/icons/interface";
import { getThemePref, setThemePref, tapHaptic, type ThemePref } from "@/shared/services/telegram";
import s from "./theme-sheet.module.scss";

const OPTIONS: { code: ThemePref; label: string }[] = [
  { code: "auto", label: "Системная" },
  { code: "light", label: "Светлая" },
  { code: "dark", label: "Тёмная" },
];

export function ThemeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const current = getThemePref();
  return (
    <BottomSheet open={open} title="Тема оформления" onClose={onClose}>
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          className={cn(s.item, { [s.active]: o.code === current })}
          onClick={() => {
            tapHaptic();
            setThemePref(o.code);
            onClose();
          }}
        >
          <span className={s.name}>{o.label}</span>
          {o.code === current && (
            <span className={s.check}>
              <CheckIcon width={18} height={18} />
            </span>
          )}
        </button>
      ))}
    </BottomSheet>
  );
}
