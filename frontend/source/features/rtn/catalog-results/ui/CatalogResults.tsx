"use client";

import { RtnCard, type RtnList } from "@/source/entities/rtn";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui";
import { useCatalogPages } from "../model/useCatalogPages";
import s from "./CatalogResults.module.scss";

const NOTHING_FOUND = {
  title: "Ничего не найдено",
  subtitle: "Попробуйте изменить запрос или сбросить фильтры",
};

const CATALOG_EMPTY = {
  title: "Пока нет опубликованных разъяснений",
  subtitle: "Ответы Ростехнадзора еще не опубликованы в этом разделе — загляните позже",
};

interface CatalogResultsProps {
  initial: RtnList;
  filters: string;
  basePath: string;
  nextPageHref?: string;
}

/**
 * Карточки каталога и «Показать ещё». Для поисковиков следующая страница — ссылка (nextPageHref),
 * иначе кнопка подгружает её без перехода.
 */
export function CatalogResults({ initial, filters, basePath, nextPageHref }: CatalogResultsProps) {
  const { list, isLoading, loadMore } = useCatalogPages(initial, filters);
  const empty = filters ? NOTHING_FOUND : CATALOG_EMPTY;

  return (
    <div className={s.results}>
      {list.items.length === 0 ? (
        <EmptyState title={empty.title} subtitle={empty.subtitle} />
      ) : (
        <ul className={s.list}>
          {list.items.map((item) => (
            <RtnCard key={item.id} item={item} basePath={basePath} />
          ))}
        </ul>
      )}

      {nextPageHref && (
        <Button href={nextPageHref} scroll={false} variant="outline" className={s.more}>
          Показать ещё
        </Button>
      )}
      {!nextPageHref && list.has_more && (
        <Button type="button" variant="outline" className={s.more} onClick={loadMore} isLoading={isLoading}>
          Показать ещё
        </Button>
      )}
    </div>
  );
}
