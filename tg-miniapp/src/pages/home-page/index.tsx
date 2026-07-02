import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/session";
import { type Order } from "@/entites/order";
import { RespondSheet } from "@/features/respond-order";
import { ResponsesPanel } from "@/features/responses";
import { OrdersPanel } from "@/features/order-feed";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Button, BottomSheet, Logo } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { UserIcon } from "@/shared/ui/icons/interface";
import { EmptyOrdersIcon } from "@/shared/ui/icons/empty";
import s from "./style.module.scss";

const TOP_TABS = [
  { id: "orders", label: "Все заказы" },
  { id: "responses", label: "Мои отклики" },
  { id: "archive", label: "Архив" },
];

export function HomePage() {
  const { role } = useSession();
  const navigate = useNavigate();
  const [topTab, setTopTab] = useState("orders");
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
          <Tabs items={TOP_TABS} active={topTab} onChange={setTopTab} />
          {topTab === "orders" && (
            <OrdersPanel
              onOpen={openRespond}
              empty={<p className={s.emptyLine}>Пока нет подходящих заказов</p>}
            />
          )}
          {topTab === "responses" && <ResponsesPanel />}
          {topTab === "archive" && (
            <OrdersPanel archived limit={20} empty={<p className={s.emptyLine}>Архив пуст</p>} />
          )}
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
