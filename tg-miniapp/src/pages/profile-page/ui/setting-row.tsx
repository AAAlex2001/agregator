import cn from "classnames";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./setting-row.module.scss";

interface Props {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  onClick?: () => void;
  action?: ReactNode;
  danger?: boolean;
}

export function SettingRow({ icon, label, value, onClick, action, danger }: Props) {
  const className = cn(s.row, { [s.danger]: danger });
  const content = (
    <>
      <span className={s.rowIcon}>{icon}</span>
      <span className={s.rowLabel}>{label}</span>
      {value != null && <span className={s.rowValue}>{value}</span>}
      {action ?? (onClick && <ChevronRightIcon className={s.rowChev} width={18} height={18} />)}
    </>
  );

  if (!onClick) return <div className={className}>{content}</div>;

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        tapHaptic();
        onClick();
      }}
    >
      {content}
    </button>
  );
}
