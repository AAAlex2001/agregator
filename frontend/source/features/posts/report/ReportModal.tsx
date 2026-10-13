"use client";

import { useState } from "react";
import { reportPost, reportComment } from "@/source/entities/posts";
import { Modal } from "@/source/shared/ui/Modal";
import { TextArea } from "@/source/shared/ui/Inputs";
import Button from "@/source/shared/ui/Button";
import { Title } from "@/source/shared/ui/Typography";
import s from "./report.module.scss";

interface Props {
  id: number;
  kind: "post" | "comment";
  onClose: () => void;
}

/** Отправляет модератору причину жалобы. */
export function ReportModal({ id, kind, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !reason.trim()) return;
    setBusy(true);
    setError("");
    try {
      if (kind === "post") await reportPost(id, reason.trim());
      else await reportComment(id, reason.trim());
      setSent(true);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось отправить жалобу");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      open
      onClose={onClose}
      isBusy={busy}
      ariaLabel="Пожаловаться"
    >
      <form
        className={s.form}
        onSubmit={submit}
      >
        <Title text="Пожаловаться" />
        {sent ? (
          <>
            <p role="status">Жалоба отправлена модератору.</p>
            <Button onClick={onClose}>Готово</Button>
          </>
        ) : (
          <>
            <label htmlFor="post-report-reason">Расскажите, что не так</label>
            <TextArea
              id="post-report-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              maxLength={2000}
              placeholder="Причина жалобы"
            />
            {error && (
              <p
                className={s.error}
                role="alert"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              isLoading={busy}
              disabled={!reason.trim()}
            >
              Отправить жалобу
            </Button>
          </>
        )}
      </form>
    </Modal>
  );
}
