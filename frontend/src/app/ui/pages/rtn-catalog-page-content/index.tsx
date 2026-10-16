import { RTN_MAX_PAGE, RTN_PAGE_SIZE } from "@/entities/rtn";
import {
  getRtnListOnServer,
  getRtnTaxonomyOnServer,
} from "@/entities/rtn/server";
import { RtnCatalogResults } from "@/widgets/rtn";
import {
  readRtnFilters,
  readRtnPage,
} from "../../../content/rtn-catalog-query";
import type { RtnSearchParams } from "../../../content/rtn-catalog-query";
import { RtnCatalogJsonLd } from "../../seo/rtn-catalog-json-ld";

/** Адрес каталога и параметры серверной загрузки из текущего маршрута. */
interface RtnCatalogPageContentProps {
  searchParams: Promise<RtnSearchParams>;
  basePath: "" | "/landing";
}

/** Загружает разъяснения и справочники, сохраняя разные правила двух каталогов. */
export async function RtnCatalogPageContent({
  searchParams,
  basePath,
}: RtnCatalogPageContentProps) {
  const params = await searchParams;
  const isPublic = basePath === "";
  const page = isPublic ? readRtnPage(params) : 1;
  const filters = readRtnFilters(params);
  const [initial, taxonomy] = await Promise.all([
    getRtnListOnServer({
      filters,
      limit: RTN_PAGE_SIZE * page,
      offset: 0,
    }),
    getRtnTaxonomyOnServer(),
  ]);
  const hasNextPage = isPublic
    && !filters
    && initial.has_more
    && page < RTN_MAX_PAGE;
  const nextPageHref = hasNextPage ? `/rtn?page=${page + 1}` : undefined;

  return (
    <>
      {isPublic && <RtnCatalogJsonLd items={initial.items} />}
      <RtnCatalogResults
        initial={initial}
        taxonomy={taxonomy}
        filters={filters}
        page={page}
        basePath={basePath}
        nextPageHref={nextPageHref}
      />
    </>
  );
}
