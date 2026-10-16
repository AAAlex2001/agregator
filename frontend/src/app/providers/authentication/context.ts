"use client";

import { createContext, useContext } from "react";
import type { RegistrationPreset } from "@/features/register";

/** Действия страницы для открытия общего окна входа или регистрации. */
interface AuthenticationContextValue {
  openLogin: () => void;
  openRegistration: (preset?: RegistrationPreset) => void;
}

/** Действия окна авторизации, которые провайдер передаёт страницам. */
export const AuthenticationContext = createContext<AuthenticationContextValue | null>(
  null,
);

/** Передаёт страницам действия окна авторизации для кнопок и виджетов. */
export function useAuthentication() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error("Страница должна находиться внутри AuthenticationProvider");
  }

  return context;
}
