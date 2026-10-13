import { RtnCardSkeleton } from "@/source/entities/rtn";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./RtnCatalogSkeleton.module.scss";

const CARD_KEYS = [1, 2, 3, 4, 5, 6];
const FILTER_ROW_KEYS = [1, 2, 3, 4];

/** Заглушка выдачи и фильтров, пока сервер собирает каталог. */
export function RtnCatalogSkeleton() {
  return (
    <>
      <ul className={s.list}>
        {CARD_KEYS.map((key) => (
          <RtnCardSkeleton key={key} />
        ))}
      </ul>

      <aside className={s.filters} aria-hidden="true">
        <Skeleton className={s.filtersTitle} rounded="md" />
        {FILTER_ROW_KEYS.map((key) => (
          <Skeleton key={key} className={s.filtersRow} rounded="md" />
        ))}
      </aside>
    </>
  );
}
