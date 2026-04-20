import styles from "./hero.module.scss";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { CheckIcon } from "@/source/shared/ui/icons";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.leftSection}>
        <Title text="Первая единая площадка для поиска аттестованных экспертов промышленной безопасности" />
        <Subtitle text="Размещайте заказы и находите проекты среди специалистов по всей России. Все эксперты имеют официальные аттестации Ростехнадзора" />
        <Button variant="primary" showArrow className={styles.heroButton}>
          Начать работать
        </Button>
      </div>
      <div className={styles.visual} aria-hidden="true">
        <img src="/hero_svg.svg" alt="Карьер" className={styles.heroImage} />

        <div className={styles.visualDecoration1}>
          <div className={styles.visualDecorationHeader}>
            <div className={styles.visualDecorationHeaderText}>
              <p>Анализ устойчивости борта карьера</p>
              <span>850 000 ₽</span>
            </div>
          </div>
          <div className={styles.visualDecorationBody}>
            <span>Требуется эксперт с аттестацией Э2 ЗС</span>
          </div>
        </div>

        <div className={styles.visualDecoration2}>
          <div className={styles.visualDecorationHeader}>
            <div className={styles.visualDecorationHeaderText}>
              <span>На ваш заказ откликнулось 7 экспертов</span>
            </div>
          </div>
        </div>

        <div className={styles.visualDecoration3}>
          <div className={styles.visualDecorationHeader}>
            <div className={styles.visualDecorationHeaderText}>
              <p>Проект вскрытия карьера</p>
              <div className={styles.checkIcon}>
                <CheckIcon />
                <span>Завершён</span>
              </div>
            </div>
          </div>
          <div className={styles.visualDecorationBody}>
            <span>Выполнил эксперт с аттестацией Э2 КЛ/ТП</span>
          </div>
        </div>

        <div className={styles.visualDecoration4}>
          <div className={styles.visualDecorationHeader}>
            <div className={styles.visualDecorationHeaderText}>
              <span>Отзыв опубликован!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
