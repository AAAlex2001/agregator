"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/entities/user";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import { useAuthentication } from "../../../providers/authentication";

/** Публичная страница и адрес её версии в кабинете, если она предусмотрена. */
interface PublicSiteShellProps {
  children: ReactNode;
  redirectTo?: string;
  footerVariant?: "light" | "dark";
}

/** Связывает публичную шапку и подвал с авторизацией текущего приложения. */
export function PublicSiteShell({
  children,
  redirectTo,
  footerVariant = "light",
}: PublicSiteShellProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { openLogin, openRegistration } = useAuthentication();

  useEffect(() => {
    if (redirectTo && !isLoading && user) {
      router.replace(redirectTo);
    }
  }, [redirectTo, isLoading, user, router]);

  /** Открывает регистрацию без заранее выбранной роли. */
  function showRegistration() {
    openRegistration();
  }

  return (
    <>
      <SiteHeader
        onOpenLogin={openLogin}
        onOpenRegister={showRegistration}
      />
      {children}
      <SiteFooter
        variant={footerVariant}
        onOpenRegister={showRegistration}
      />
    </>
  );
}
