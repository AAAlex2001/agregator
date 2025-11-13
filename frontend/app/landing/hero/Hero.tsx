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
    </section>
  );
};

export default Hero;

