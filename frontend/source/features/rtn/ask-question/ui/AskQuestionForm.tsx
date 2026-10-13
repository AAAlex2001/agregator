"use client";

import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { useAskQuestion } from "../model/useAskQuestion";
import s from "./AskQuestionForm.module.scss";

const MAX_LENGTH = 4000;

interface AskQuestionFormProps {
  onSent: () => void;
}

/** Вопрос в Ростехнадзор: описание ситуации до 4000 знаков. */
export function AskQuestionForm({ onSent }: AskQuestionFormProps) {
  const { text, setText, isSending, submit } = useAskQuestion(onSent);

  return (
    <form className={s.form} onSubmit={submit}>
      <div className={s.formHead}>
        <Title text="Задать вопрос" as="h2" className={s.title} />
        <Subtitle
          text="Опишите ситуацию и укажите нормы или оборудование, по которым требуется официальное разъяснение."
          className={s.description}
        />
      </div>
      <label className={s.field}>
        <span>Текст вопроса</span>
        <textarea
          rows={6}
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Например: требуется ли экспертиза промышленной безопасности после замены..."
        />
      </label>
      <div className={s.formFooter}>
        <span className={s.counter}>
          {text.length} / {MAX_LENGTH}
        </span>
        <Button type="submit" variant="primary" isLoading={isSending}>
          Отправить вопрос
        </Button>
      </div>
    </form>
  );
}
