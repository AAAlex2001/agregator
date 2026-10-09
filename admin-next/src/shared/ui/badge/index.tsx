import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

/** Метка статуса: тихий фон и цветной текст по тону. */
const Badge = ({ children, tone = "neutral", className }: BadgeProps) => (
  <span className={cn(styles.badge, styles[tone], className)}>{children}</span>
);

export default Badge;
