"use client";

import { useState, type FormEvent } from "react";
import { Button, Modal } from "@/source/shared/ui";
import { EmailInput } from "@/source/shared/ui/Inputs";
import { submitRtnQuestion } from "../api/rtnFeedback.api";
import s from "./RtnFeedbackModal.module.scss";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AskRtnQuestionForm({ open, onClose }: Props) {
  const [questionText, setQuestionText] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const close = () => {
    onClose();
    setTimeout(() => {
      setQuestionText("");
      setContactEmail("");
      setError("");
      setSent(false);
    }, 200);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = questionText.trim();
    if (!value) {
      setError("Опишите ваш вопрос");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await submitRtnQuestion(value, contactEmail.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить вопрос");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} isBusy={busy} size="md" ariaLabelledBy="ask-rtn-question-title">
      <h2 id="ask-rtn-question-title" className={s.title}>
        Не нашли ответ?
      </h2>

      {sent ? (
        <>
          <p className={s.desc}>
            Спасибо! Мы официально запросим разъяснение Ростехнадзора и опубликуем ответ в этом разделе.
          </p>
          <Button variant="primary" fullWidth onClick={close}>
            Понятно
          </Button>
        </>
      ) : (
        <form onSubmit={submit} className={s.form}>
          <p className={s.desc}>
            Отправьте вопрос — мы официально запросим разъяснение Ростехнадзора и опубликуем ответ в этом разделе.
          </p>
          <label className={s.label}>
            Ваш вопрос
            <textarea
              className={s.textarea}
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Опишите ситуацию и что именно нужно уточнить у Ростехнадзора"
            />
          </label>
          <label className={s.label}>
            Email для ответа (необязательно)
            <EmailInput
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@company.ru"
            />
          </label>
          {error && <span className={s.error}>{error}</span>}
          <Button variant="primary" fullWidth type="submit" isLoading={busy}>
            Отправить вопрос
          </Button>
        </form>
      )}
    </Modal>
  );
}
