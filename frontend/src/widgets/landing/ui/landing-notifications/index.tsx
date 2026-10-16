"use client";

import { Button } from "@/shared/ui/button";
import { BulletIcon } from "@/shared/ui/icons";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { LANDING_NOTIFICATIONS } from "../../config/notifications";
import styles from "./style.module.scss";

/** Состояние входа и действие регистрации, переданные приложением. */
interface LandingNotificationsProps {
  isAuthenticated: boolean;
  onRegister: () => void;
}

/** Объясняет уведомления и предлагает регистрацию или настройки аккаунта. */
export function LandingNotifications({
  isAuthenticated,
  onRegister,
}: LandingNotificationsProps) {
  return (
    <section
      className={styles.section}
      id="notifications-cta"
    >
      <div className={styles.panel}>
        <div className={styles.intro}>
          <Title
            as="h2"
            text="Уведомления о новых заказах и откликах"
          />
          <Subtitle
            className={styles.subtitle}
            text="Пришлём на почту только то, что вы выбрали в настройках профиля, — без шума и спама."
          />
          {isAuthenticated ? (
            <Button
              href="/settings"
              variant="primary"
              showArrow
              className={styles.cta}
            >
              Перейти в настройки
            </Button>
          ) : (
            <Button
              variant="primary"
              showArrow
              className={styles.cta}
              onClick={onRegister}
            >
              Зарегистрироваться
            </Button>
          )}
        </div>

        <ul className={styles.list}>
          {LANDING_NOTIFICATIONS.map((item) => (
            <li
              key={item.title}
              className={styles.item}
            >
              <span
                aria-hidden="true"
                className={styles.bullet}
              >
                <BulletIcon />
              </span>
              <div className={styles.itemText}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemDesc}>{item.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
