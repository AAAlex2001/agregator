import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/session";
import { type Order } from "@/entites/order";
import { RespondSheet } from "@/features/respond-order";
import { ResponsesPanel } from "@/features/responses";
import { ArchiveOrderSheet } from "@/features/archive-order";
import { OrdersPanel } from "@/features/order-feed";
import { CustomerOrdersPanel } from "@/features/customer-orders";
import { CustomerResponsesPanel } from "@/features/customer-responses";
import { CreateOrderSheet } from "@/features/create-order";
import { FilterSheet, VIEW_LABEL, type FeedView } from "@/features/feed-filter";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Button, Logo } from "@/shared/ui";
import { UserIcon, FilterIcon } from "@/shared/ui/icons/interface";
import { EmptyOrdersIcon } from "@/shared/ui/icons/empty";
import s from "./style.module.scss";

const CUSTOMER_VIEW_LABEL: Record<FeedView, string> = {
  orders: "Мои заказы",
  responses: "Отклики",
  archive: "Архивные",
};

export function HomePage() {
  const { role } = useSession();
  const navigate = useNavigate();
  const [view, setView] = useState<FeedView>("orders");
  const [filterOpen, setFilterOpen] = useState(false);
  const [respondOrder, setRespondOrder] = useState<Order | null>(null);
  const [archiveOrder, setArchiveOrder] = useState<Order | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isExpert = role === "EXPERT";

  return (
    <Screen
      title={
        <>
          <Logo size={28} className={s.logoMark} />
          <span>
            Ресурс-<span className={s.brandPlus}>Плюс</span>
          </span>
        </>
      }
      right={
        <button
          className={s.iconBtn}
          aria-label="Профиль"
          onClick={() => {
            tapHaptic();
            navigate("/profile");
          }}
        >
          <UserIcon width={22} height={22} />
        </button>
      }
      panel
    >
      {isExpert ? (
        <>
          <div className={s.feedHead}>
            <p className={s.sectionTitle}>{VIEW_LABEL[view]}</p>
            <button
              className={s.filterBtn}
              aria-label="Фильтр"
              onClick={() => {
                tapHaptic();
                setFilterOpen(true);
              }}
            >
              <FilterIcon width={20} height={20} />
            </button>
          </div>

          {view === "orders" && (
            <OrdersPanel
              onOpen={setRespondOrder}
              empty={<p className={s.emptyLine}>Пока нет подходящих заказов</p>}
            />
          )}
          {view === "archive" && (
            <OrdersPanel
              archived
              limit={20}
              onOpen={setArchiveOrder}
              empty={<p className={s.emptyLine}>Архив пуст</p>}
            />
          )}
          {view === "responses" && <ResponsesPanel />}
        </>
      ) : (
        <>
          <div className={s.feedHead}>
            <p className={s.sectionTitle}>{CUSTOMER_VIEW_LABEL[view]}</p>
            <button
              className={s.filterBtn}
              aria-label="Фильтр"
              onClick={() => {
                tapHaptic();
                setFilterOpen(true);
              }}
            >
              <FilterIcon width={20} height={20} />
            </button>
          </div>
          {view === "responses" ? (
            <CustomerResponsesPanel />
          ) : (
            <CustomerOrdersPanel
              view={view}
              refreshKey={refreshKey}
              onOpen={setArchiveOrder}
              emptyActive={
                <div className={s.emptyState}>
                  <EmptyOrdersIcon />
                  <p className={s.emptyTitle}>Вы ещё не создали ни одного заказа</p>
                  <p className={s.emptySub}>
                    Опубликуйте заказ, чтобы получить отклики от экспертов по промышленной безопасности
                  </p>
                </div>
              }
            />
          )}
          <div className={s.createSpacer} />
        </>
      )}

      <FilterSheet
        open={filterOpen}
        view={view}
        onChangeView={setView}
        onClose={() => setFilterOpen(false)}
        views={isExpert ? undefined : ["orders", "responses", "archive"]}
        labels={isExpert ? undefined : CUSTOMER_VIEW_LABEL}
      />

      <RespondSheet order={respondOrder} onClose={() => setRespondOrder(null)} />

      <ArchiveOrderSheet order={archiveOrder} onClose={() => setArchiveOrder(null)} />

      {!isExpert && (
        <>
          <CreateOrderSheet
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onCreated={() => setRefreshKey((k) => k + 1)}
          />
          <div className={s.createBar}>
            <Button
              onClick={() => {
                tapHaptic();
                setCreateOpen(true);
              }}
            >
              Создать заказ
            </Button>
          </div>
        </>
      )}
    </Screen>
  );
}
