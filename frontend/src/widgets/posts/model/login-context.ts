"use client";

import { createContext, useContext } from "react";

/** Открытие окна входа, которое раздел публикаций получает от приложения. */
export const PostsLoginContext = createContext<(() => void) | null>(null);

/** Возвращает открытие окна входа для действий гостя внутри раздела публикаций. */
export function usePostsLogin() {
  const openLogin = useContext(PostsLoginContext);

  if (!openLogin) {
    throw new Error("Раздел публикаций должен находиться внутри PostsLayout");
  }

  return openLogin;
}
