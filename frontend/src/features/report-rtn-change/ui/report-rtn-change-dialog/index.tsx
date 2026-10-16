"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { useReportRtnChange } from "../../model/use-report-rtn-change";
import styles from "./style.module.scss";

/** Разъяснение для сообщения и закрытие диалога после завершения работы. */
interface ReportRtnChangeDialogProps {
  clarificationId: number;
  onClose: () => void;
}

/** Показывает форму сообщения о неточности и благодарность после отправки. */
export function ReportRtnChangeDialog({
  clarificationId,
  onClose,
}: ReportRtnChangeDialogProps) {
  const { description, status, changeDescription, submit } = useReportRtnChange(
    clarificationId,
  );

  /** Передаёт текст из поля в состояние формы. */
  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    changeDescription(event.target.value);
  }

  /** Отправляет сообщение без перезагрузки страницы. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  return (
    <Modal
      open
      onClose={onClose}
      isBusy={status === "sending"}
      size="md"
      ariaLabelledBy="report-rtn-change-title"
    >
      <h2
        id="report-rtn-change-title"
        className={styles.title}
      >
        Сообщить об изменении
      </h2>
      {status === "sent" ? (
        <>
          <p className={styles.desc}>
            Спасибо! Модератор проверит разъяснение и обновит его при необходимости.
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={onClose}
          >
            Понятно
          </Button>
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <p className={styles.desc}>
            Если разъяснение устарело, отменено или в нём есть неточность — расскажите об этом.
          </p>
          <label className={styles.label}>
            Что изменилось
            <textarea
              className={styles.textarea}
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Например: письмо отменено новым разъяснением от..."
            />
          </label>
          <Button
            variant="primary"
            fullWidth
            type="submit"
            isLoading={status === "sending"}
          >
            Отправить
          </Button>
        </form>
      )}
    </Modal>
  );
}
