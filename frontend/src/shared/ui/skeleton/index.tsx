import cn from "classnames";
import styles from "./style.module.scss";

/** Размеры через CSS-класс и форма скругления заглушки загрузки. */
interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "pill";
}

/** Занимает место загружаемого содержимого и показывает анимированную заглушку. */
export function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
  return (
    <span
      className={cn(styles.skeleton, styles[rounded], className)}
      aria-hidden="true"
    />
  );
}
