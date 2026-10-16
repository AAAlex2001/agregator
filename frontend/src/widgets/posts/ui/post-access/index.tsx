"use client";

import type { ReactNode } from "react";
import { useUser } from "@/entities/user";
import { PostsSignIn } from "../posts-sign-in";

/** Форма, доступная только вошедшему. */
interface PostAccessProps {
  children: ReactNode;
}

/** Показывает форму публикации вошедшему, а гостю — предложение войти. */
export function PostAccess({ children }: PostAccessProps) {
  const { user, isLoading } = useUser();

  if (user) {
    return children;
  }

  if (isLoading) {
    return null;
  }

  return <PostsSignIn />;
}
