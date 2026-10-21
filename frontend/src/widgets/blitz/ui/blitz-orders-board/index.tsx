"use client";

import { useState } from "react";
import { BlitzOrderCard, BlitzOrderCardSkeleton, useBlitzOrders } from "@/entities/blitz-order";
import type { BlitzOrderScope, BlitzOrderSummary } from "@/entities/blitz-order";
import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Subtitle } from "@/shared/ui/subtitle";
import { Tabs } from "@/shared/ui/tabs";
import { Title } from "@/shared/ui/title";
import { CUSTOMER_TABS, EMPTY_TEXTS, EXPERT_TABS, FINISHED_STATUSES } from "../../config/board";
import type { BoardTab } from "../../config/board";
import styles from "./style.module.scss";

/** Что такое Блиц-эксперт. */
const BOARD_SUBTITLE = "Экспертиза промышленной безопасности и аудит СУПБ: "
  + "договор, оплата и результат в одном окне";

/** Сколько заготовок показать при загрузке. */
const SKELETONS = [1, 2, 3, 4];

/** Заявки вкладки: завершённые и активные у заказчика делятся по статусу. */
function visibleOrders(orders: BlitzOrderSummary[], tab: BoardTab): BlitzOrderSummary[] {
  if (tab === "active") {
    return orders.filter((order) => !FINISHED_STATUSES.includes(order.status));
  }

  if (tab === "finished") {
    return orders.filter((order) => FINISHED_STATUSES.includes(order.status));
  }

  return orders;
}

/** Откуда грузить заявки вкладки. */
function scopeOf(tab: BoardTab): BlitzOrderScope {
  if (tab === "incoming") {
    return "incoming";
  }

  return tab === "assigned" ? "assigned" : "my";
}

/** Заявки Блиц-эксперта: заказчику — свои, эксперту — новые подходящие и взятые в работу. */
export function BlitzOrdersBoard() {
  const { user } = useUser();
  const isExpert = user?.role === "EXPERT";
  const tabs = isExpert ? EXPERT_TABS : CUSTOMER_TABS;
  const [chosenTab, setChosenTab] = useState<BoardTab | null>(null);
  const tab = chosenTab && tabs.some((item) => item.id === chosenTab) ? chosenTab : tabs[0].id;
  const { orders, error, isLoading } = useBlitzOrders(scopeOf(tab));
  const shown = visibleOrders(orders, tab);

  return (
    <div className={styles.board}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <Title
            as="h1"
            text="Блиц-эксперт"
          />
          <Subtitle text={BOARD_SUBTITLE} />
        </div>
        {!isExpert && (
          <div className={styles.actions}>
            <Button
              variant="outline"
              href="/blitz/audit/new"
            >
              Аудит СУПБ
            </Button>
            <Button href="/blitz/new">Экспертиза</Button>
          </div>
        )}
      </div>

      <Tabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={(id) => setChosenTab(tabs.find((item) => item.id === id)?.id ?? null)}
      />

      {error && <p className={styles.error}>{error}</p>}

      {isLoading && (
        <div className={styles.grid}>
          {SKELETONS.map((key) => <BlitzOrderCardSkeleton key={key} />)}
        </div>
      )}

      {!isLoading && !error && shown.length === 0 && (
        <EmptyState
          title={EMPTY_TEXTS[tab].title}
          subtitle={EMPTY_TEXTS[tab].subtitle}
          actionLabel={isExpert ? undefined : "Подать заявку"}
          actionHref={isExpert ? undefined : "/blitz/new"}
        />
      )}

      {!isLoading && shown.length > 0 && (
        <div className={styles.grid}>
          {shown.map((order) => (
            <BlitzOrderCard
              key={order.id}
              order={order}
              isExpert={isExpert}
            />
          ))}
        </div>
      )}
    </div>
  );
}
