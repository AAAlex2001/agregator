"use client";

import type { ReactNode } from "react";
import { UserProvider } from "@/entities/user";
import type { UserRole } from "@/entities/user";
import { NotificationProvider } from "@/shared/ui/notifications";
import { AuthenticationProvider } from "./authentication";

/** Страницы приложения и роль из cookie для первого отображения. */
interface AppProvidersProps {
  children: ReactNode;
  initialRole: UserRole | null;
}

/** Подключает уведомления, текущего пользователя и общее окно авторизации. */
export function AppProviders({ children, initialRole }: AppProvidersProps) {
  return (
    <NotificationProvider>
      <UserProvider initialRole={initialRole}>
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </UserProvider>
    </NotificationProvider>
  );
}
