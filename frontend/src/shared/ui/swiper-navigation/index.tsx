import cn from "classnames";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Классы кнопок, к которым Swiper подключает переключение слайдов. */
interface SwiperNavigationProps {
  prevClassName: string;
  nextClassName: string;
  className?: string;
  children?: ReactNode;
}

/** Показывает кнопки предыдущего и следующего слайда. */
export function SwiperNavigation({
  prevClassName,
  nextClassName,
  className,
  children,
}: SwiperNavigationProps) {
  return (
    <div className={cn(styles.navigation, className)}>
      {children}

      <button
        className={cn(styles.navBtn, styles.prev, prevClassName)}
        type="button"
        aria-label="Предыдущий"
      >
        <span>
          <ArrowIcon color="var(--color-orange-soft)" />
        </span>
      </button>

      <button
        className={cn(styles.navBtn, styles.next, nextClassName)}
        type="button"
        aria-label="Следующий"
      >
        <span>
          <ArrowIcon color="var(--color-orange-soft)" />
        </span>
      </button>
    </div>
  );
}
