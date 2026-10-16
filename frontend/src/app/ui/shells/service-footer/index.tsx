"use client";

import { SiteFooter } from "@/widgets/site-footer";
import { useAuthentication } from "../../../providers/authentication";

/** Подключает регистрацию к светлому подвалу публичной страницы услуги. */
export function ServiceFooter() {
  const { openRegistration } = useAuthentication();

  /** Открывает регистрацию без предустановленной роли. */
  function register() {
    openRegistration();
  }

  return (
    <SiteFooter
      variant="light"
      onOpenRegister={register}
    />
  );
}
