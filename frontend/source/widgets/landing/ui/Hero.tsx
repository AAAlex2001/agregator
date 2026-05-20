import Image from "next/image";
import s from "./hero.module.scss";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { CheckIcon } from "@/source/shared/ui/icons";

type HeroProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  bullets: string[];
};

const Hero = ({ title, subtitle, buttonText, bullets }: HeroProps) => {
  const hasBullets = bullets.length > 0;

  return (
    <section className={s.hero} id="about">
      <div className={s.leftSection}>
        <header className={s.heroHeader}>
          <Title text={title} />
          {hasBullets && (
            <ul className={s.bullets}>
              {bullets.map((bullet) => (
                <li key={bullet} className={s.bulletItem}>
                  <CheckIcon className={s.bulletIcon} />
                  <span className={s.bulletText}>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
          <Subtitle text={subtitle} />
        </header>
        <Button href="/register" variant="primary" fullWidth showArrow className={s.heroButton}>
          {buttonText}
        </Button>
      </div>
      <div className={s.visual} aria-hidden="true" data-nosnippet>
        <Image
          src="/hero_svg.webp"
          alt="Экспертиза промышленной безопасности опасных производственных объектов — платформа Ресурс-Плюс"
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
