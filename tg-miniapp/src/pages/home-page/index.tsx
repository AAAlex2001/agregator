import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/entites/session";
import { useOrders } from "@/entites/order";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Card, BottomSheet, Logo, Spinner } from "@/shared/ui";
import { UserIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

export function HomePage() {
  const { role } = useSession();
  const navigate = useNavigate();
  const { orders } = useOrders(12);
  const [soonOpen, setSoonOpen] = useState(false);
  const [soonTitle, setSoonTitle] = useState("");

  const isExpert = role === "EXPERT";

  return (
    <Screen
      title={
        <>
          <Logo size={28} className={s.logoMark} />
          Ресурс-Плюс
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
    >
      <p className={s.sectionTitle}>{isExpert ? "Лента заказов" : "Мои заказы"}</p>

      {orders === null ? (
        <div className={s.feedLoading}>
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <Card className={s.empty}>
          {isExpert ? "Пока нет подходящих заказов" : "У вас пока нет заказов"}
        </Card>
      ) : (
        <div className={s.feed}>
          {orders.map((o) => (
            <Card
              key={o.id}
              className={s.orderCard}
              onClick={() => {
                setSoonTitle(o.title);
                setSoonOpen(true);
              }}
            >
              <div className={s.orderTop}>
                <span className={s.orderTitle}>{o.title}</span>
                <span className={s.orderSum}>{o.sum}</span>
              </div>
              {o.company && <span className={s.orderCompany}>{o.company}</span>}
              {o.badges.length > 0 && (
                <div className={s.orderBadges}>
                  {o.badges.slice(0, 4).map((b, i) => (
                    <span key={i} className={s.orderBadge}>
                      {b.text}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <BottomSheet open={soonOpen} title={soonTitle} onClose={() => setSoonOpen(false)}>
        <p className={s.soonText}>Раздел скоро появится — делаем его следующим шагом.</p>
      </BottomSheet>
    </Screen>
  );
}
