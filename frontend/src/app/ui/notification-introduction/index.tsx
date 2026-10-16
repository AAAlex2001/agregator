"use client";

import { useRouter } from "next/navigation";
import { NotificationsWelcomeModal } from "@/features/introduce-notifications";

/** Соединяет знакомство с уведомлениями с маршрутом настроек аккаунта. */
export function NotificationIntroduction() {
  const router = useRouter();

  /** Открывает прежнюю страницу настроек по кнопке приглашения. */
  function openSettings() {
    router.push("/settings");
  }

  return <NotificationsWelcomeModal onOpenSettings={openSettings} />;
}
