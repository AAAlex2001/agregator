import { UnreadCountBadge } from "@/source/entities/notification";
import { NotificationsInbox } from "@/source/features/notifications/inbox";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./NotificationsPageWidget.module.scss";

/** Страница уведомлений: заголовок с числом непрочитанных и лента. */
export function NotificationsPageWidget() {
  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <div className={s.titleRow}>
          <Title text="Уведомления" as="h1" className={s.pageTitle} />
          <UnreadCountBadge />
        </div>
        <Subtitle text="Все события по вашим заказам и откликам" className={s.pageSubtitle} />
      </div>

      <NotificationsInbox />
    </div>
  );
}
