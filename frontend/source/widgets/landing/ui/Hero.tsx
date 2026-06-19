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
  compact?: boolean;
};

const Hero = ({ title, subtitle, buttonText, bullets, compact = false }: HeroProps) => {
  const hasBullets = bullets.length > 0;
  const sectionClass = compact ? `${s.hero} ${s.heroCompact}` : s.hero;

  return (
    <section className={sectionClass} id="about">
      <header className={s.heroTitle}>
        <Title text={title} as="h1" className={s.heroTitleText} />
      </header>
      <div className={s.heroBody}>
        <div className={s.leftSection}>
          <div className={s.heroHeader}>
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
            <Subtitle text={subtitle} className={s.heroSubtitle} />
          </div>
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
      </div>
    </section>
  );
};

export default Hero;
