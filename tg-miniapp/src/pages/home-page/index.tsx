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
import { ChatSheet, useChats } from "@/features/chat";
import { BlogStrip } from "@/features/blog";
import { EditOrderSheet } from "@/features/edit-order";
import { LeaveReviewFullSheet, type ReviewTarget } from "@/features/leave-review";
import { FilterSheet, VIEW_LABEL, type FeedView } from "@/features/feed-filter";
import { type CustomerSortBy, type ExpertResponse, type SortDir } from "@/entites/response";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Button, EmptyState, Logo, SortSheet, type SortChoice } from "@/shared/ui";
import { UserIcon, FilterIcon, ReviewsIcon, SortIcon, ChatIcon, CompassIcon } from "@/shared/ui/icons/interface";
import { EmptyArchiveIcon, EmptyOrdersIcon } from "@/shared/ui/icons/empty";
import s from "./style.module.scss";

const CUSTOMER_VIEW_LABEL: Record<FeedView, string> = {
  orders: "Мои заказы",
  responses: "Отклики",
  archive: "Архивные",
};

const RESPONSE_SORTS: SortChoice[] = [
  { key: "created_at", dir: "desc", label: "По дате — сначала новые" },
  { key: "created_at", dir: "asc", label: "По дате — сначала старые" },
  { key: "proposed_sum_amount", dir: "desc", label: "По цене — сначала дороже" },
  { key: "proposed_sum_amount", dir: "asc", label: "По цене — сначала дешевле" },
  { key: "expert_rating", dir: "desc", label: "По рейтингу — сначала выше" },
  { key: "expert_rating", dir: "asc", label: "По рейтингу — сначала ниже" },
];

export function HomePage() {
  const { role, profile } = useSession();
  const navigate = useNavigate();
  const [view, setView] = useState<FeedView>("orders");
  const [filterOpen, setFilterOpen] = useState(false);
  const [respondOrder, setRespondOrder] = useState<Order | null>(null);
  const [archiveOrder, setArchiveOrder] = useState<Order | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [respSort, setRespSort] = useState<SortChoice>(RESPONSE_SORTS[0]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatUuid, setChatUuid] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [review, setReview] = useState<ReviewTarget | null>(null);
  const chatBadge = useChats();

  const openChatThread = (uuid: string) => {
    setChatUuid(uuid);
    setChatOpen(true);
  };

  const reviewFromOrder = (order: Order) => {
    if (order.accepted_response_id === null) return;
    setReview({ responseId: order.accepted_response_id, expertName: order.executor_name, orderTitle: order.title });
  };

  const reviewFromResponse = (response: ExpertResponse) => {
    setReview({ responseId: response.id, expertName: response.expert_name, orderTitle: response.order_title });
  };

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
        <>
          <button
            className={s.iconBtn}
            aria-label="Полезное"
            onClick={() => {
              tapHaptic();
              navigate("/useful");
            }}
          >
            <CompassIcon width={22} height={22} />
          </button>
          <button
            className={s.iconBtn}
            aria-label="Чаты"
            onClick={() => {
              tapHaptic();
              setChatOpen(true);
            }}
          >
            <ChatIcon width={22} height={22} />
            {chatBadge.unread > 0 && <span className={s.chatBadge}>{chatBadge.unread > 99 ? "99+" : chatBadge.unread}</span>}
          </button>
          <button
            className={s.iconBtn}
            aria-label="Отзывы экспертов"
            onClick={() => {
              tapHaptic();
              navigate("/experts-reviews");
            }}
          >
            <ReviewsIcon width={22} height={22} />
          </button>
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
        </>
      }
      panel
      hero={<BlogStrip />}
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
              empty={
                <EmptyState
                  icon={<EmptyOrdersIcon />}
                  title="Пока нет подходящих заказов"
                  subtitle="Новые заказы по вашим областям аттестации появятся здесь"
                />
              }
            />
          )}
          {view === "archive" && (
            <OrdersPanel
              archived
              limit={20}
              onOpen={setArchiveOrder}
              empty={
                <EmptyState
                  icon={<EmptyArchiveIcon />}
                  title="Архив пуст"
                  subtitle="Завершённые заказы будут храниться здесь"
                />
              }
            />
          )}
          {view === "responses" && <ResponsesPanel onOpenChat={openChatThread} />}
        </>
      ) : (
        <>
          <div className={s.feedHead}>
            <p className={s.sectionTitle}>{CUSTOMER_VIEW_LABEL[view]}</p>
            <div className={s.headBtns}>
              {view === "responses" && (
                <button
                  className={s.filterBtn}
                  aria-label="Сортировка"
                  onClick={() => {
                    tapHaptic();
                    setSortOpen(true);
                  }}
                >
                  <SortIcon width={20} height={20} />
                </button>
              )}
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
          </div>
          {view === "responses" ? (
            <CustomerResponsesPanel
              sortBy={respSort.key as CustomerSortBy}
              sortDir={respSort.dir as SortDir}
              onOpenChat={openChatThread}
              onCompleted={reviewFromResponse}
            />
          ) : (
            <CustomerOrdersPanel
              view={view}
              refreshKey={refreshKey}
              viewerId={profile?.id ?? null}
              onOpen={setArchiveOrder}
              onEdit={setEditOrder}
              onLeaveReview={reviewFromOrder}
              emptyActive={
                <EmptyState
                  icon={<EmptyOrdersIcon />}
                  title="Вы ещё не создали ни одного заказа"
                  subtitle="Опубликуйте заказ, чтобы получить отклики от экспертов по промышленной безопасности"
                />
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

      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        choices={RESPONSE_SORTS}
        value={respSort}
        onSelect={setRespSort}
      />

      <RespondSheet order={respondOrder} onClose={() => setRespondOrder(null)} />

      <ArchiveOrderSheet order={archiveOrder} onClose={() => setArchiveOrder(null)} />

      <EditOrderSheet
        order={editOrder}
        onClose={() => setEditOrder(null)}
        onSaved={() => {
          setEditOrder(null);
          setRefreshKey((k) => k + 1);
        }}
      />

      <ChatSheet
        open={chatOpen}
        initialUuid={chatUuid}
        onClose={() => {
          setChatOpen(false);
          setChatUuid(null);
          void chatBadge.reload();
        }}
      />

      {!isExpert && (
        <>
          <CreateOrderSheet
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onCreated={() => setRefreshKey((k) => k + 1)}
          />
          <LeaveReviewFullSheet
            target={review}
            onClose={() => setReview(null)}
            onSubmitted={() => setRefreshKey((k) => k + 1)}
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
