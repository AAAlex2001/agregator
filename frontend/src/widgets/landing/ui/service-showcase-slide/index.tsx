import Image from "next/image";
import type { ServiceShowcaseItem } from "../../model/types";
import styles from "./style.module.scss";

/** Пункт каталога для мобильного слайдера. */
interface ServiceShowcaseSlideProps {
  item: ServiceShowcaseItem;
}

/** Показывает иллюстрацию и пояснение пункта в мобильной карточке. */
export function ServiceShowcaseSlide({ item }: ServiceShowcaseSlideProps) {
  return (
    <>
      <div className={styles.slideImage}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="90vw"
          className={styles.slideImg}
        />
      </div>
      <div className={styles.slideBody}>
        <h3 className={styles.slideTitle}>{item.title}</h3>
        <p className={styles.slideDesc}>{item.text}</p>
      </div>
    </>
  );
}
