"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../model/useSession";

interface AuthGuardProps {
  children: ReactNode;
}

/** Кабинет только для вошедших: без сессии отправляет на главную, где можно войти. */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, role, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/");
  }, [isLoading, user, router]);

  if (!user && !role) return null;
  return children;
}
