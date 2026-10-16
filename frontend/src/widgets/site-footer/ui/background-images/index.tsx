import Image from "next/image";
import styles from "./style.module.scss";

/** Сохраняет порядок декоративных изображений, используемый адаптивными стилями. */
export function BackgroundImages() {
  return (
    <>
      <div className={styles.backgroundImage}>
        <Image
          src="/belaz_3.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="354px"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.backgroundImageCoal}>
        <Image
          src="/gold.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="246px"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.backgroundImageCoal}>
        <Image
          src="/coal.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="246px"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.backgroundImageCoal}>
        <Image
          src="/gold.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="486px"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.backgroundImageCoal}>
        <Image
          src="/copper.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="390px"
          style={{ objectFit: "contain" }}
        />
      </div>
    </>
  );
}
