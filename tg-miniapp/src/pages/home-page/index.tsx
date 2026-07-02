import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/session";
import { type Order } from "@/entites/order";
import { type ResponseTab } from "@/entites/response";
import { RespondSheet } from "@/features/respond-order";
import { ResponsesPanel } from "@/features/responses";
import { OrdersPanel } from "@/features/order-feed";
import { FilterSheet, VIEW_LABEL, type FeedView } from "@/features/feed-filter";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Button, BottomSheet, Logo } from "@/shared/ui";
import { UserIcon, FilterIcon } from "@/shared/ui/icons/interface";
import { EmptyOrdersIcon } from "@/shared/ui/icons/empty";
import s from "./style.module.scss";

export function HomePage() {
  const { role } = useSession();
  const navigate = useNavigate();
  const [view, setView] = useState<FeedView>("orders");
  const [respTab, setRespTab] = useState<ResponseTab>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [soonOpen, setSoonOpen] = useState(false);
  const [soonTitle, setSoonTitle] = useState("");
  const [respondOrder, setRespondOrder] = useState<Order | null>(null);

  const isExpert = role === "EXPERT";

  const openRespond = (o: Order) => {
    if (isExpert) {
      setRespondOrder(o);
    } else {
      setSoonTitle(o.title);
      setSoonOpen(true);
    }
  };

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
              onOpen={openRespond}
              empty={<p className={s.emptyLine}>Пока нет подходящих заказов</p>}
            />
          )}
          {view === "archive" && (
            <OrdersPanel archived limit={20} empty={<p className={s.emptyLine}>Архив пуст</p>} />
          )}
          {view === "responses" && <ResponsesPanel tab={respTab} />}
        </>
      ) : (
        <>
          <p className={s.sectionTitle}>Мои заказы</p>
          <OrdersPanel
            onOpen={openRespond}
            empty={
              <div className={s.emptyState}>
                <EmptyOrdersIcon />
                <p className={s.emptyTitle}>Вы ещё не создали ни одного заказа</p>
                <p className={s.emptySub}>
                  Опубликуйте заказ, чтобы получить отклики от экспертов по промышленной безопасности
                </p>
              </div>
            }
          />
          <div className={s.createSpacer} />
        </>
      )}

      <FilterSheet
        open={filterOpen}
        view={view}
        respTab={respTab}
        onChangeView={setView}
        onChangeRespTab={setRespTab}
        onClose={() => setFilterOpen(false)}
      />

      <BottomSheet open={soonOpen} title={soonTitle} onClose={() => setSoonOpen(false)}>
        <p className={s.soonText}>Раздел скоро появится — делаем его следующим шагом.</p>
      </BottomSheet>

      <RespondSheet order={respondOrder} onClose={() => setRespondOrder(null)} />

      {!isExpert && (
        <div className={s.createBar}>
          <Button
            onClick={() => {
              setSoonTitle("Создание заказа");
              setSoonOpen(true);
            }}
          >
            Создать заказ
          </Button>
        </div>
      )}
    </Screen>
  );
}
