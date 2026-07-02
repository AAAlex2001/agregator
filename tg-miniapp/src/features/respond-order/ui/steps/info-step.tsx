import type { Order } from "@/entites/order";
import { formatDeadline } from "../../model/format";
import s from "./info-step.module.scss";
import c from "./common.module.scss";

export function InfoStep({ order }: { order: Order }) {
  return (
    <div className={c.step}>
      <div className={s.metrics}>
        <div className={s.metric}>
          <span className={s.mCap}>📅 Начало работ</span>
          <span className={s.mVal}>{order.start_date || "—"}</span>
        </div>
        <div className={s.metric}>
          <span className={s.mCap}>🏁 Окончание</span>
          <span className={s.mVal}>{order.date || "—"}</span>
        </div>
      </div>

      <div className={s.metrics}>
        <div className={s.metric}>
          <span className={s.mCap}>💰 Начальная цена</span>
          <span className={`${s.mVal} ${s.mAccent}`}>{order.sum || "Не определено"}</span>
        </div>
        <div className={s.metric}>
          <span className={s.mCap}>⏳ Приём откликов</span>
          <span className={`${s.mVal} ${s.mAccent}`}>
            {order.responses_deadline ? formatDeadline(order.responses_deadline) : "—"}
          </span>
        </div>
      </div>

      <div className={s.card}>
        {order.badges.length > 0 && (
          <div className={s.row}>
            <span className={s.hook}>🏷️</span>
            <span className={s.rl}>
              <span className={s.lab}>Требования к эксперту</span>
              <div className={s.chips}>
                {order.badges.map((b, i) => (
                  <span key={i} className={s.chip}>{b.text}</span>
                ))}
              </div>
            </span>
          </div>
        )}
        <div className={s.row}>
          <span className={s.hook}>🏢</span>
          <span className={s.rl}><span className={s.lab}>Организатор</span><div className={s.value}>{order.company || "—"}</div></span>
        </div>
        {order.customer_inn && (
          <div className={s.row}>
            <span className={s.hook}>#️⃣</span>
            <span className={s.rl}><span className={s.lab}>ИНН</span><div className={s.value}>{order.customer_inn}</div></span>
          </div>
        )}
      </div>

      <div className={s.section}>
        <span className={c.blockLab}>Название заказа</span>
        <div className={s.card}><div className={s.textBlock}><p className={s.desc}>{order.title}</p></div></div>
      </div>

      <div className={s.section}>
        <span className={c.blockLab}>Комментарий к заказу</span>
        <div className={s.card}>
          <div className={s.textBlock}>
            <p className={`${s.desc} ${order.comment ? "" : s.muted}`}>
              {order.comment || "Комментарий отсутствует"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
