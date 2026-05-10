import Image from "next/image";
import s from "./hero.module.scss";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { CheckIcon } from "@/source/shared/ui/icons";
import { OrderSearchBar } from "@/source/features/order-search";

type HeroProps = {
  title: string;
  subtitle: string;
  buttonText: string;
};

const Hero = ({ title, subtitle, buttonText }: HeroProps) => {
  return (
    <section className={s.hero} id="about">
      <div className={s.leftSection}>
        <header className={s.heroHeader}>
          <Title text={title} />
          <Subtitle text={subtitle} />
        </header>
        <Button href="/register" variant="primary" fullWidth showArrow className={s.heroButton}>
          {buttonText}
        </Button>
        <div className={s.searchBar}>
          <OrderSearchBar />
        </div>
      </div>
      <div className={s.visual} aria-hidden="true" data-nosnippet>
        <Image
          src="/hero_svg.webp"
          alt="Карьер"
          width={787}
          height={412}
          priority
          sizes="(max-width: 1440px) 100vw, 787px"
          className={s.heroImage}
        />

        <div className={s.visualDecoration1}>
          <div className={s.visualDecorationHeader}>
            <div className={s.visualDecorationHeaderText}>
              <p>Анализ устойчивости борта карьера</p>
              <span>850 000 ₽</span>
            </div>
          </div>
          <div className={s.visualDecorationBody}>
            <span>Требуется эксперт с аттестацией Э2 ЗС</span>
          </div>
        </div>

        <div className={s.visualDecoration2}>
          <div className={s.visualDecorationHeader}>
            <div className={s.visualDecorationHeaderText}>
              <span>На ваш заказ откликнулось 7 экспертов</span>
            </div>
          </div>
        </div>

        <div className={s.visualDecoration3}>
          <div className={s.visualDecorationHeader}>
            <div className={s.visualDecorationHeaderText}>
              <p>Проект вскрытия карьера</p>
              <div className={s.checkIcon}>
                <CheckIcon />
                <span>Завершён</span>
              </div>
            </div>
          </div>
          <div className={s.visualDecorationBody}>
            <span>Выполнил эксперт с аттестацией Э2 КЛ/ТП</span>
          </div>
        </div>

        <div className={s.visualDecoration4}>
          <div className={s.visualDecorationHeader}>
            <div className={s.visualDecorationHeaderText}>
              <span>Отзыв опубликован!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
