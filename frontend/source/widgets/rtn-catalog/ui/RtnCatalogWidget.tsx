"use client";

import type { ReactNode } from "react";
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
  const { searchInput, setSearchInput, clearSearch } = useRtnCatalogFilters({ liveSearch: true });
  const askHref = homeHref === "/landing" ? "/landing/rtn/ask" : "/rtn/ask";

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
          {/* eslint-disable-next-line @next/next/no-img-element -- vector emblem, Next's raster pipeline can't optimize/preserve SVG transparency */}
          <img className={s.bannerArtImg} src="/rtn-emblem.svg" alt="" />
        </div>

        <div className={s.bannerTop}>
          <h2 className={s.bannerTitle}>Официальный источник — Ростехнадзор</h2>
          <p className={s.bannerSub}>Письма и разъяснения федеральной службы по промышленной, экологической и энергетической безопасности</p>
        </div>

        <div className={s.searchWrap} role="search">
          <div className={s.searchBar}>
            <SearchIcon className={s.searchIcon} />
            <input
              type="text"
              className={s.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Поиск по заголовку или номеру документа"
            />
            {searchInput && (
              <button type="button" className={s.clearBtn} onClick={clearSearch} aria-label="Очистить">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className={s.layout}>{children}</div>

      <div className={s.askBlock}>
        <h2 className={s.askTitle}>Не нашли ответ?</h2>
        <p className={s.askDesc}>
          Отправьте вопрос — мы официально запросим разъяснение Ростехнадзора и опубликуем ответ в этом разделе.
        </p>
        <Button variant="primary" href={askHref}>
          Задать вопрос
        </Button>
      </div>
    </div>
  );
}
