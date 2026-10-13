"use client";

import { useEffect, useState } from "react";
import { fetchReports, type ReportList, type ReportStatus } from "@/entities/posts";
import { errorMessage } from "@/shared/lib/errors";

const PAGE_SIZE = 20;

/** Загружает очередь жалоб выбранного статуса и страницу результатов. */
export function useReportsList() {
  const [query, setQuery] = useState({ status: "open" as ReportStatus, page: 1 });
  const [list, setList] = useState<ReportList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();

    fetchReports(query.status, PAGE_SIZE, (query.page - 1) * PAGE_SIZE, request.signal)
      .then((result) => {
        if (request.signal.aborted) return;
        setList(result);
        setLoading(false);
      })
      .catch((failure) => {
        if (request.signal.aborted) return;

        setError(errorMessage(failure, "Не удалось загрузить жалобы"));
        setLoading(false);
      });

    return () => request.abort();
  }, [query]);

  function load(status: ReportStatus, page: number) {
    setLoading(true);
    setError("");
    setList(null);
    setQuery({ status, page });
  }

  return {
    list,
    loading,
    error,
    status: query.status,
    page: query.page,
    pages: Math.ceil((list?.total ?? 0) / PAGE_SIZE),
    changeStatus: (status: ReportStatus) => load(status, 1),
    openPage: (page: number) => load(query.status, page),
    reload: () => load(query.status, query.page),
  };
}
