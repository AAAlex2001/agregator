"use client";

import { NotificationListProvider, useUnreadCount } from "@/entities/notification";
import { NotificationFeed } from "@/features/manage-notifications";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Страница уведомлений: заголовок с числом непрочитанных и лента. */
export function NotificationsPage() {
  const { count } = useUnreadCount();

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <div className={styles.titleRow}>
          <Title
            text="Уведомления"
            as="h1"
            className={styles.title}
          />
          <span className={styles.badge}>{count}</span>
        </div>
        <Subtitle
          text="Все события по вашим заказам и откликам"
          className={styles.subtitle}
        />
      </div>

      <NotificationListProvider>
        <NotificationFeed />
      </NotificationListProvider>
    </div>
  );
}
