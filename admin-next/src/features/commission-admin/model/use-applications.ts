"use client";

import { useEffect, useState } from "react";
import {
  fetchApplications,
  type ApplicationList,
  type ApplicationStatus,
  type CommissionApplication,
} from "@/entities/commission-application";
import { errorMessage } from "@/shared/lib/errors";

const PAGE_SIZE = 20;

/** Заявки кандидатов выбранного статуса по страницам. Решение по заявке обновляет её в списке. */
export function useApplications() {
  const [query, setQuery] = useState<{ status: ApplicationStatus | ""; page: number }>({ status: "new", page: 1 });
  const [list, setList] = useState<ApplicationList | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();

    fetchApplications(query.status, PAGE_SIZE, (query.page - 1) * PAGE_SIZE, request.signal)
      .then((result) => {
        if (!request.signal.aborted) setList(result);
      })
      .catch((failure) => {
        if (!request.signal.aborted) setError(errorMessage(failure, "Не удалось загрузить заявки"));
      });

    return () => request.abort();
  }, [query]);

  function load(status: ApplicationStatus | "", page: number) {
    setList(null);
    setError("");
    setQuery({ status, page });
  }

  function replace(application: CommissionApplication) {
    if (!list) return;

    setList({ ...list, items: list.items.map((item) => (item.id === application.id ? application : item)) });
  }

  return {
    list,
    error,
    status: query.status,
    page: query.page,
    pages: Math.ceil((list?.total ?? 0) / PAGE_SIZE),
    changeStatus: (status: ApplicationStatus | "") => load(status, 1),
    openPage: (page: number) => load(query.status, page),
    reload: () => load(query.status, query.page),
    replace,
  };
}
