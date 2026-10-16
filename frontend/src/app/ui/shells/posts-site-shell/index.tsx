"use client";

import type { ReactNode } from "react";
import { useUser } from "@/entities/user";
import { PostsLayout } from "@/widgets/posts";
import { useAuthentication } from "../../../providers/authentication";
import { PublicSiteShell } from "../public-site-shell";

/** Страница раздела публикаций. */
interface PostsSiteShellProps {
  children: ReactNode;
}

/**
 * Добавляет гостю публичные шапку и подвал; вошедший уже находится в оболочке кабинета.
 * При смене аккаунта раздел пересоздаётся, чтобы на экране не осталось данных прежнего.
 */
export function PostsSiteShell({ children }: PostsSiteShellProps) {
  const { user, role } = useUser();
  const { openLogin } = useAuthentication();
  const content = (
    <PostsLayout
      key={user?.id ?? "guest"}
      onLogin={openLogin}
    >
      {children}
    </PostsLayout>
  );

  if (role) {
    return content;
  }

  return (
    <PublicSiteShell>
      <main>{content}</main>
    </PublicSiteShell>
  );
}
