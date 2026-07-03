import { useEffect, useState } from "react";
import { Button, Spinner } from "@/shared/ui";
import { Toggle } from "@/shared/ui/toggle";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { fetchOrderQuestions, askOrderQuestion, type OrderQuestion } from "@/entites/order-question";
import s from "./questions-step.module.scss";
import c from "./common.module.scss";

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
    <div className={c.step}>
      <span className={c.blockLab}>Вопросы по заказу</span>

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
        className={c.textarea}
        maxLength={2000}
        placeholder="Задайте вопрос — его увидит только заказчик…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={s.toggleRow}>
        <div className={s.toggleText}>
          <span className={s.toggleTitle}>Задать анонимно</span>
          <span className={s.toggleHint}>Вопрос и ответ увидите только вы и заказчик</span>
        </div>
        <Toggle on={anon} onChange={setAnon} />
      </div>
      <div className={s.qaActions}>
        <span className={s.counter}>{text.length} / 2000</span>
        <Button
          style={{ width: "auto", height: 42, padding: "0 18px" }}
          disabled={!text.trim()}
          loading={busy}
          onClick={() => void ask()}
        >
          Задать вопрос
        </Button>
      </div>
    </div>
  );
}
