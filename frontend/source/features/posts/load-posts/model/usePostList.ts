"use client";

import { useEffect, useReducer, useState } from "react";
import { fetchPostPage, type Post, type PostFeedQuery, type PostPage } from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";

interface PostListState {
  items: Post[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string;
}

type PostListAction =
  | { type: "load/start" }
  | { type: "load/success"; page: PostPage }
  | { type: "load/error"; error: string }
  | { type: "more/start" }
  | { type: "more/success"; page: PostPage }
  | { type: "more/error" }
  | { type: "remove"; id: number };

const initialState: PostListState = { items: [], total: 0, isLoading: true, isLoadingMore: false, error: "" };

function reducer(state: PostListState, action: PostListAction): PostListState {
  switch (action.type) {
    case "load/start":
      return { ...state, isLoading: true, error: "" };
    case "load/success":
      return { ...state, items: action.page.items, total: action.page.total, isLoading: false };
    case "load/error":
      return { ...state, isLoading: false, error: action.error };
    case "more/start":
      return { ...state, isLoadingMore: true };
    case "more/success":
      return { ...state, items: [...state.items, ...action.page.items], total: action.page.total, isLoadingMore: false };
    case "more/error":
      return { ...state, isLoadingMore: false };
    case "remove":
      return { ...state, items: state.items.filter((post) => post.id !== action.id), total: state.total - 1 };
  }
}

/** Личный раздел публикаций: первая страница при открытии, следующие — по кнопке. */
export function usePostList({ mode, status }: PostFeedQuery) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPostPage({ mode, status }, 0)
      .then((page) => {
        if (!cancelled) dispatch({ type: "load/success", page });
      })
      .catch((error) => {
        if (!cancelled) dispatch({ type: "load/error", error: error instanceof Error ? error.message : "Не удалось загрузить публикации" });
      });
    return () => {
      cancelled = true;
    };
  }, [mode, status, version]);

  const loadMore = async () => {
    dispatch({ type: "more/start" });
    try {
      dispatch({ type: "more/success", page: await fetchPostPage({ mode, status }, state.items.length) });
    } catch (error) {
      dispatch({ type: "more/error" });
      showError(error instanceof Error ? error.message : "Не удалось загрузить публикации");
    }
  };

  return {
    ...state,
    hasMore: state.items.length < state.total,
    loadMore,
    remove: (id: number) => dispatch({ type: "remove", id }),
    reload: () => {
      dispatch({ type: "load/start" });
      setVersion(version + 1);
    },
  };
}
