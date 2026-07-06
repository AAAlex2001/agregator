import { Button, Field, TextArea } from "@/shared/ui";
import { QuestionItem, type OrderQuestion } from "@/entites/order-question";
import s from "./questions-step.module.scss";

interface Props {
  questions: OrderQuestion[];
  canAnswer: boolean;
  drafts: Record<number, string>;
  answeringId: number | null;
  onDraft: (questionId: number, text: string) => void;
  onAnswer: (questionId: number) => void;
}

export function QuestionsStep({ questions, canAnswer, drafts, answeringId, onDraft, onAnswer }: Props) {
  return (
    <Field label="Вопросы по заказу">
      <div className={s.list}>
        {questions.map((q) => (
          <div key={q.id} className={s.item}>
            <QuestionItem
              question={q.question}
              answer={q.answer ? q.answer : canAnswer ? "Без ответа" : "Заказчик не ответил"}
            />
            {canAnswer && !q.answer && (
              <div className={s.answerForm}>
                <TextArea
                  placeholder="Ваш ответ эксперту…"
                  value={drafts[q.id] ?? ""}
                  onChange={(e) => onDraft(q.id, e.target.value)}
                />
                <Button
                  className={s.answerBtn}
                  loading={answeringId === q.id}
                  disabled={!(drafts[q.id] ?? "").trim()}
                  onClick={() => onAnswer(q.id)}
                >
                  Ответить
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Field>
  );
}
