import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Фильтры и карта направления с необязательной высотой от страницы. */
interface DirectionMapLayoutProps {
  filters?: ReactNode;
  map: ReactNode;
  height?: number | string;
}

/** Располагает списки фильтров над картой исполнителей. */
export function DirectionMapLayout({
  filters,
  map,
  height,
}: DirectionMapLayoutProps) {
  return (
    <div className={styles.layout}>
      {filters && (
        <div className={styles.filters}>
          {filters}
        </div>
      )}

      <div
        className={styles.mapBox}
        style={height === undefined ? undefined : { height }}
      >
        {map}
      </div>
    </div>
  );
}

