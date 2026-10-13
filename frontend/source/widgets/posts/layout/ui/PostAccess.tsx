"use client";

import type { ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./PostsLayout.module.scss";

/** Предложение войти вместо личного раздела публикаций. */
export function PostsSignIn() {
  const { openAuth } = useAuthModal();

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

interface PostAccessProps {
  children: ReactNode;
}

/** Форма публикации только для вошедших: гостю — предложение войти. */
export function PostAccess({ children }: PostAccessProps) {
  const { user, isLoading } = useSession();

  if (user) {
    return children;
  }

  if (isLoading) {
    return null;
  }

  return <PostsSignIn />;
}
