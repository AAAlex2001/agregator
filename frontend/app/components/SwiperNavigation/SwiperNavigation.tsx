"use client";

import styles from "./swiper-navigation.module.scss";
import { ArrowIcon } from "@/app/icons";

interface SwiperNavigationProps {
  prevClassName: string;
  nextClassName: string;
  className?: string;
  children?: React.ReactNode;
}

const SwiperNavigation = ({
  prevClassName,
  nextClassName,
  className = "",
  children,
}: SwiperNavigationProps) => {
  return (
    <div className={`${styles.navigation} ${className}`}>
      {children}
      <button
        className={`${styles.navBtn} ${styles.prev} ${prevClassName}`}
        type="button"
        aria-label="Предыдущий"
      >
        <span>
          <ArrowIcon color="#FFDDA9" />
        </span>
      </button>

      <button
        className={`${styles.navBtn} ${styles.next} ${nextClassName}`}
        type="button"
        aria-label="Следующий"
      >
        <span>
          <ArrowIcon color="#FFDDA9" />
        </span>
      </button>
    </div>
  );
};

export default SwiperNavigation;
