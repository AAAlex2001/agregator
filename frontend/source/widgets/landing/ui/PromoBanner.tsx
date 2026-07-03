import { PromoAppIcon, PromoBotIcon } from "@/source/shared/ui/icons";
import s from "./promo-banner.module.scss";

const PromoBanner = () => (
  <div className={s.banner}>
    <div className={`${s.half} ${s.tg}`}>
      <PromoBotIcon className={s.icon} width={22} height={22} />
      <span className={s.text}>Скоро — выпуск удобного Telegram-бота</span>
    </div>
    <div className={`${s.half} ${s.app}`}>
      <PromoAppIcon className={s.icon} width={22} height={22} />
      <span className={s.text}>Скоро — выпуск удобного приложения</span>
    </div>
  </div>
);

export default PromoBanner;
