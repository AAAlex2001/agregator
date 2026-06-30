import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/entites/session";
import { useOrders, OrderCard, type Order } from "@/entites/order";
import { RespondSheet } from "@/features/respond-order";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Button, Card, BottomSheet, Logo, Spinner } from "@/shared/ui";
import { UserIcon } from "@/shared/ui/icons/interface";
import { EmptyOrdersIcon } from "@/shared/ui/icons/empty";
import s from "./style.module.scss";

export function HomePage() {
  const { role } = useSession();
  const navigate = useNavigate();
  const { orders } = useOrders(12);
  const [soonOpen, setSoonOpen] = useState(false);
  const [soonTitle, setSoonTitle] = useState("");
  const [respondOrder, setRespondOrder] = useState<Order | null>(null);

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
      <p className={s.sectionTitle}>{isExpert ? "Лента заказов" : "Мои заказы"}</p>

      {orders === null ? (
        <div className={s.feedLoading}>
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        isExpert ? (
          <Card className={s.empty}>Пока нет подходящих заказов</Card>
        ) : (
          <div className={s.emptyState}>
            <EmptyOrdersIcon />
            <p className={s.emptyTitle}>Вы ещё не создали ни одного заказа</p>
            <p className={s.emptySub}>
              Опубликуйте заказ, чтобы получить отклики от экспертов по промышленной безопасности
            </p>
          </div>
        )
      ) : (
        <div className={s.feed}>
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onClick={() => {
                if (isExpert) {
                  setRespondOrder(o);
                } else {
                  setSoonTitle(o.title);
                  setSoonOpen(true);
                }
              }}
            />
          ))}
        </div>
      )}

      {!isExpert && <div className={s.createSpacer} />}

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
