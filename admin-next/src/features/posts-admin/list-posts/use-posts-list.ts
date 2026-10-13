"use client";

import { useEffect, useState } from "react";
import { fetchPosts, type PostList, type PostStatus } from "@/entities/posts";
import { errorMessage } from "@/shared/lib/errors";

const PAGE_SIZE = 20;

/** Загружает выбранную страницу публикаций и отменяет устаревший запрос. */
export function usePostsList(authorId?: number) {
  const [query, setQuery] = useState({ status: "published" as PostStatus, page: 1 });
  const [list, setList] = useState<PostList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();

    fetchPosts(query.status, PAGE_SIZE, (query.page - 1) * PAGE_SIZE, request.signal, authorId)
      .then((result) => {
        if (request.signal.aborted) return;
        setList(result);
        setLoading(false);
      })
      .catch((failure) => {
        if (request.signal.aborted) return;

        setError(errorMessage(failure, "Не удалось загрузить публикации"));
        setLoading(false);
      });

    return () => request.abort();
  }, [query, authorId]);

  function load(status: PostStatus, page: number) {
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
    changeStatus: (status: PostStatus) => load(status, 1),
    openPage: (page: number) => load(query.status, page),
    reload: () => load(query.status, query.page),
  };
}
