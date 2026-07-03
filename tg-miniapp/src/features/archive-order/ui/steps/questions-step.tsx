import { Field } from "@/shared/ui";
import { QuestionItem, type OrderQuestion } from "@/entites/order-question";
import s from "./questions-step.module.scss";

export function QuestionsStep({ questions }: { questions: OrderQuestion[] }) {
  return (
    <Field label="Вопросы по заказу">
      <div className={s.list}>
        {questions.map((q) => (
          <QuestionItem key={q.id} question={q.question} answer={q.answer ? q.answer : "Заказчик не ответил"} />
        ))}
      </div>
    </Field>
  );
}
