import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Иллюстрация, текст и необязательное действие в карточке лендинга. */
interface LandingImageCardProps {
  as?: "div" | "article";
  image: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/** Собирает одинаковую карточку направления или преимущества платформы. */
export function LandingImageCard({
  as: Tag = "article",
  image,
  title,
  description,
  children,
}: LandingImageCardProps) {
  return (
    <Tag className={styles.card}>
      <div className={styles.image}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="380px"
          className={styles.img}
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardText}>{description}</p>
        {children}
      </div>
    </Tag>
  );
}
