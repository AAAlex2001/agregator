import Image from "next/image";
import s from "./promo-banner.module.scss";

const PromoBanner = () => (
  <div className={s.banner}>
    <div className={s.half}>
      <Image className={s.img} src="/promo/tg-bot.webp" alt="" fill sizes="(max-width: 767px) 100vw, 50vw" />
      <span className={s.text}>Скоро — выпуск удобного Telegram-бота</span>
    </div>
    <div className={s.half}>
      <Image className={s.img} src="/promo/app.webp" alt="" fill sizes="(max-width: 767px) 100vw, 50vw" />
      <span className={s.text}>Скоро — выпуск удобного приложения</span>
    </div>
  </div>
);

export default PromoBanner;
