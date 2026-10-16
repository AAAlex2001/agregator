"use client";

import { useState } from "react";
import { useUser } from "@/entities/user";
import { DisableNotificationsButton } from "@/features/disable-notifications";
import { EmailNotificationsForm } from "@/features/edit-email-notifications";
import { OrderNotificationsForm } from "@/features/edit-order-notifications";
import { NotificationSettingsSkeleton } from "../notification-settings-skeleton";
import { RequiredNotifications } from "../required-notifications";
import styles from "./style.module.scss";

/** Вкладка «Уведомления»: блокирует соседние переключатели на время сохранения. */
export function NotificationSettings() {
  const { user, isLoading } = useUser();
  const [isBusy, setIsBusy] = useState(false);

  if (isLoading || !user) {
    return <NotificationSettingsSkeleton />;
  }

  if (user.role === "LICENSE_HOLDER") {
    return <RequiredNotifications />;
  }

  return (
    <div className={styles.notifications}>
      <header className={styles.header}>
        <div className={styles.text}>
          <h2 className={styles.title}>Почтовые уведомления</h2>
          <p className={styles.subtitle}>
            Выберите события, о которых хотите получать письма. Настройки
            сохраняются автоматически.
          </p>
        </div>
        <DisableNotificationsButton
          disabled={isBusy}
          onBusyChange={setIsBusy}
        />
      </header>

      {user.role === "EXPERT" && (
        <OrderNotificationsForm
          orderTypes={user.notify_order_types}
          disabled={isBusy}
          onBusyChange={setIsBusy}
        />
      )}

      <EmailNotificationsForm
        profile={user}
        disabled={isBusy}
        onBusyChange={setIsBusy}
      />
    </div>
  );
}
