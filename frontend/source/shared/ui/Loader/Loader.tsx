import cn from "classnames";
import styles from "./loader.module.scss";
import type { CSSProperties } from "react";

type LoaderSize = "sm" | "md" | "lg";

type LoaderProps = {
  className?: string;
  label?: string;
  ariaLabel?: string;
  size?: LoaderSize;
};

const sizeMap: Record<LoaderSize, number> = {
  sm: 20,
  md: 28,
  lg: 40,
};

export default function Loader({
  className,
  label = "Загрузка…",
  ariaLabel,
  size = "md",
}: LoaderProps) {
  const px = sizeMap[size];

  return (
    <div
      className={cn(styles.root, className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <span className={styles.spinner} style={{ "--loader-size": `${px}px` } as CSSProperties} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
