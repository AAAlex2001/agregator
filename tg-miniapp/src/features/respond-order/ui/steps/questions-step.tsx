import { useEffect, useState } from "react";
import { Spinner } from "@/shared/ui";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { fetchOrderQuestions, askOrderQuestion, type OrderQuestion } from "@/entites/order-question";
import s from "../respond-sheet.module.scss";

export function QuestionsStep({ orderId }: { orderId: number }) {
  const [items, setItems] = useState<OrderQuestion[] | null>(null);
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetchOrderQuestions(orderId)
      .then((r) => active && setItems(r.items))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, [orderId]);

  const ask = async () => {
    const question = text.trim();
    if (!question || busy) return;
    setBusy(true);
    try {
      const created = await askOrderQuestion(orderId, question, anon);
      setItems((prev) => [created, ...(prev ?? [])]);
      setText("");
      notifyHaptic("success");
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить вопрос");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.step}>
      <span className={s.blockLab}>Вопросы по заказу</span>

      {items === null ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}><Spinner /></div>
      ) : items.length === 0 ? (
        <span className={s.qaEmpty}>Вопросов пока нет.</span>
      ) : (
        <div className={s.qaList}>
          {items.map((q) => (
            <div key={q.id} className={s.qaItem}>
              <div className={s.qaQ}>{q.question}</div>
              <div className={s.qaA}>{q.answer ? `Ответ: ${q.answer}` : "Ожидает ответа заказчика"}</div>
            </div>
          ))}
        </div>
      )}

      <textarea
        className={s.textarea}
        maxLength={2000}
        placeholder="Задайте вопрос — его увидит только заказчик…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={s.checkline} onClick={() => setAnon((v) => !v)}>
        <span className={`${s.cbx} ${anon ? s.cbxOn : ""}`}>{anon ? "✓" : ""}</span>
        Задать анонимно — вопрос и ответ увидите только вы и заказчик
      </div>
      <div className={s.qaActions}>
        <span className={s.counter}>{text.length} / 2000</span>
        <button
          className={`${s.btn} ${s.btnPrimary}`}
          style={{ flex: "none", height: 42, padding: "0 18px" }}
          disabled={!text.trim() || busy}
          onClick={() => void ask()}
        >
          Задать вопрос
        </button>
      </div>
    </div>
  );
}
