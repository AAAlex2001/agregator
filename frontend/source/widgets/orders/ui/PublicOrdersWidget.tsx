"use client";

import { useEffect, useState } from "react";
import { PENDING_ORDER_UUID_KEY, type OrdersApiList, type OrderSortBy } from "@/source/entities/order";
import { PublicOrdersList } from "@/source/features/orders/public-list";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { SortPills, type SortDir, type SortPillSpec } from "@/source/shared/ui/SortPills";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./PublicOrdersWidget.module.scss";

const SORT_OPTIONS: SortPillSpec<OrderSortBy>[] = [
  { key: "created_at", label: "Дата публикации", descLabel: "Сначала новые", ascLabel: "Сначала старые" },
  { key: "sum_amount", label: "Начальная цена", descLabel: "Сначала дороже", ascLabel: "Сначала дешевле" },
  { key: "responses_deadline", label: "Приём откликов", ascLabel: "Скоро закрытие", descLabel: "Позже закрытие" },
];

interface PublicOrdersWidgetProps {
  initial: OrdersApiList;
}

/** Публичная лента заявок. Первая страница приходит с сервера; смена сортировки перечитывает список. */
export function PublicOrdersWidget({ initial }: PublicOrdersWidgetProps) {
  const [sort, setSort] = useState<{ by: OrderSortBy | null; dir: SortDir | null }>({ by: null, dir: null });

  useEffect(() => {
    sessionStorage.removeItem(PENDING_ORDER_UUID_KEY);
  }, []);

  return (
    <section className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Заявки" }]} />
      <div className={s.pageHead}>
        <Title text="Актуальные и архивные заявки" as="h1" className={s.pageTitle} />
        <Subtitle text="Просматривайте задачи на платформе. Чтобы откликнуться, войдите или зарегистрируйтесь." className={s.pageSubtitle} />
      </div>
      <div className={s.sortRow}>
        <SortPills options={SORT_OPTIONS} sortBy={sort.by} sortDir={sort.dir} onChange={(by, dir) => setSort({ by, dir })} />
      </div>
      <PublicOrdersList key={`${sort.by}-${sort.dir}`} sortBy={sort.by} sortDir={sort.dir} initial={sort.by ? undefined : initial} />
    </section>
  );
}
