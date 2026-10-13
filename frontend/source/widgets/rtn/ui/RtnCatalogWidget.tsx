import type { ReactNode } from "react";
import { CatalogSearch } from "@/source/features/rtn/catalog-search";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./RtnCatalogWidget.module.scss";

interface RtnCatalogWidgetProps {
  basePath: string;
  children: ReactNode;
}

/** Страница каталога: шапка с поиском, выдача с фильтрами (children) и приглашение задать вопрос. */
export function RtnCatalogWidget({ basePath, children }: RtnCatalogWidgetProps) {
  return (
    <div className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: basePath || "/" }, { label: "Ростехнадзор отвечает" }]} />

      <div className={s.head}>
        <Title text="Ростехнадзор отвечает: база официальных ответов" as="h1" className={s.title} />
        <Subtitle
          text="Актуальные ответы на сложные вопросы промышленной, энергетической и строительной безопасности. Систематизированная база официальных ответов Ростехнадзора."
          className={s.subtitle}
        />
      </div>

      <section className={s.banner}>
        <div className={s.bannerArt} aria-hidden="true" />
        <div className={s.bannerTop}>
          <h2 className={s.bannerTitle}>Официальный источник — Ростехнадзор</h2>
          <p className={s.bannerSub}>
            Письма и разъяснения федеральной службы по промышленной, экологической и энергетической безопасности
          </p>
        </div>
        <CatalogSearch />
      </section>

      <div className={s.layout}>{children}</div>

      <div className={s.askBlock}>
        <h2 className={s.askTitle}>Не нашли ответ?</h2>
        <p className={s.askDesc}>
          Отправьте вопрос — мы официально запросим разъяснение Ростехнадзора и опубликуем ответ в этом разделе.
        </p>
        <Button variant="primary" href={`${basePath}/rtn/ask`}>
          Задать вопрос
        </Button>
      </div>
    </div>
  );
}
