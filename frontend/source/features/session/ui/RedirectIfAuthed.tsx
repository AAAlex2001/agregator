"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../model/useSession";
import type { SessionRole } from "../model/types";

interface Props {
  to: string | Partial<Record<SessionRole, string>>;
  fallback?: string;
}

function resolveTarget(
  to: Props["to"],
  role: SessionRole | null,
  fallback?: string,
): string | null {
  if (typeof to === "string") return to;
  if (role && to[role]) return to[role]!;
  return fallback ?? null;
}

export function RedirectIfAuthed({ to, fallback }: Props) {
  const router = useRouter();
  const { user, isLoading, role } = useSession();

  useEffect(() => {
    if (isLoading || !user) return;
    const target = resolveTarget(to, role, fallback);
    if (target) router.replace(target);
  }, [isLoading, user, role, router, to, fallback]);

  return null;
}
