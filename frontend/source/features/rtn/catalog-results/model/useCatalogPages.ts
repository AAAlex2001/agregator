"use client";

import { useState } from "react";
import { fetchRtnList, RTN_PAGE_SIZE, type RtnList } from "@/source/entities/rtn";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Выдача каталога: первая страница приходит с сервера, следующие подгружаются кнопкой. */
export function useCatalogPages(initial: RtnList, filters: string) {
  const { showError } = useNotifications();
  const [list, setList] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const next = await fetchRtnList({ filters, limit: RTN_PAGE_SIZE, offset: list.items.length });
      setList({ items: [...list.items, ...next.items], has_more: next.has_more });
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подгрузить разъяснения");
    } finally {
      setIsLoading(false);
    }
  };

  return { list, isLoading, loadMore };
}
