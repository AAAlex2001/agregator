"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../model/useSession";
import type { SessionRole } from "../model/types";

interface Props {
  allowed: readonly SessionRole[];
  children: React.ReactNode;
}

/**
 * Пускает только пользователей с одной из allowed ролей.
 * Иначе перенаправляет на /settings (общая для всех ролей).
 */
export function RoleGuard({ allowed, children }: Props) {
  const router = useRouter();
  const { user, role, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return; // AuthGuard уже редиректнет на /login
    if (!role || !allowed.includes(role)) {
      router.replace("/settings");
    }
  }, [isLoading, user, role, allowed, router]);

  if (!isLoading && user && (!role || !allowed.includes(role))) {
    return null;
  }
  return <>{children}</>;
}
