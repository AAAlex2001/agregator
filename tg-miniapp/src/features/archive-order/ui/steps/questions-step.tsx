import { Field } from "@/shared/ui";
import type { OrderQuestion } from "@/entites/order-question";
import s from "./questions-step.module.scss";

export function QuestionsStep({ questions }: { questions: OrderQuestion[] }) {
  return (
    <Field label="Вопросы по заказу">
      <div className={s.list}>
        {questions.map((q) => (
          <div key={q.id} className={s.item}>
            <p className={s.question}>{q.question}</p>
            <p className={s.answer}>{q.answer ? q.answer : "Заказчик не ответил"}</p>
          </div>
        ))}
      </div>
    </Field>
  );
}
