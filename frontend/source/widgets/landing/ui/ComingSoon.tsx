import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { TelegramIcon } from "@/source/shared/ui/icons";
import s from "./coming-soon.module.scss";

const BOT_URL = "https://t.me/resursplus_robot";

const ITEMS = [
  {
    image: "/promo/landing-bot.webp",
    alt: "Telegram-бот Ресурс-Плюс для экспертизы промышленной безопасности",
    title: "Telegram-бот уже работает",
    subtitle: "Заявки, отклики и чат с заказчиком — прямо в Telegram",
    href: BOT_URL,
    cta: "Открыть @resursplus_robot",
  },
  {
    image: "/promo/landing-app.webp",
    alt: "Мобильное приложение Ресурс-Плюс для заказчиков и экспертов",
    title: "Скоро — мобильное приложение",
    subtitle: "Сделки, документы и уведомления — всегда под рукой",
    href: null,
    cta: null,
  },
];

const ComingSoon = () => (
  <section className={s.section} aria-label="Бот и приложение Ресурс-Плюс">
    <div className={s.grid}>
      {ITEMS.map((item) => {
        const inner = (
          <>
            <Image
              className={s.img}
              src={item.image}
              alt={item.alt}
              width={1400}
              height={735}
              sizes="(max-width: 767px) 100vw, 50vw"
            />
            <div className={s.text}>
              <h3 className={s.title}>{item.title}</h3>
              <p className={s.subtitle}>{item.subtitle}</p>
              {item.href && item.cta ? (
                <Button
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="telegram"
                  size="sm"
                  className={s.cta}
                >
                  <span>{item.cta}</span>
                  <TelegramIcon />
                </Button>
              ) : null}
            </div>
          </>
        );

        return (
          <article key={item.title} className={s.card}>
            {inner}
          </article>
        );
      })}
    </div>
  </section>
);

export default ComingSoon;
