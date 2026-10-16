import type { ReactNode } from "react";
import type { LandingNavigationItem } from "../../model/types";
import styles from "./style.module.scss";

/** Описание направления и соответствующая карта специалистов. */
interface NavigationMapProps {
  item: LandingNavigationItem;
  children: ReactNode;
}

/** Сохраняет подпись и размер карты в навигации направлений. */
export function NavigationMap({ item, children }: NavigationMapProps) {
  return (
    <div className={styles.mapVisual}>
      <p className={styles.mapText}>{item.text}</p>
      <div
        className={item.direction === "DESIGN" ? styles.mapBoxAuto : styles.mapBox}
      >
        {children}
      </div>
    </div>
  );
}
