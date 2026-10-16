"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { useAskRtnQuestion } from "../../model/use-ask-rtn-question";
import styles from "./style.module.scss";

/** Предельная длина обращения, принимаемая сервером. */
const MAX_QUESTION_LENGTH = 4000;

/** Уведомление списка обращений об успешно отправленном вопросе. */
interface AskRtnQuestionFormProps {
  onSent: () => void;
}

/** Показывает форму обращения в Ростехнадзор со счётчиком знаков. */
export function AskRtnQuestionForm({ onSent }: AskRtnQuestionFormProps) {
  const { text, setText, isSending, submit } = useAskRtnQuestion(onSent);

  /** Обновляет описание ситуации по мере ввода. */
  function changeText(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  /** Отправляет обращение без перезагрузки страницы. */
  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  return (
    <form
      className={styles.form}
      onSubmit={submitForm}
    >
      <div className={styles.formHead}>
        <Title
          text="Задать вопрос"
          as="h2"
          className={styles.title}
        />
        <Subtitle
          text={
            "Опишите ситуацию и укажите нормы или оборудование, "
            + "по которым требуется официальное разъяснение."
          }
          className={styles.description}
        />
      </div>
      <label className={styles.field}>
        <span>Текст вопроса</span>
        <textarea
          rows={6}
          value={text}
          onChange={changeText}
          maxLength={MAX_QUESTION_LENGTH}
          placeholder="Например: требуется ли экспертиза промышленной безопасности после замены..."
        />
      </label>
      <div className={styles.formFooter}>
        <span className={styles.counter}>
          {text.length} / {MAX_QUESTION_LENGTH}
        </span>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSending}
        >
          Отправить вопрос
        </Button>
      </div>
    </form>
  );
}
