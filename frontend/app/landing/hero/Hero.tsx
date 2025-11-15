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
          <button className={styles.primary}>
            Начать работать
            <span aria-hidden="true" className={styles.arrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12L13 18M19 12L13 6M19 12H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
      </div>
      <div className={styles.visual} aria-hidden="true">
          <Image src="/hero_svg.svg" alt="Карьер" width={787} height={412} />


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

      </div>

    </section>
  );
};

export default Hero;

