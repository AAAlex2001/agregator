"use client";

import { useEffect, useState } from "react";
import { BLITZ_STATUS_GROUPS, fetchBlitzOrders, type BlitzOrderList } from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";

const PAGE_SIZE = 20;

/** Загружает страницу заявок выбранной группы статусов и отменяет устаревший запрос. */
export function useBlitzOrders() {
  const [query, setQuery] = useState({ group: 0, page: 1 });
  const [list, setList] = useState<BlitzOrderList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();
    const statuses = BLITZ_STATUS_GROUPS[query.group].statuses;

    fetchBlitzOrders(statuses, PAGE_SIZE, (query.page - 1) * PAGE_SIZE, request.signal)
      .then((result) => {
        if (request.signal.aborted) return;

        setList(result);
        setLoading(false);
      })
      .catch((failure) => {
        if (request.signal.aborted) return;

        setError(errorMessage(failure, "Не удалось загрузить заявки"));
        setLoading(false);
      });

    return () => request.abort();
  }, [query]);

  function load(group: number, page: number) {
    setLoading(true);
    setError("");
    setList(null);
    setQuery({ group, page });
  }

  return {
    list,
    loading,
    error,
    group: query.group,
    page: query.page,
    pages: Math.ceil((list?.total ?? 0) / PAGE_SIZE),
    changeGroup: (group: number) => load(group, 1),
    openPage: (page: number) => load(query.group, page),
    reload: () => load(query.group, query.page),
  };
}
