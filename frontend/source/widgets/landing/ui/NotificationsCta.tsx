"use client";

import Link from "next/link";
import { useSession } from "@/source/features/session";
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
        <Link href={href} className={s.card}>
          <div className={s.iconWrap} aria-hidden="true">
            <TabNotificationIcon className={s.icon} />
            <span className={s.pulse} />
            <span className={s.dot} />
          </div>
          <div className={s.textCol}>
            <h2 className={s.title}>Настроить уведомления о новых заказах</h2>
            <p className={s.subtitle}>{subtitle}</p>
          </div>
          <span className={s.cta}>
            {ctaLabel}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
};

export default NotificationsCta;
