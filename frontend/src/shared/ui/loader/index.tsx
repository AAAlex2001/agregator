import cn from "classnames";
import type { CSSProperties } from "react";
import styles from "./style.module.scss";

/** Размер индикатора и подписи для пользователя и скринридера. */
interface LoaderProps {
  className?: string;
  label?: string;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
}

/** Диаметр индикатора в пикселях для каждого размера. */
const LOADER_SIZES = {
  sm: 20,
  md: 28,
  lg: 40,
};

/** Индикатор загрузки с необязательной текстовой подписью. */
export function Loader({
  className,
  label = "Загрузка…",
  ariaLabel,
  size = "md",
}: LoaderProps) {
  const spinnerStyle: CSSProperties = {
    "--loader-size": `${LOADER_SIZES[size]}px`,
  } as CSSProperties;

  return (
    <div
      className={cn(styles.root, className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <span
        className={styles.spinner}
        style={spinnerStyle}
      />

      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
