"use client";

import { useSession } from "@/source/features/session";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { AuthTrigger } from "@/source/shared/ui/AuthTrigger";
import { BulletIcon } from "@/source/shared/ui/icons";
import s from "./notifications-cta.module.scss";

const NOTIFICATION_ITEMS = [
  {
    title: "Новые заказы по вашим направлениям",
    text: "Отметьте интересующие виды работ — пришлём письмо, как только появится подходящая заявка.",
  },
  {
    title: "Отклики и итоги торгов",
    text: "Заказчику — о новых откликах исполнителей, исполнителю — о решении заказчика по его отклику.",
  },
  {
    title: "Вопросы и ответы по заявке",
    text: "Публичные вопросы исполнителей и ответы заказчика по вашим заказам.",
  },
  {
    title: "Сообщения в чате",
    text: "Письмо, если собеседник написал вам, пока вы не на платформе.",
  },
];

const NotificationsCta = () => {
  const { user } = useSession();

  return (
    <section className={s.section} id="notifications-cta">
      <div className={s.panel}>
        <div className={s.intro}>
          <Title as="h2" text="Уведомления о новых заказах и откликах" />
          <Subtitle
            className={s.subtitle}
            text="Пришлём на почту только то, что вы выбрали в настройках профиля, — без шума и спама."
          />
          {user ? (
            <Button href="/settings" variant="primary" showArrow className={s.cta}>
              Перейти в настройки
            </Button>
          ) : (
            <AuthTrigger tab="register" variant="primary" showArrow className={s.cta}>
              Зарегистрироваться
            </AuthTrigger>
          )}
        </div>

        <ul className={s.list}>
          {NOTIFICATION_ITEMS.map((item) => (
            <li key={item.title} className={s.item}>
              <span aria-hidden="true" className={s.bullet}>
                <BulletIcon />
              </span>
              <div className={s.itemText}>
                <span className={s.itemTitle}>{item.title}</span>
                <span className={s.itemDesc}>{item.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NotificationsCta;
