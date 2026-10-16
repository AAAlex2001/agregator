"use client";

import { useState } from "react";
import { filterExpertContacts, useExpertContacts } from "@/entities/expert-contact";
import type { ContactAccessFilter, ExpertContactsFilter } from "@/entities/expert-contact";
import { SearchIcon } from "@/shared/ui/icons";
import type { SortDirection } from "@/shared/ui/sort-pill";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import { Title } from "@/shared/ui/title";
import { ExpertContactsList } from "../expert-contacts-list";
import { RatingSort } from "../rating-sort";
import styles from "./style.module.scss";

/** Исполнитель, к карточке которого ведёт ссылка, и вход для гостя. */
interface ExpertContactsCatalogProps {
  targetExpertId?: string;
  onOpenLogin: () => void;
}

/** Показывает исполнителей с поиском по ФИО, отбором по доступу и сортировкой. */
export function ExpertContactsCatalog({
  targetExpertId,
  onOpenLogin,
}: ExpertContactsCatalogProps) {
  const { experts } = useExpertContacts();
  const [filter, setFilter] = useState<ExpertContactsFilter>({
    search: "",
    access: "ALL",
    ratingSort: null,
  });
  const visibleExperts = filterExpertContacts(experts, filter);
  const openCount = experts.filter((expert) => expert.sales_enabled).length;

  /** Меняет поиск исполнителя по ФИО. */
  function changeSearch(search: string) {
    setFilter({ ...filter, search });
  }

  /** Отбирает исполнителей по открытому или закрытому доступу. */
  function changeAccess(access: string) {
    setFilter({ ...filter, access: access as ContactAccessFilter });
  }

  /** Меняет порядок исполнителей по рейтингу. */
  function changeRatingSort(ratingSort: SortDirection | null) {
    setFilter({ ...filter, ratingSort });
  }

  return (
    <section
      className={styles.catalog}
      aria-label="Исполнители платформы"
    >
      <div className={styles.head}>
        <div className={styles.titleRow}>
          <Title
            text="Исполнители платформы"
            as="h2"
            className={styles.title}
          />
          <span className={styles.count}>{visibleExperts.length}</span>
        </div>
        <div className={styles.search}>
          <TextInput
            value={filter.search}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder="ФИО исполнителя"
            aria-label="Фильтр исполнителей по ФИО"
            suffix={<SearchIcon />}
          />
        </div>
      </div>

      <div className={styles.filters}>
        <Tabs
          className={styles.accessTabs}
          activeTab={filter.access}
          onTabChange={changeAccess}
          tabs={[
            {
              id: "ALL",
              label: `Все · ${experts.length}`,
            },
            {
              id: "OPEN",
              label: `Доступ открыт · ${openCount}`,
            },
            {
              id: "CLOSED",
              label: `Доступ закрыт · ${experts.length - openCount}`,
            },
          ]}
        />
        <RatingSort
          direction={filter.ratingSort}
          onChange={changeRatingSort}
        />
      </div>

      <ExpertContactsList
        experts={visibleExperts}
        targetExpertId={targetExpertId}
        onOpenLogin={onOpenLogin}
      />
    </section>
  );
}
