import Image from "next/image";
import s from "./promo-banner.module.scss";

const PromoBanner = () => (
  <div className={s.banner}>
    <div className={s.half}>
      <Image className={s.img} src="/promo/tg-bot.webp" width={3750} height={945} alt="" sizes="50vw" />
      <span className={s.text}>
        <span className={s.title}>Скоро — удобный Telegram-бот</span>
        <span className={s.subtitle}>Заявки, отклики и чат с заказчиком — прямо в Telegram</span>
      </span>
    </div>
    <div className={s.half}>
      <Image className={s.img} src="/promo/app.webp" width={3750} height={945} alt="" sizes="50vw" />
      <span className={s.text}>
        <span className={s.title}>Скоро — мобильное приложение</span>
        <span className={s.subtitle}>Сделки, документы и уведомления — всегда под рукой</span>
      </span>
    </div>
  </div>
);

export default PromoBanner;
