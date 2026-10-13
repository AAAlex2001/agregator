"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../model/useSession";

interface RedirectIfAuthedProps {
  to: string;
}

/** Публичная страница для гостей: вошедшего пользователя переводит на её версию внутри кабинета. */
export function RedirectIfAuthed({ to }: RedirectIfAuthedProps) {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && user) router.replace(to);
  }, [isLoading, user, router, to]);

  return null;
}
