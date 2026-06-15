"use client";

import { useSession } from "@/source/features/session";
import Button from "@/source/shared/ui/Button";
import { TabNotificationIcon } from "@/source/shared/ui/icons";
import s from "./notifications-cta.module.scss";

const GUEST_SUBTITLE =
  "Зарегистрируйтесь, отметьте интересующие типы экспертизы — будем присылать только подходящие проекты, без шума и спама";
const AUTHED_SUBTITLE =
  "Откройте профиль и отметьте интересующие типы экспертизы — будем присылать только подходящие проекты, без шума и спама";

const NotificationsCta = () => {
  const { user } = useSession();
  const href = user ? "/settings" : "/register";
  const subtitle = user ? AUTHED_SUBTITLE : GUEST_SUBTITLE;
  const ctaLabel = user ? "Перейти в профиль" : "Зарегистрироваться";

  return (
    <section className={s.section} id="notifications-cta">
      <div className={s.content}>
        <div className={s.card}>
          <div className={s.iconWrap} aria-hidden="true">
            <span className={s.pulseOuter} />
            <span className={s.pulseInner} />
            <TabNotificationIcon className={s.icon} />
            <span className={s.dot} />
          </div>
          <div className={s.textCol}>
            <h2 className={s.title}>Настройка уведомлений о новых заказах</h2>
            <p className={s.subtitle}>{subtitle}</p>
          </div>
          <Button href={href} variant="primary" showArrow className={s.ctaButton}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotificationsCta;
