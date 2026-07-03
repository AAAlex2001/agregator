import { Button, Field, Spinner, TextArea } from "@/shared/ui";
import { Toggle } from "@/shared/ui/toggle";
import { useOrderQuestions } from "../../model/use-order-questions";
import s from "./questions-step.module.scss";

export function QuestionsStep({ orderId }: { orderId: number }) {
  const { state, dispatch, ask } = useOrderQuestions(orderId);

  return (
    <>
      <Field label="Вопросы по заказу">
        {state.items === null ? (
          <div className={s.loading}>
            <Spinner />
          </div>
        ) : state.items.length === 0 ? (
          <span className={s.qaEmpty}>Вопросов пока нет.</span>
        ) : (
          <div className={s.qaList}>
            {state.items.map((q) => (
              <div key={q.id} className={s.qaItem}>
                <div className={s.qaQ}>{q.question}</div>
                <div className={s.qaA}>{q.answer ? `Ответ: ${q.answer}` : "Ожидает ответа заказчика"}</div>
              </div>
            ))}
          </div>
        )}
      </Field>

      <TextArea
        maxLength={2000}
        placeholder="Задайте вопрос — его увидит только заказчик…"
        value={state.text}
        onChange={(e) => dispatch({ type: "text", value: e.target.value })}
      />
      <div className={s.toggleRow}>
        <div className={s.toggleText}>
          <span className={s.toggleTitle}>Задать анонимно</span>
          <span className={s.toggleHint}>Вопрос и ответ увидите только вы и заказчик</span>
        </div>
        <Toggle on={state.anon} onChange={(value) => dispatch({ type: "anon", value })} />
      </div>
      <div className={s.qaActions}>
        <span className={s.counter}>{state.text.length} / 2000</span>
        <Button className={s.askBtn} disabled={!state.text.trim()} loading={state.busy} onClick={() => void ask()}>
          Задать вопрос
        </Button>
      </div>
    </>
  );
}
