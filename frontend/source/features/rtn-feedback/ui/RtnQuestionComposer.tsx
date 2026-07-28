"use client";

import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { useRtnQuestionSubmit } from "../model/useRtnQuestionSubmit";
import s from "./RtnQuestionComposer.module.scss";

interface Props {
  onSubmitted: () => void;
}

export function RtnQuestionComposer({ onSubmitted }: Props) {
  const { questionText, busy, changeQuestion, submit } =
    useRtnQuestionSubmit(onSubmitted);

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
          value={questionText}
          onChange={(event) => changeQuestion(event.target.value)}
          maxLength={4000}
          placeholder="Например: требуется ли экспертиза промышленной безопасности после замены..."
        />
      </label>
      <div className={s.formFooter}>
        <span className={s.counter}>{questionText.length} / 4000</span>
        <Button type="submit" variant="primary" isLoading={busy}>
          Отправить вопрос
        </Button>
      </div>
    </form>
  );
}
