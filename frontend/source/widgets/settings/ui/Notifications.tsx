"use client";

import type { UserProfile } from "@/source/entities/user";
import { DisableAllButton } from "@/source/features/settings/notifications/disable-all";
import { EmailEventsSection } from "@/source/features/settings/notifications/email-events";
import { OrderFilterSection } from "@/source/features/settings/notifications/order-filter";
import { Switch } from "@/source/shared/ui/Switch";
import s from "./Notifications.module.scss";

interface NotificationsProps {
  user: UserProfile;
}

/** Вкладка «Уведомления»: у держателя документов одно обязательное письмо, у остальных — фильтр заказов и события. */
export function Notifications({ user }: NotificationsProps) {
  if (user.role === "LICENSE_HOLDER") {
    return (
      <div className={s.notifications}>
        <header className={s.text}>
          <h2 className={s.title}>Почтовые уведомления</h2>
          <p className={s.subtitle}>Уведомления о новых заявках исполнителей включены всегда.</p>
        </header>

        <Switch
          id="pref-email-on-labor-listing"
          checked
          onChange={() => undefined}
          label="Новые заявки исполнителей"
          description="Новые объявления исполнителей о готовности к трудоустройству."
          disabled
        />
      </div>
    );
  }

  return (
    <div className={s.notifications}>
      <header className={s.header}>
        <div className={s.text}>
          <h2 className={s.title}>Почтовые уведомления</h2>
          <p className={s.subtitle}>
            Выберите события, о которых хотите получать письма. Настройки сохраняются автоматически.
          </p>
        </div>
        <DisableAllButton />
      </header>

      {user.role === "EXPERT" && <OrderFilterSection orderTypes={user.notify_order_types} />}

      <EmailEventsSection profile={user} />
    </div>
  );
}
