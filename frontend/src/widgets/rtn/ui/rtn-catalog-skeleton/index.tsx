import { RtnCardSkeleton } from "@/entities/rtn";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет размеры выдачи и фильтров во время серверной загрузки каталога. */
export function RtnCatalogSkeleton() {
  return (
    <>
      <ul className={styles.list}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <RtnCardSkeleton key={key} />
        ))}
      </ul>

      <aside
        className={styles.filters}
        aria-hidden="true"
      >
        <Skeleton
          className={styles.filtersTitle}
          rounded="md"
        />
        {[1, 2, 3, 4].map((key) => (
          <Skeleton
            key={key}
            className={styles.filtersRow}
            rounded="md"
          />
        ))}
      </aside>
    </>
  );
}
