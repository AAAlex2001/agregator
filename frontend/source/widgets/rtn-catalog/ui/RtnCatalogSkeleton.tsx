import { RtnCardSkeleton } from "@/source/entities/rtn-clarification";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./RtnCatalogWidget.module.scss";

const CARDS_COUNT = 6;
const FILTER_ROWS_COUNT = 4;

export function RtnCatalogSkeleton() {
  return (
    <>
      <div className={s.results}>
        <ul className={s.grid}>
          {Array.from({ length: CARDS_COUNT }, (_, index) => (
            <RtnCardSkeleton key={index} />
          ))}
        </ul>
      </div>

      <aside className={s.filtersSkeleton} aria-hidden="true">
        <Skeleton className={s.filtersSkeletonTitle} rounded="md" />
        {Array.from({ length: FILTER_ROWS_COUNT }, (_, index) => (
          <Skeleton key={index} className={s.filtersSkeletonRow} rounded="md" />
        ))}
      </aside>
    </>
  );
}
