"use client";

import Button from "@/source/shared/ui/Button";
import { Modal } from "@/source/shared/ui/Modal";
import { useReportChange } from "../model/useReportChange";
import s from "./ReportChangeModal.module.scss";

interface ReportChangeModalProps {
  clarificationId: number;
  onClose: () => void;
}

/** Окно «Сообщить об изменении»: форма, после отправки — благодарность. */
export function ReportChangeModal({ clarificationId, onClose }: ReportChangeModalProps) {
  const { description, setDescription, status, submit } = useReportChange(clarificationId);

  return (
    <Modal open onClose={onClose} isBusy={status === "sending"} size="md" ariaLabelledBy="report-rtn-change-title">
      <h2 id="report-rtn-change-title" className={s.title}>
        Сообщить об изменении
      </h2>

      {status === "sent" ? (
        <>
          <p className={s.desc}>Спасибо! Модератор проверит разъяснение и обновит его при необходимости.</p>
          <Button variant="primary" fullWidth onClick={onClose}>
            Понятно
          </Button>
        </>
      ) : (
        <form onSubmit={submit} className={s.form}>
          <p className={s.desc}>Если разъяснение устарело, отменено или в нём есть неточность — расскажите об этом.</p>
          <label className={s.label}>
            Что изменилось
            <textarea
              className={s.textarea}
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Например: письмо отменено новым разъяснением от..."
            />
          </label>
          <Button variant="primary" fullWidth type="submit" isLoading={status === "sending"}>
            Отправить
          </Button>
        </form>
      )}
    </Modal>
  );
}
