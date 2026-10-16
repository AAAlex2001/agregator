import type { ReactNode } from "react";
import { RtnSearch } from "@/features/search-rtn";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Префикс публичных или кабинетных ссылок и серверная выдача каталога. */
interface RtnCatalogProps {
  basePath: string;
  children: ReactNode;
}

/** Собирает шапку каталога, поиск, выдачу и приглашение задать вопрос. */
export function RtnCatalog({ basePath, children }: RtnCatalogProps) {
  return (
    <div className={styles.wrapper}>
      <Breadcrumbs
        items={[
          {
            label: "Главная",
            href: basePath || "/",
          },
          {
            label: "Ростехнадзор отвечает",
          },
        ]}
      />

      <div className={styles.head}>
        <Title
          text="Ростехнадзор отвечает: база официальных ответов"
          as="h1"
          className={styles.title}
        />
        <Subtitle
          text="Актуальные ответы на сложные вопросы промышленной, энергетической и строительной безопасности. Систематизированная база официальных ответов Ростехнадзора."
          className={styles.subtitle}
        />
      </div>

      <section className={styles.banner}>
        <div
          className={styles.bannerArt}
          aria-hidden="true"
        />
        <div className={styles.bannerTop}>
          <h2 className={styles.bannerTitle}>
            Официальный источник — Ростехнадзор
          </h2>
          <p className={styles.bannerSub}>
            Письма и разъяснения федеральной службы по промышленной, экологической
            и энергетической безопасности
          </p>
        </div>
        <RtnSearch />
      </section>

      <div className={styles.layout}>{children}</div>

      <div className={styles.askBlock}>
        <h2 className={styles.askTitle}>Не нашли ответ?</h2>
        <p className={styles.askDesc}>
          Отправьте вопрос — мы официально запросим разъяснение Ростехнадзора и опубликуем ответ
          в этом разделе.
        </p>
        <Button
          variant="primary"
          href={`${basePath}/rtn/ask`}
        >
          Задать вопрос
        </Button>
      </div>
    </div>
  );
}
