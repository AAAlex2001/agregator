import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ChipProps = {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

/** Чип-переключатель: с onClick это кнопка, подсвеченная при active, иначе — просто метка. */
const Chip = ({ children, active, onClick, className }: ChipProps) => {
  const classNames = cn(styles.chip, active && styles.active, className);

  if (onClick) {
    return (
      <button type="button" className={classNames} aria-pressed={active} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <span className={classNames}>{children}</span>;
};

export default Chip;
