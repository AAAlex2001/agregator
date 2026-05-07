"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../model/useSession";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Если после загрузки сессии нет user — редиректит на /login.
 * Используется внутри auth-restricted layout.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  return <>{children}</>;
}
