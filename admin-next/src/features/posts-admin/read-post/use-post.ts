"use client";

import { useEffect, useState } from "react";
import { fetchPost, type Post } from "@/entities/posts";
import { errorMessage } from "@/shared/lib/errors";

/** Открывает публикацию для проверки и повторно загружает после модерации. */
export function usePost(id: number) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const request = new AbortController();

    fetchPost(id, request.signal)
      .then((result) => {
        if (!request.signal.aborted) setPost(result);
      })
      .catch((failure) => {
        if (!request.signal.aborted) {
          setError(errorMessage(failure, "Не удалось загрузить публикацию"));
        }
      });

    return () => request.abort();
  }, [id, version]);

  function reload() {
    setPost(null);
    setError("");
    setVersion((value) => value + 1);
  }

  return { post, error, reload };
}
