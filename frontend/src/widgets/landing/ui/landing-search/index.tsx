import type { ReactNode } from "react";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Форма поиска заказов, подключённая страницей приложения. */
interface LandingSearchProps {
  children: ReactNode;
}

/** Добавляет заголовок и прежнюю ширину блока поиска на странице направления. */
export function LandingSearch({ children }: LandingSearchProps) {
  return (
    <section
      className={styles.section}
      id="search"
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <Title text="Все заказы на одной площадке" />
          <Subtitle
            text="Найдите проект по наименованию работы или наименованию организации(заказчика) — покажем все актуальные и архивные заказы платформы"
          />
        </header>
        <div className={styles.bar}>{children}</div>
      </div>
    </section>
  );
}
