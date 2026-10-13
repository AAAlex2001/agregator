import type { RtnList, RtnTaxonomy } from "@/source/entities/rtn";
import { CatalogFilters } from "@/source/features/rtn/catalog-filters";
import { CatalogResults } from "@/source/features/rtn/catalog-results";

interface RtnCatalogResultsProps {
  initial: RtnList;
  taxonomy: RtnTaxonomy;
  filters: string;
  page: number;
  basePath: string;
  nextPageHref?: string;
}

/** Выдача и панель фильтров. При смене фильтров или страницы выдача создаётся заново, панель остаётся как была. */
export function RtnCatalogResults({ initial, taxonomy, filters, page, basePath, nextPageHref }: RtnCatalogResultsProps) {
  return (
    <>
      <CatalogResults
        key={`${filters}#${page}`}
        initial={initial}
        filters={filters}
        basePath={basePath}
        nextPageHref={nextPageHref}
      />
      <CatalogFilters taxonomy={taxonomy} />
    </>
  );
}
