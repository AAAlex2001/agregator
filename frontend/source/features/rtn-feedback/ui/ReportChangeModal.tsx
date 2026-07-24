"use client";

import { useState, type FormEvent } from "react";
import { Button, Modal } from "@/source/shared/ui";
import { reportRtnChange } from "../api/rtnFeedback.api";
import s from "./RtnFeedbackModal.module.scss";

interface Props {
  open: boolean;
  clarificationId: number;
  onClose: () => void;
}

export function ReportChangeModal({ open, clarificationId, onClose }: Props) {
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const close = () => {
    onClose();
    setTimeout(() => {
      setDescription("");
      setError("");
      setSent(false);
    }, 200);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = description.trim();
    if (!value) {
      setError("Опишите, что изменилось");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await reportRtnChange(clarificationId, value);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить сообщение");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} isBusy={busy} size="md" ariaLabelledBy="report-rtn-change-title">
      <h2 id="report-rtn-change-title" className={s.title}>
        Сообщить об изменении
      </h2>

      {sent ? (
        <>
          <p className={s.desc}>Спасибо! Модератор проверит разъяснение и обновит его при необходимости.</p>
          <Button variant="primary" fullWidth onClick={close}>
            Понятно
          </Button>
        </>
      ) : (
        <form onSubmit={submit} className={s.form}>
          <p className={s.desc}>
            Если разъяснение устарело, отменено или в нём есть неточность — расскажите об этом.
          </p>
          <label className={s.label}>
            Что изменилось
            <textarea
              className={s.textarea}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: письмо отменено новым разъяснением от..."
            />
          </label>
          {error && <span className={s.error}>{error}</span>}
          <Button variant="primary" fullWidth type="submit" isLoading={busy}>
            Отправить
          </Button>
        </form>
      )}
    </Modal>
  );
}
