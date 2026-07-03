import { useEffect, useState } from "react";
import { Spinner } from "@/shared/ui";
import { emitError } from "@/shared/services/error-bus";
import { fetchOrderQuestions, type OrderQuestion } from "@/entites/order-question";
import s from "./questions-screen.module.scss";
import c from "./common.module.scss";

export function QuestionsScreen({ orderId }: { orderId: number }) {
  const [questions, setQuestions] = useState<OrderQuestion[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchOrderQuestions(orderId)
      .then((r) => active && setQuestions(r.items))
      .catch((e) => {
        if (!active) return;
        emitError(e instanceof Error ? e.message : "Не удалось загрузить вопросы");
        setQuestions([]);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <div className={c.group}>
      <span className={c.blockLab}>Вопросы по заказу</span>
      {questions === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : questions.length === 0 ? (
        <div className={c.block}>
          <p className={c.comment}>Вопросов пока нет.</p>
        </div>
      ) : (
        <div className={s.list}>
          {questions.map((q) => (
            <div key={q.id} className={s.item}>
              <div className={s.question}>{q.question}</div>
              <div className={s.answer}>{q.answer ? `Ответ: ${q.answer}` : "Без ответа"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
