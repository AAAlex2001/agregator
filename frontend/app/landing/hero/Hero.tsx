import styles from "./hero.module.scss";
import Image from "next/image";


const Hero = () => {
  return (
    <section className={styles.hero}>
        <div className={styles.leftSection}>
        <h1>
          Единственная площадка для аттестованных экспертов промышленной безопасности
        </h1>
        <p>
          Размещайте заказы и находите проекты среди специалистов со всей России. Все эксперты имеют официальные аттестации Ростехнадзора
        </p>
          <button className={styles.primary}> Начать работать </button>
      </div>
      <div className={styles.visual} aria-hidden="true">
          <Image src="/hero_svg.svg" alt="Карьер" width={787} height={412} />

      </div>

         <div className={styles.visualDecoration1}>
            <div className={styles.visualDecorationHeader}>
                <div className={styles.visualDecorationHeaderText}>
                    <p>Анализ устойчивости борта карьера</p>
                    <span>850 000 ₽</span>
                </div>
            </div>

            <div className={styles.visualDecorationBody}>
                <span>Требуется эксперт с аттестацией Э2 ЗС</span>
            </div>
        </div>

    </section>
  );
};

export default Hero;

