import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет место карточки разъяснения во время загрузки каталога. */
export function RtnCardSkeleton() {
  return (
    <li
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.top}>
        <Skeleton
          className={styles.type}
          rounded="pill"
        />
        <Skeleton
          className={styles.status}
          rounded="pill"
        />
      </div>
      <Skeleton
        className={styles.titleLine}
        rounded="md"
      />
      <Skeleton
        className={styles.titleLineShort}
        rounded="md"
      />
      <Skeleton
        className={styles.excerptLine}
        rounded="sm"
      />
      <Skeleton
        className={styles.excerptLineShort}
        rounded="sm"
      />
      <Skeleton
        className={styles.meta}
        rounded="pill"
      />
    </li>
  );
}
