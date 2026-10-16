"use client";

import { useEffect, useState } from "react";
import { fetchAvailableRoles } from "../api/get-available-roles";
import type { AvailableRole } from "./types";
import { useUser } from "./use-user";

/** Список ролей, загруженный для конкретного аккаунта. */
interface AccountRoles {
  userId: number | null;
  roles: AvailableRole[];
}

/** Загружает роли текущего аккаунта; при ошибке предложение переключиться скрыто. */
export function useAvailableRoles(): AvailableRole[] {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const [result, setResult] = useState<AccountRoles>({
    userId: null,
    roles: [],
  });

  useEffect(() => {
    if (userId === null) {
      return;
    }

    let isActive = true;

    fetchAvailableRoles()
      .then((roles) => {
        if (isActive) {
          setResult({ userId, roles });
        }
      })
      .catch(() => {
        if (isActive) {
          setResult({ userId, roles: [] });
        }
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  return userId !== null && result.userId === userId ? result.roles : [];
}
