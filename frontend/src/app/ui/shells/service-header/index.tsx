"use client";

import { SiteHeader } from "@/widgets/site-header";
import { useAuthentication } from "../../../providers/authentication";

/** Подключает вход и регистрацию к публичной шапке страницы услуги. */
export function ServiceHeader() {
  const { openLogin, openRegistration } = useAuthentication();

  /** Открывает регистрацию без предустановленной роли. */
  function register() {
    openRegistration();
  }

  return (
    <SiteHeader
      onOpenLogin={openLogin}
      onOpenRegister={register}
    />
  );
}
