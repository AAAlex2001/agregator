"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { UNAUTHORIZED_EVENT } from "@/shared/api";
import { LOGIN_PATH } from "@/shared/lib/admin-paths";
import { fetchMe, logout } from "../api/auth";
import { sessionReducer } from "./reducers";

/** Проверка входа при открытии админки и уход на страницу входа, когда сессия истекла. */
export const useAdminSession = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(sessionReducer, { ready: false });

  useEffect(() => {
    const toLogin = () => router.replace(LOGIN_PATH);

    fetchMe()
      .then(() => dispatch({ type: "session/confirmed" }))
      .catch(toLogin);

    window.addEventListener(UNAUTHORIZED_EVENT, toLogin);

    return () => window.removeEventListener(UNAUTHORIZED_EVENT, toLogin);
  }, [router]);

  const exit = async () => {
    await logout().catch(() => undefined);
    router.replace(LOGIN_PATH);
  };

  return { state, exit };
};
