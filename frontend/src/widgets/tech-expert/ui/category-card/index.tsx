import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Значок, название и описание раздела фонда. */
interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

/** Карточка раздела фонда на стартовом экране поиска. */
export function CategoryCard({ icon, title, description }: CategoryCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
    </div>
  );
}
