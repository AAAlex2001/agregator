"use client";

import type { ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import LandingHeader from "@/source/widgets/landing/shared/ui/Header";
import LandingFooter from "@/source/widgets/landing/shared/ui/Footer";
import { PostsLayout } from "./PostsLayout";

/** Добавляет гостевую шапку; вошедший пользователь уже находится в оболочке кабинета. */
export function PostsSiteShell({ children }: { children: ReactNode }) {
  const { user, role } = useSession();
  const content = <PostsLayout key={user?.id ?? "guest"}>{children}</PostsLayout>;
  if (role) return content;

  return (
    <>
      <LandingHeader />
      <main>{content}</main>
      <LandingFooter variant="light" />
    </>
  );
}
