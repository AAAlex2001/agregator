"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Button from "@/source/shared/ui/Button";
import { SearchIcon } from "@/source/shared/ui/icons";
import { useRtnCatalogFilters } from "@/source/features/rtn-catalog";
import s from "./RtnCatalogWidget.module.scss";

interface Props {
  homeHref?: string;
  children: ReactNode;
}

export function RtnCatalogWidget({ homeHref = "/", children }: Props) {
  "Статичная оболочка (крошки/заголовок/поиск) не зависит от серверных данных и рендерится мгновенно — \
данные (фильтры + сетка карточек) приходят через children, обёрнутые снаружи в Suspense со скелетоном."
  const { searchInput, setSearchInput, submitSearch, clearSearch } = useRtnCatalogFilters();

  return (
    <div className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: homeHref }, { label: "Ростехнадзор отвечает" }]} />

      <div className={s.head}>
        <Title text="Ростехнадзор отвечает: база официальных ответов" as="h1" className={s.title} />
        <Subtitle
          text="Актуальные ответы на сложные вопросы промышленной, энергетической и строительной безопасности. Систематизированная база официальных ответов Ростехнадзора."
          className={s.subtitle}
        />
      </div>

      <section className={s.banner}>
        <div className={s.bannerArt} aria-hidden="true">
          <Image
            className={s.bannerArtImg}
            src="/rtn-emblem.png"
            alt=""
            fill
            sizes="(max-width: 899px) 0px, 420px"
          />
        </div>

        <form
          className={s.searchWrap}
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch();
          }}
        >
          <div className={s.searchBar}>
            <SearchIcon className={s.searchIcon} />
            <input
              type="text"
              className={s.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Поиск по ключевым словам, номеру письма или названию оборудования"
            />
            {searchInput && (
              <button type="button" className={s.clearBtn} onClick={clearSearch} aria-label="Очистить">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <Button type="submit" variant="primary" size="md">
              Найти
            </Button>
          </div>
        </form>
      </section>

      <div className={s.layout}>{children}</div>
    </div>
  );
}
