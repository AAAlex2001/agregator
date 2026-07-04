import Image from "next/image";
import s from "./coming-soon.module.scss";

const ITEMS = [
  {
    image: "/promo/landing-bot.webp",
    alt: "Telegram-бот Ресурс-Плюс для экспертизы промышленной безопасности",
    title: "Скоро — удобный Telegram-бот",
    subtitle: "Заявки, отклики и чат с заказчиком — прямо в Telegram",
  },
  {
    image: "/promo/landing-app.webp",
    alt: "Мобильное приложение Ресурс-Плюс для заказчиков и экспертов",
    title: "Скоро — мобильное приложение",
    subtitle: "Сделки, документы и уведомления — всегда под рукой",
  },
];

const ComingSoon = () => (
  <section className={s.section} aria-label="Скоро на платформе">
    <div className={s.grid}>
      {ITEMS.map((item) => (
        <article key={item.title} className={s.card}>
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
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ComingSoon;
