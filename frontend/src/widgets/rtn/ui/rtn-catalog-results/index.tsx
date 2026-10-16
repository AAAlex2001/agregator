import { RtnListProvider } from "@/entities/rtn";
import type { RtnList as RtnListPage, RtnTaxonomy } from "@/entities/rtn";
import { RtnFilters } from "@/features/filter-rtn";
import { LoadMoreRtn } from "@/features/load-more-rtn";
import { RtnList } from "../rtn-list";
import styles from "./style.module.scss";

/** Серверная выдача, справочники фильтров и ссылки текущей версии каталога. */
interface RtnCatalogResultsProps {
  initial: RtnListPage;
  taxonomy: RtnTaxonomy;
  filters: string;
  page: number;
  basePath: string;
  nextPageHref?: string;
}

/** Соединяет список и фильтры; новый запрос сбрасывает только состояние выдачи. */
export function RtnCatalogResults({
  initial,
  taxonomy,
  filters,
  page,
  basePath,
  nextPageHref,
}: RtnCatalogResultsProps) {
  return (
    <>
      <RtnListProvider
        key={`${filters}#${page}`}
        initial={initial}
        filters={filters}
      >
        <div className={styles.results}>
          <RtnList
            basePath={basePath}
            isFiltered={Boolean(filters)}
          />
          <LoadMoreRtn nextPageHref={nextPageHref} />
        </div>
      </RtnListProvider>
      <RtnFilters taxonomy={taxonomy} />
    </>
  );
}
