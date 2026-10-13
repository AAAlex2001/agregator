"use client";

import type { ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import Button from "@/source/shared/ui/Button";
import { PostsSkeleton } from "../../skeleton";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./PostsLayout.module.scss";

interface Props {
  children: ReactNode;
  loadingFallback?: ReactNode;
}

/** Сохраняет выбранную страницу и предлагает гостю войти. */
export function PostAccess({ children, loadingFallback = <PostsSkeleton /> }: Props) {
  const { user, isLoading } = useSession();
  const { openAuth } = useAuthModal();
  if (user) return children;
  if (isLoading) return loadingFallback;
  return (
    <section className={s.access}>
      <Title as="h1" text="Ваши публикации" />
      <Subtitle
        text="Войдите, чтобы писать посты, сохранять интересное и делиться публикациями."
        className={s.accessSubtitle}
      />
      <Button onClick={() => openAuth("login")}>Войти</Button>
    </section>
  );
}
