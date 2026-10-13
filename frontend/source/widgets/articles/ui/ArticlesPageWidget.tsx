import { ArticlesSlider, type ArticleKind, type ArticleList, type ArticleListItem } from "@/source/entities/article";
import { ArticlesList } from "@/source/features/articles/list";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./ArticlesPageWidget.module.scss";

interface CrossSection {
  title: string;
  href: string;
  hrefLabel: string;
  items: ArticleListItem[];
}

interface ArticlesPageWidgetProps {
  kind: ArticleKind;
  title: string;
  subtitle: string;
  initial: ArticleList;
  initialOffset?: number;
  homeHref?: string;
  nextPageHref?: string;
  cross?: CrossSection;
}

/** Страница новостей или блога: заголовок, список с фильтрами и слайдер соседнего раздела внизу. */
export function ArticlesPageWidget({
  kind,
  title,
  subtitle,
  initial,
  initialOffset,
  homeHref = "/",
  nextPageHref,
  cross,
}: ArticlesPageWidgetProps) {
  return (
    <div className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: homeHref }, { label: kind === "news" ? "Новости" : "Блог" }]} />

      <div className={s.head}>
        <Title text={title} as="h1" className={s.title} />
        <Subtitle text={subtitle} className={s.subtitle} />
      </div>

      <ArticlesList kind={kind} initial={initial} initialOffset={initialOffset} nextPageHref={nextPageHref} />

      {cross && <ArticlesSlider title={cross.title} items={cross.items} cta={{ href: cross.href, label: cross.hrefLabel }} />}
    </div>
  );
}
