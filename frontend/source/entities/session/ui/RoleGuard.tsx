"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/source/entities/user";
import { useSession } from "../model/useSession";

interface RoleGuardProps {
  allowed: readonly UserRole[];
  children: ReactNode;
}

/** Страница только для перечисленных ролей: остальных отправляет в настройки — они есть у всех. */
export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, role, isLoading } = useSession();
  const isForbidden = !isLoading && user !== null && (role === null || !allowed.includes(role));

  useEffect(() => {
    if (isForbidden) router.replace("/settings");
  }, [isForbidden, router]);

  return isForbidden ? null : children;
}
